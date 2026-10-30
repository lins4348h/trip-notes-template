// 旅誌 Worker：/api/* 讀寫 D1；其他路徑交給靜態檔案（public/）。
// 權限只看密鑰（EDIT_KEY），旅伴不需要帳號。
import seed from './seed.js';
import { DICT } from './keywords.js';

const SEG = /^[A-Za-z0-9_\-.~:@+]{1,200}$/;
const MAX_BODY = 256 * 1024;
const MAX_DOCS = 5000;
const MAX_BATCH = 300;
const MAX_PHOTO = 1500 * 1024;          // 壓縮後單張大圖上限
const MAX_THUMB = 200 * 1024;
const DB_LIMIT = 500 * 1024 * 1024;     // D1 免費方案單一資料庫上限
const TRASH_DAYS = 30;
const AI_MODEL = '@cf/meta/llama-3.1-8b-instruct-fast';
const AI_FALLBACK = '@cf/meta/m2m100-1.2b';
let ready = false;

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

async function ensure(db) {
  if (ready) return;
  await db.prepare(
    'CREATE TABLE IF NOT EXISTS docs (col TEXT NOT NULL, id TEXT NOT NULL, data TEXT NOT NULL, deleted INTEGER NOT NULL DEFAULT 0, updated_at INTEGER NOT NULL, PRIMARY KEY (col, id))'
  ).run();
  await db.prepare('CREATE INDEX IF NOT EXISTS docs_updated ON docs (updated_at)').run();
  await db.prepare('CREATE TABLE IF NOT EXISTS photos (id TEXT PRIMARY KEY, full BLOB NOT NULL, thumb BLOB NOT NULL, mime TEXT NOT NULL, created_at INTEGER NOT NULL)').run();
  const { n } = await db.prepare('SELECT COUNT(*) AS n FROM docs').first();
  if (n === 0) {
    const now = Date.now();
    const ins = db.prepare('INSERT OR IGNORE INTO docs (col, id, data, deleted, updated_at) VALUES (?, ?, ?, 0, ?)');
    await db.batch(seed.map(d => ins.bind(d.col, d.id, JSON.stringify(d.data), now)));
  }
  ready = true;
}

async function readJson(request) {
  const text = await request.text();
  if (text.length > MAX_BODY * 4) throw new Error('too_large');
  return JSON.parse(text);
}
const isObj = v => v && typeof v === 'object' && !Array.isArray(v);

function stmt(db, op, col, id, data, now) {
  if (!SEG.test(col) || !SEG.test(id)) throw new Error('bad_path');
  if (op === 'put') {
    if (!isObj(data)) throw new Error('not_object');
    const s = JSON.stringify(data); if (s.length > MAX_BODY) throw new Error('too_large');
    return db.prepare(
      'INSERT INTO docs (col, id, data, deleted, updated_at) VALUES (?, ?, ?, 0, ?) ON CONFLICT (col, id) DO UPDATE SET data = excluded.data, deleted = 0, updated_at = excluded.updated_at'
    ).bind(col, id, s, now);
  }
  if (op === 'patch') {
    if (!isObj(data)) throw new Error('not_object');
    return db.prepare('UPDATE docs SET data = json_patch(data, ?), updated_at = ? WHERE col = ? AND id = ? AND deleted = 0')
      .bind(JSON.stringify(data), now, col, id);
  }
  if (op === 'delete') {
    return db.prepare("UPDATE docs SET data = '{}', deleted = 1, updated_at = ? WHERE col = ? AND id = ?").bind(now, col, id);
  }
  throw new Error('bad_op');
}

const toBytes = v => (v instanceof ArrayBuffer ? new Uint8Array(v) : v instanceof Uint8Array ? v : Uint8Array.from(v || []));

// 照片回收桶超過 30 天就永久刪除
async function purgeTrash(db) {
  const cutoff = Date.now() - TRASH_DAYS * 86400000;
  const { results } = await db.prepare(
    "SELECT id FROM docs WHERE col = 'photos' AND deleted = 0 AND json_extract(data, '$.trashedAt') < ?"
  ).bind(cutoff).all();
  if (!results.length) return;
  const now = Date.now();
  await db.batch(results.flatMap(r => [
    db.prepare('DELETE FROM photos WHERE id = ?').bind(r.id),
    stmt(db, 'delete', 'photos', r.id, null, now),
  ]));
}

