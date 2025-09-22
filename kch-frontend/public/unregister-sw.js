// Unregister existing service workers to fix errors
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    for (let registration of registrations) {
      registration.unregister().then(function (boolean) {
        console.log("✅ Service Worker unregistered:", boolean);
      });
    }
  });

  // Clear all caches
  if ("caches" in window) {
    caches
      .keys()
      .then(function (cacheNames) {
        return Promise.all(
          cacheNames.map(function (cacheName) {
            console.log("🗑️ Deleting cache:", cacheName);
            return caches.delete(cacheName);
          })
        );
      })
      .then(function () {
        console.log("✅ All caches cleared");
        // Reload page after cleanup
        window.location.reload();
      });
  }
}
