// 資料連線：提供 app.js 使用的 db／user 介面（沿用 claude.ai 的寫法），實際呼叫自己的 /api（Cloudflare D1）。
// 權限只看網址裡的密鑰 #k=...，不用登入帳號。
(function () {
  if (window.claude) return;
  const KEY = 'trip.key', NAME = 'trip.name', POLL_MS = 4000, IDLE_POLL_MS = 15000, IDLE_AFTER_MS = 60000;
  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  };
  const m = /[#&]k=([^&]+)/.exec(location.hash);
  if (m) ls.set(KEY, decodeURIComponent(m[1]));
  const key = ls.get(KEY) || '';
  const headers = { 'x-edit-key': key, 'content-type': 'application/json' };

  /* ---------- local mirror of the database ---------- */
  const store = new Map();                       // col -> Map(id -> data)
  const colListeners = new Map(), docListeners = new Map();
  const colMap = c => { let x = store.get(c); if (!x) store.set(c, x = new Map()); return x; };
  const meta = { fromCache: false, hasPendingWrites: false };
  const snapDoc = (c, id) => { const d = colMap(c).get(id); return { id, exists: !!d, data: () => d, metadata: meta }; };
  const snapCol = c => {
    const docs = [...colMap(c).keys()].map(id => snapDoc(c, id));
    return { docs, size: docs.length, empty: !docs.length, docChanges: () => [], metadata: meta };
  };
  function emit(cols) {
    for (const c of cols) {
      (colListeners.get(c) || []).forEach(cb => cb(snapCol(c)));
      for (const [p, set] of docListeners) { const [dc, di] = p.split('/'); if (dc === c) set.forEach(cb => cb(snapDoc(dc, di))); }
    }
  }
  const merge = (a, b) => {
    const out = { ...a };
    for (const [k, v] of Object.entries(b)) {
      if (v === null) delete out[k];
      else if (typeof v === 'object' && !Array.isArray(v) && typeof out[k] === 'object' && out[k] && !Array.isArray(out[k])) out[k] = merge(out[k], v);
      else out[k] = v;
    }
    return out;
  };

  /* ---------- sync loop ---------- */
  let since = 0, loaded = false, failed = 0, stopped = false;
  let markReady; const ready = new Promise(r => (markReady = r));
  function status(s, t) {
    const el = document.getElementById('sync'); if (!el) return;
    el.dataset.s = s; const sp = el.querySelector('span'); if (sp) sp.textContent = t;
  }
  async function sync(full) {
    if (stopped) return;
    if (full) since = 0;
    try {
      const r = await fetch('/api/sync?since=' + since, { headers, cache: 'no-store' });
      if (r.status === 401) return badKey();
      if (!r.ok) throw new Error(String(r.status));
      const j = await r.json(), changed = new Set();
      if (since === 0) { for (const [c, mp] of store) if (mp.size) { mp.clear(); changed.add(c); } }
      for (const d of j.docs) {
        const mp = colMap(d.col), before = mp.get(d.id);
        if (d.deleted) { if (before) { mp.delete(d.id); changed.add(d.col); } }
        else if (JSON.stringify(before) !== JSON.stringify(d.data)) { mp.set(d.id, d.data); changed.add(d.col); }
      }
      since = Math.max(0, j.now - 5000);       // overlap window: merging is idempotent
      if (!loaded) { loaded = true; markReady(); emit(new Set([...colListeners.keys(), ...[...docListeners.keys()].map(p => p.split('/')[0])])); }
      else if (changed.size) emit(changed);
      if (failed) { failed = 0; status('live', '即時同步'); }
    } catch (e) {
      failed++; status('off', '離線，稍後重試');
    }
  }
  // 有人在操作時每 4 秒同步；放著不動 1 分鐘後改成每 15 秒；畫面不在前景就暫停
  let lastActive = Date.now(), timer = 0;
  const idle = () => Date.now() - lastActive > IDLE_AFTER_MS;
  function schedule() {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (document.visibilityState === 'visible') await sync();
      schedule();
    }, idle() ? IDLE_POLL_MS : POLL_MS);
  }
  function wake() {
    const wasIdle = idle();
    lastActive = Date.now();
    if (wasIdle && document.visibilityState === 'visible') { sync(); schedule(); }
  }
  if (key) {
    sync();
    schedule();
    for (const ev of ['pointerdown', 'keydown', 'scroll', 'touchstart']) addEventListener(ev, wake, { passive: true, capture: true });
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') { lastActive = Date.now(); sync(); schedule(); } });
  }

  async function send(method, c, id, body) {
    let r;
    try {
      r = await fetch('/api/doc/' + encodeURIComponent(c) + '/' + encodeURIComponent(id), {
        method, headers, body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) { sync(true); throw { code: 'unavailable', message: '網路中斷' }; }
    if (r.status === 401) { badKey(); throw { code: 'unavailable', message: '密鑰錯誤' }; }
    if (r.status === 413) { sync(true); throw { code: 'quota_exceeded', message: '資料已達上限' }; }
    if (!r.ok) { sync(true); throw { code: 'unavailable', message: '儲存失敗' }; }
  }
  const newId = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2) + Date.now()).replace(/-/g, '').slice(0, 20);

  function listen(map, k, cb, initial) {
    let set = map.get(k); if (!set) map.set(k, set = new Set());
    set.add(cb);
    if (loaded) setTimeout(() => cb(initial()), 0);
    return () => set.delete(cb);
  }
  function docRef(c, id) {
    return {
      id, path: c + '/' + id,
      async get() { await ready; return snapDoc(c, id); },
      set(d) { colMap(c).set(id, d); emit([c]); return send('PUT', c, id, d); },
      update(d) { const cur = colMap(c).get(id); if (cur) { colMap(c).set(id, merge(cur, d)); emit([c]); } return send('PATCH', c, id, d); },
      delete() { colMap(c).delete(id); emit([c]); return send('DELETE', c, id); },
      onSnapshot(cb) { return listen(docListeners, c + '/' + id, cb, () => snapDoc(c, id)); },
    };
  }
  const db = Object.freeze({
    collection(c) {
      return {
        path: c,
        doc: id => docRef(c, id || newId()),
        async add(d) { const r = docRef(c, newId()); await r.set(d); return r; },
        async get() { await ready; return snapCol(c); },
        onSnapshot(cb) { return listen(colListeners, c, cb, () => snapCol(c)); },
      };
    },
    doc(p) { const [c, id] = p.split('/'); return docRef(c, id); },
    // 一次多筆寫入：ops = [{op:'put'|'patch'|'delete', col, id, data}]
    async batch(ops) {
      const changed = new Set();
      for (const o of ops) {
        const mp = colMap(o.col);
        if (o.op === 'delete') mp.delete(o.id);
        else if (o.op === 'put') mp.set(o.id, o.data);
        else { const c0 = mp.get(o.id); if (c0) mp.set(o.id, merge(c0, o.data)); }
        changed.add(o.col);
      }
      emit(changed);
      for (let i = 0; i < ops.length; i += 300) {
        let r;
        try { r = await fetch('/api/batch', { method: 'POST', headers, body: JSON.stringify({ ops: ops.slice(i, i + 300) }) }); }
        catch (e) { sync(true); throw { code: 'unavailable', message: '網路中斷' }; }
        if (r.status === 401) { badKey(); throw { code: 'unavailable', message: '密鑰錯誤' }; }
        if (!r.ok) { sync(true); throw { code: 'unavailable', message: '儲存失敗' }; }
      }
    },
  });

  /* ---------- who am I (no account: pick a name once) ---------- */
  function sheet(html, onClick) {
    const el = document.createElement('div');
    el.className = 'sheet';
    el.innerHTML = '<div class="sheet-back"></div><div class="panel"><div class="handle"></div>' + html + '</div>';
    if (onClick) el.addEventListener('click', onClick);
    document.body.appendChild(el);
    return el;
  }
  const esc = s => String(s).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  function pickName() {
    return ready.then(() => new Promise(resolve => {
      const members = (colMap('meta').get('settings') || {}).members || [];
      const el = sheet(
        '<h2>你是誰？</h2><div class="who">選一次就好，之後修改紀錄會顯示你的名字。</div>' +
        '<div class="seg" style="margin-top:16px">' + members.map(n => '<button type="button" data-n="' + esc(n) + '">' + esc(n) + '</button>').join('') + '</div>' +
        '<div class="actions"><button class="btn" type="button" data-n="旅伴">先跳過</button></div>',
        e => { const b = e.target.closest('[data-n]'); if (!b) return; ls.set(NAME, b.dataset.n); el.remove(); resolve(b.dataset.n); }
      );
    }));
  }
  function badKey() {
    if (stopped) return; stopped = true;
    status('off', '需要完整連結');
    sheet('<h2>這個連結不完整</h2><div class="who" style="font-size:15px;margin-top:10px">網址少了密碼（#k= 後面那一段）。請向行程主人要完整的分享連結再打開一次。</div>');
  }
  if (!key) document.addEventListener('DOMContentLoaded', badKey);
  document.addEventListener('click', e => {
    if (!e.target.closest('#sync') || !key || stopped) return;
    ls.set(NAME, ''); pickName().then(() => location.reload());
  });

  const user = Object.freeze({
    async id() { return ls.get(NAME) || (key ? await pickName() : null); },
    async me() { const n = ls.get(NAME) || '旅伴'; return { id: n, name: n, guest: false }; },
    async can() { return true; },
    async canEdit() { return true; },
    async isOwner() { return false; },
    async profiles(ids) { return Object.fromEntries(ids.map(i => [i, { id: i, name: i }])); },
  });

  window.claude = Object.freeze({ use: async n => (n === 'db' ? db : n === 'user' ? user : null) });
})();
