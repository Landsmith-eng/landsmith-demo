// Continuum's service worker: only for nudges (a short note now and then, if the user said yes). It caches nothing.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('push', (e) => {
  let d = {}; try { d = e.data ? e.data.json() : {}; } catch { d = { body: e.data?.text() }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Continuum', {
    body: d.body || '', icon: '/img/icon/icon-192.png', badge: '/img/icon/icon-192.png', tag: 'continuum-nudge', data: { url: d.url || '/' },
  }));
});
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  const url = e.notification.data?.url || '/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
    const open = list.find((c) => new URL(c.url).origin === self.location.origin);
    return open ? open.focus().then((c) => c.navigate?.(url)) : self.clients.openWindow(url);
  }));
});
