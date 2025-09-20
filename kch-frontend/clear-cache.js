// Force clear browser cache script
console.log("🧹 Clearing browser cache...");

// Clear all caches
if ("caches" in window) {
  caches.keys().then((names) => {
    names.forEach((name) => {
      console.log("🗑️ Deleting cache:", name);
      caches.delete(name);
    });
  });
}

// Clear Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      console.log("🔄 Unregistering Service Worker:", registration.scope);
      registration.unregister();
    });
  });
}

// Clear localStorage and sessionStorage
localStorage.clear();
sessionStorage.clear();

console.log("✅ Cache cleared! Please refresh the page.");
