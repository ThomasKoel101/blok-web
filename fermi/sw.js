// Service worker: maakt Fermi een installeerbare app die volledig offline werkt (N1),
// en handelt aangetikte meldingen af.
// Strategie: app-shell vooraf cachen; daarna "stale-while-revalidate": direct uit de
// cache (snel en offline), en op de achtergrond de nieuwste versie ophalen.
const CACHE = 'fermi-v9';
const ASSETS = [
  './', 'index.html', 'styles.css', 'manifest.json', 'icon.svg',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png',
  'js/app.js', 'js/logic.js', 'js/templates.js', 'js/characters.js', 'js/i18n.js', 'js/store.js', 'js/notify.js', 'js/ingredients.js',
];

self.addEventListener('install', (e) => {
  // cache: 'reload' slaat de HTTP-cache van de browser over, zodat een update echt nieuwe bestanden ophaalt.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    // Navigaties (openen vanaf het beginscherm) krijgen altijd de app-shell.
    const key = e.request.mode === 'navigate' ? 'index.html' : e.request;
    const cached = await cache.match(key, { ignoreSearch: true });
    const network = fetch(e.request, { cache: 'no-cache' })
      .then((res) => {
        if (res.ok) cache.put(key, res.clone());
        return res;
      })
      .catch(() => null);
    if (cached) {
      e.waitUntil(network);
      return cached;
    }
    return (await network) || (await cache.match('index.html')) || Response.error();
  })());
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
