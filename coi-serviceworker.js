self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  const req = e.request;
  if (new URL(req.url).origin !== self.location.origin) return; // 외부 요청(CDN, HF)은 그대로
  if (req.cache === 'only-if-cached' && req.mode !== 'same-origin') return;

  e.respondWith(fetch(req).then(res => {
    if (res.status === 0) return res;
    const headers = new Headers(res.headers);
    headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    return new Response(res.body, { status: res.status, statusText: res.statusText, headers });
  }));
});