async function photoUsage(db) {
  const r = await db.prepare('SELECT COUNT(*) AS n, COALESCE(SUM(LENGTH(full) + LENGTH(thumb)), 0) AS bytes FROM photos').first();
  return { count: r.n, bytes: r.bytes, limit: DB_LIMIT };
}

// 把中文主題轉成英文圖示關鍵字：先查內建字典，再問 Workers AI
async function keywords(env, q) {
  q = q.trim().slice(0, 40);
  if (!q) return { keywords: [], source: 'none' };
  if (/^[\x00-\x7F]+$/.test(q)) return { keywords: q.toLowerCase().split(',').map(s => s.trim()).filter(Boolean).slice(0, 4), source: 'english' };
  const hit = Object.keys(DICT).filter(k => q.includes(k)).sort((a, b) => b.length - a.length).flatMap(k => DICT[k]);
  if (hit.length) return { keywords: [...new Set(hit)].slice(0, 4), source: 'dict' };
  if (!env.AI) return { keywords: [], source: 'none' };
  // 圖示庫用單字比較好找：多字片語之外，再補上每個字
  const clean = t => {
    const phrases = String(t || '').toLowerCase().replace(/[^a-z,\s-]/g, ' ').split(/[,\n]+/).map(s => s.trim()).filter(s => s && s.length < 24);
    const words = phrases.flatMap(p => p.split(/\s+/)).filter(w => w.length > 2 && !['the', 'and', 'with'].includes(w));
    return [...new Set([...phrases.filter(p => !p.includes(' ')), ...words.reverse(), ...phrases])].slice(0, 4);
  };
  try {
    const r = await env.AI.run(AI_MODEL, {
      messages: [
        { role: 'system', content: 'You turn a travel activity or place into English search words for a simple icon library. Reply with 3 different common English nouns, ONE word each, that an icon could show (for example: ghost, house, boxing). Comma separated, lowercase, nothing else.' },
        { role: 'user', content: q },
      ],
      max_tokens: 24,
    });
    const k = clean(r && r.response);
    if (k.length) return { keywords: k, source: 'ai' };
  } catch (e) { /* 改用翻譯模型 */ }
  try {
    const r = await env.AI.run(AI_FALLBACK, { text: q, source_lang: 'chinese', target_lang: 'english' });
    const k = clean(r && r.translated_text);
    if (k.length) return { keywords: k, source: 'ai' };
  } catch (e) { /* AI 無法使用 */ }
  return { keywords: [], source: 'none' };
}

async function photoApi(request, env, path, db) {
  const method = request.method;
  // POST /api/photo：multipart，欄位 full、thumb（JPEG）與 meta（JSON）
  if (path.length === 1 && method === 'POST') {
    const usage = await photoUsage(db);
    if (usage.bytes > DB_LIMIT * 0.97) return json({ error: 'quota_exceeded', message: '照片空間已滿' }, 413);
    const form = await request.formData();
    const full = form.get('full'), thumb = form.get('thumb');
    let meta = {};
    try { meta = JSON.parse(form.get('meta') || '{}'); } catch (e) {}
    if (!full || !thumb || typeof full === 'string' || typeof thumb === 'string') return json({ error: 'invalid_argument', message: '缺少照片' }, 400);
    if (full.size > MAX_PHOTO || thumb.size > MAX_THUMB) return json({ error: 'too_large', message: '照片太大' }, 413);
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 20), now = Date.now();
    const doc = {
      item: String(meta.item || '').slice(0, 200), day: Number(meta.day) || 0, by: String(meta.by || '').slice(0, 40),
      w: Number(meta.w) || 0, h: Number(meta.h) || 0, size: full.size + thumb.size, createdAt: now,
    };
    await db.batch([
      db.prepare('INSERT INTO photos (id, full, thumb, mime, created_at) VALUES (?, ?, ?, ?, ?)')
        .bind(id, new Uint8Array(await full.arrayBuffer()), new Uint8Array(await thumb.arrayBuffer()), 'image/jpeg', now),
      stmt(db, 'put', 'photos', id, doc, now),
    ]);
    if (Math.random() < 0.1) await purgeTrash(db);
    return json({ ok: true, id, doc, now });
  }
  // GET /api/photo/usage：已用空間
  if (path.length === 2 && path[1] === 'usage' && method === 'GET') {
    await purgeTrash(db);
    return json(await photoUsage(db));
  }
  // GET /api/photo/<id>?s=thumb|full：取得圖片（瀏覽器可長期快取）
  if (path.length === 2 && SEG.test(path[1]) && method === 'GET') {
    const size = new URL(request.url).searchParams.get('s') === 'full' ? 'full' : 'thumb';
    const row = await db.prepare(`SELECT ${size} AS img, mime FROM photos WHERE id = ?`).bind(path[1]).first();
    if (!row) return new Response('not found', { status: 404 });
    return new Response(toBytes(row.img), {
      headers: { 'content-type': row.mime, 'cache-control': 'private, max-age=31536000, immutable' },
    });
  }
  // DELETE /api/photo/<id>：永久刪除（回收桶裡按「永久刪除」）
  if (path.length === 2 && SEG.test(path[1]) && method === 'DELETE') {
    await db.batch([db.prepare('DELETE FROM photos WHERE id = ?').bind(path[1]), stmt(db, 'delete', 'photos', path[1], null, Date.now())]);
    return json({ ok: true });
  }
  return json({ error: 'not_found' }, 404);
}

