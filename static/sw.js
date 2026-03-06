// Service Worker using Google Workbox
// Loaded via importScripts from the Workbox CDN

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');

// ─── Workbox Configuration ────────────────────────────────────────────────────
workbox.setConfig({ debug: false });

const { registerRoute, NavigationRoute, setCatchHandler } = workbox.routing;
const { CacheFirst, NetworkFirst, StaleWhileRevalidate } = workbox.strategies;
const { CacheableResponsePlugin } = workbox.cacheableResponse;
const { ExpirationPlugin } = workbox.expiration;
const { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } = workbox.precaching;

// ─── Pre-cache App Shell ──────────────────────────────────────────────────────
// These are the core files needed for the app to run offline.
// The revision strings ensure updates are detected.
precacheAndRoute([
  { url: '/',                   revision: '1' },
  { url: '/manifest.json',      revision: '1' },
  { url: '/heart.png',          revision: '1' },
  { url: '/charlie.png',        revision: '1' },
  { url: '/screenshot.png',     revision: '1' },
  { url: '/icon-192.png',       revision: '1' },
  { url: '/icon-512.png',       revision: '1' },
]);

cleanupOutdatedCaches();

// ─── Navigation (HTML pages) — NetworkFirst ───────────────────────────────────
// Try the network first; fall back to cached page when offline.
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: 'pages-cache',
      plugins: [
        new CacheableResponsePlugin({ statuses: [0, 200] }),
        new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 7 * 24 * 60 * 60 }),
      ],
    })
  )
);

// ─── Dash / Plotly JS & CSS bundles — StaleWhileRevalidate ───────────────────
// Serve from cache immediately while refreshing in the background.
registerRoute(
  ({ request }) =>
    request.destination === 'script' || request.destination === 'style',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }),
    ],
  })
);

// ─── Images — CacheFirst ──────────────────────────────────────────────────────
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 60 * 24 * 60 * 60 }),
    ],
  })
);

// ─── Plotly / Dash CDN resources — StaleWhileRevalidate ──────────────────────
registerRoute(
  ({ url }) =>
    url.origin === 'https://cdn.plot.ly' ||
    url.hostname.includes('plotly') ||
    url.pathname.startsWith('/_dash-') ||
    url.pathname.startsWith('/_reload-hash'),
  new StaleWhileRevalidate({
    cacheName: 'dash-cdn-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 40, maxAgeSeconds: 7 * 24 * 60 * 60 }),
    ],
  })
);

// ─── External data (gapminder CSV, etc.) — NetworkFirst ──────────────────────
registerRoute(
  ({ url }) => url.origin === 'https://raw.githubusercontent.com',
  new NetworkFirst({
    cacheName: 'external-data-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 24 * 60 * 60 }),
    ],
  })
);

// ─── Workbox CDN itself — CacheFirst ─────────────────────────────────────────
registerRoute(
  ({ url }) => url.origin === 'https://storage.googleapis.com',
  new CacheFirst({
    cacheName: 'workbox-cdn-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 10, maxAgeSeconds: 90 * 24 * 60 * 60 }),
    ],
  })
);

// ─── Offline Fallback ─────────────────────────────────────────────────────────
// Return the cached home page for any navigation request that fails.
setCatchHandler(async ({ event }) => {
  if (event.request.destination === 'document') {
    return caches.match('/') || Response.error();
  }
  return Response.error();
});
