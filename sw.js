/* 萬用離線 AI 工作台 Service Worker：讓 App 斷網也能開啟。
   模型檔由 WebLLM 自己快取，這裡只處理 App 本體與推理引擎程式。 */
const VERSION = 'aiwb-v1.0.1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'];
const LIB_CACHE = 'aiwb-lib';
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('aiwb-v') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request; if(req.method !== 'GET') return;
  const url = new URL(req.url);
  // 推理引擎（固定版本，可永久快取）
  if(url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('/@mlc-ai/web-llm@')){
    e.respondWith(caches.open(LIB_CACHE).then(async c => { const hit = await c.match(req); if(hit) return hit; const res = await fetch(req); if(res.ok) c.put(req, res.clone()); return res; }));
    return;
  }
  if(url.origin !== location.origin) return; // Hugging Face、Ollama 等交給瀏覽器
  // App 本體：先用快取（秒開、離線可用），背景更新
  e.respondWith(caches.open(VERSION).then(async c => {
    const key = req.mode === 'navigate' ? './index.html' : req;
    const hit = await c.match(key, {ignoreSearch: req.mode === 'navigate'});
    const net = fetch(req).then(res => { if(res.ok) c.put(key, res.clone()); return res; }).catch(() => null);
    if(hit){ e.waitUntil(net); return hit; }
    return (await net) || new Response('離線中，且尚未快取此檔案', {status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}});
  }));
});
