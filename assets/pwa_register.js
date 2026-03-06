// Register the Workbox-powered service worker for PWA offline support.
// This file lives in /assets/ so Dash automatically includes it in every page.

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then(function (registration) {
        console.log('[PWA] Service worker registered. Scope:', registration.scope);

        // Check for updates on every page load
        registration.update();

        registration.addEventListener('updatefound', function () {
          var newWorker = registration.installing;
          newWorker.addEventListener('statechange', function () {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[PWA] New content available — reload to update.');
            }
          });
        });
      })
      .catch(function (error) {
        console.error('[PWA] Service worker registration failed:', error);
      });
  });
} else {
  console.warn('[PWA] Service workers are not supported in this browser.');
}

// ─── Install prompt (beforeinstallprompt) ────────────────────────────────────
// Stash the event so we can trigger the install banner programmatically later.
window._pwaInstallPrompt = null;

window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  window._pwaInstallPrompt = e;
  console.log('[PWA] Install prompt ready.');

  // Show a small install banner if one exists in the DOM
  var banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.style.display = 'flex';
  }
});

window.addEventListener('appinstalled', function () {
  console.log('[PWA] App installed successfully.');
  window._pwaInstallPrompt = null;
  var banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.style.display = 'none';
  }
});
