// Service worker: offline-cache (N1) en afhandeling van aangetikte meldingen.
const CACHE = 'fermi-v1';
const ASSETS = [
  './', 'index.html', 'styles.css', 'manifest.webmanifest', 'icon.svg',
  'js/app.js', 'js/logic.js', 'js/templates.js', 'js/characters.js', 'js/i18n.js', 'js/store.js', 'js/notify.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

// Netwerk eerst (zodat updates binnenkomen), cache als terugval.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then((r) => r || caches.match('index.html'))),
  );
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const { jarId } = e.notification.data || {};
  const burp = e.action === 'burp';
  const url = jarId ? `./#/jar/${jarId}${burp ? '?do=burp' : ''}` : './';
  e.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const client = all[0];
    if (client) {
      await client.focus();
      if (burp) client.postMessage({ type: 'burp', jarId });
      else client.navigate?.(url);
      return;
    }
    await self.clients.openWindow(url);
  })());
});