async function api(request, env, path) {
  if (!env.DB) return json({ error: 'no_db', message: '找不到 D1 資料庫綁定（名稱要叫 DB）' }, 500);
  if (!env.EDIT_KEY) return json({ error: 'no_key', message: '尚未設定 EDIT_KEY 密碼' }, 500);
  // 圖片用 <img> 載入無法帶標頭，所以照片網址允許用 ?k= 帶密鑰
  const url = new URL(request.url);
  const key = request.headers.get('x-edit-key') || (path[0] === 'photo' && request.method === 'GET' ? url.searchParams.get('k') : null);
  if (key !== env.EDIT_KEY) return json({ error: 'bad_key' }, 401);

  const db = env.DB;
  await ensure(db);
  const method = request.method;

  if (path[0] === 'photo') return photoApi(request, env, path, db);
  if (path[0] === 'keywords' && method === 'GET') return json(await keywords(env, url.searchParams.get('q') || ''));

  // GET /api/sync?since=<ms>：回傳 since 之後變動的文件（含刪除標記）
  if (path[0] === 'sync' && path.length === 1 && method === 'GET') {
    const now = Date.now();
    const since = Number(new URL(request.url).searchParams.get('since')) || 0;
    const { results } = since > 0
      ? await db.prepare('SELECT col, id, data, deleted FROM docs WHERE updated_at > ?').bind(since).all()
      : await db.prepare('SELECT col, id, data, deleted FROM docs WHERE deleted = 0').all();
    return json({
      now,
      docs: results.map(r => ({ col: r.col, id: r.id, deleted: !!r.deleted, data: r.deleted ? null : JSON.parse(r.data) })),
    });
  }

  try {
    // POST /api/batch：一次多筆寫入（清空範例、設定旅程時用）
    if (path[0] === 'batch' && path.length === 1 && method === 'POST') {
      const { ops } = await readJson(request);
      if (!Array.isArray(ops) || !ops.length || ops.length > MAX_BATCH) throw new Error('bad_batch');
      const now = Date.now();
      await db.batch(ops.map(o => stmt(db, o.op, o.col, o.id, o.data, now)));
      return json({ ok: true, now });
    }

    // /api/doc/<col>/<id>：PUT 整份取代、PATCH 合併欄位、DELETE 刪除
    if (path[0] === 'doc' && path.length === 3) {
      const [, col, id] = path;
      const now = Date.now();
      if (method === 'PUT') {
        const exists = await db.prepare('SELECT 1 FROM docs WHERE col = ? AND id = ?').bind(col, id).first();
        if (!exists) {
          const { n } = await db.prepare('SELECT COUNT(*) AS n FROM docs WHERE deleted = 0').first();
          if (n >= MAX_DOCS) return json({ error: 'quota_exceeded' }, 413);
        }
        await stmt(db, 'put', col, id, await readJson(request), now).run();
        return json({ ok: true, now });
      }
      if (method === 'PATCH') {
        const r = await stmt(db, 'patch', col, id, await readJson(request), now).run();
        if (!r.meta.changes) return json({ error: 'not_found' }, 404);
        return json({ ok: true, now });
      }
      if (method === 'DELETE') {
        await stmt(db, 'delete', col, id, null, now).run();
        return json({ ok: true, now });
      }
    }
  } catch (e) {
    return json({ error: 'invalid_argument', message: String(e.message || e) }, 400);
  }
  return json({ error: 'not_found' }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) {
      const path = url.pathname.slice(5).split('/').filter(Boolean).map(decodeURIComponent);
      return api(request, env, path);
    }
    return env.ASSETS.fetch(request);
  },
};
