// Service Worker for Keycode Help - Offline Support
const CACHE_NAME = "keycode-help-v1.0.0";
const STATIC_CACHE_NAME = "keycode-help-static-v1.0.0";
const DYNAMIC_CACHE_NAME = "keycode-help-dynamic-v1.0.0";

// Files to cache immediately
const STATIC_FILES = [
  "/",
  "/login",
  "/user-profile",
  "/subscription-manager",
  "/kch-database",
  "/vehicle-keycode-request",
  "/support",
  "/static/js/bundle.js",
  "/static/css/main.css",
  "/manifest.json",
];

// API endpoints that should be cached
const CACHEABLE_APIS = [
  "/user/profile",
  "/user/subscription",
  "/user/orders",
  "/user/security",
  "/user/credentials",
  "/trial/status",
  "/kch-database/search",
  "/pricelist",
];

// Install event - cache static files
self.addEventListener("install", (event) => {
  console.log("🔧 Service Worker: Installing...");
  event.waitUntil(
    caches
      .open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log("📦 Service Worker: Caching static files");
        return cache.addAll(STATIC_FILES);
      })
      .then(() => {
        console.log("✅ Service Worker: Static files cached");
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("❌ Service Worker: Failed to cache static files", error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("🚀 Service Worker: Activating...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== STATIC_CACHE_NAME &&
              cacheName !== DYNAMIC_CACHE_NAME &&
              cacheName !== CACHE_NAME
            ) {
              console.log("🗑️ Service Worker: Deleting old cache", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log("✅ Service Worker: Activated");
        return self.clients.claim();
      })
  );
});

// Fetch event - handle requests with caching strategy
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/user/") ||
    url.pathname.startsWith("/trial/") ||
    url.pathname.startsWith("/kch-database/") ||
    url.pathname.startsWith("/pricelist")
  ) {
    event.respondWith(handleApiRequest(request));
  }
  // Handle static file requests
  else if (request.method === "GET" && !url.pathname.includes(".")) {
    event.respondWith(handlePageRequest(request));
  }
  // Handle other requests (images, CSS, JS)
  else if (request.method === "GET") {
    event.respondWith(handleStaticRequest(request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  const url = new URL(request.url);

  try {
    // Try network first
    const networkResponse = await fetch(request);

    if (networkResponse.ok) {
      // Cache successful GET requests
      if (request.method === "GET" && isCacheableApi(url.pathname)) {
        const cache = await caches.open(DYNAMIC_CACHE_NAME);
        cache.put(request, networkResponse.clone());
      }

      // Notify client that we're online
      notifyClient("online");
      return networkResponse;
    }

    throw new Error(`Network response not ok: ${networkResponse.status}`);
  } catch (error) {
    console.log(
      "🌐 Service Worker: Network failed, trying cache for",
      url.pathname
    );

    // Network failed, try cache
    const cache = await caches.open(DYNAMIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log("📦 Service Worker: Serving from cache", url.pathname);
      notifyClient("offline");
      return cachedResponse;
    }

    // No cache available, return offline response
    console.log("❌ Service Worker: No cache available for", url.pathname);
    notifyClient("offline");
    return createOfflineResponse(request);
  }
}

// Handle page requests with cache-first strategy
async function handlePageRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      console.log("📦 Service Worker: Serving page from cache");
      return cachedResponse;
    }

    // Try network
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    console.log("❌ Service Worker: Page request failed", error);
    return (
      caches.match("/offline.html") || new Response("Offline", { status: 503 })
    );
  }
}

// Handle static file requests with cache-first strategy
async function handleStaticRequest(request) {
  try {
    const cache = await caches.open(STATIC_CACHE_NAME);
    const cachedResponse = await cache.match(request);

    if (cachedResponse) {
      return cachedResponse;
    }

    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }

    return networkResponse;
  } catch (error) {
    return new Response("Resource not available offline", { status: 503 });
  }
}

// Check if API endpoint should be cached
function isCacheableApi(pathname) {
  return CACHEABLE_APIS.some((api) => pathname.startsWith(api));
}

// Create offline response
function createOfflineResponse(request) {
  const url = new URL(request.url);

  // Return appropriate offline response based on endpoint
  if (url.pathname.startsWith("/user/profile")) {
    return new Response(
      JSON.stringify({
        error: "offline",
        message: "Profile data not available offline",
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (url.pathname.startsWith("/user/orders")) {
    return new Response(
      JSON.stringify({
        error: "offline",
        message: "Order history not available offline",
        data: [],
        offline: true,
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Generic offline response
  return new Response(
    JSON.stringify({
      error: "offline",
      message: "Service unavailable offline",
      offline: true,
    }),
    {
      status: 503,
      headers: { "Content-Type": "application/json" },
    }
  );
}

// Notify client about connection status
function notifyClient(status) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "CONNECTION_STATUS",
        status: status,
      });
    });
  });
}

// Handle background sync for offline actions
self.addEventListener("sync", (event) => {
  console.log("🔄 Service Worker: Background sync triggered");

  if (event.tag === "offline-actions") {
    event.waitUntil(syncOfflineActions());
  }
});

// Sync offline actions when connection is restored
async function syncOfflineActions() {
  try {
    // Get offline actions from IndexedDB
    const offlineActions = await getOfflineActions();

    for (const action of offlineActions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body,
        });

        if (response.ok) {
          // Remove successful action from offline queue
          await removeOfflineAction(action.id);
          console.log("✅ Service Worker: Synced offline action", action.id);
        }
      } catch (error) {
        console.log(
          "❌ Service Worker: Failed to sync action",
          action.id,
          error
        );
      }
    }
  } catch (error) {
    console.error("❌ Service Worker: Background sync failed", error);
  }
}

// Helper functions for IndexedDB operations
async function getOfflineActions() {
  // This would interact with IndexedDB to get queued actions
  // Implementation depends on the offline queue system
  return [];
}

async function removeOfflineAction(actionId) {
  // This would remove the action from IndexedDB
  // Implementation depends on the offline queue system
  console.log("🗑️ Service Worker: Removing offline action", actionId);
}
