// 旅誌 Worker：/api/* 讀寫 D1；其他路徑交給靜態檔案（public/）。
// 權限只看請求標頭裡的密鑰（EDIT_KEY），旅伴不需要帳號。
import seed from './seed.js';

const SEG = /^[A-Za-z0-9_\-.~:@+]{1,200}$/;
const MAX_BODY = 256 * 1024;
const MAX_DOCS = 5000;
const MAX_BATCH = 300;
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

async function api(request, env, path) {
  if (!env.DB) return json({ error: 'no_db', message: '找不到 D1 資料庫綁定（名稱要叫 DB）' }, 500);
  if (!env.EDIT_KEY) return json({ error: 'no_key', message: '尚未設定 EDIT_KEY 密碼' }, 500);
  if (request.headers.get('x-edit-key') !== env.EDIT_KEY) return json({ error: 'bad_key' }, 401);

  const db = env.DB;
  await ensure(db);
  const method = request.method;

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
