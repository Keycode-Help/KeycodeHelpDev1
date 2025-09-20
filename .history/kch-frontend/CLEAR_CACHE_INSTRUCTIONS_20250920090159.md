# Clear Browser Cache Instructions

The `OfflineIndicator` component error you're seeing is due to browser caching. The fix has been applied, but your browser is loading an older cached version.

## Method 1: Hard Refresh (Recommended)

1. **Chrome/Edge/Firefox**: Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
2. **Safari**: Press `Cmd+Option+R`

## Method 2: Clear Cache via Developer Tools

1. Open Developer Tools (`F12` or `Ctrl+Shift+I`)
2. Right-click on the refresh button
3. Select "Empty Cache and Hard Reload"

## Method 3: Clear All Browser Data

1. **Chrome**: Go to `chrome://settings/clearBrowserData`
2. **Firefox**: Go to `about:preferences#privacy`
3. **Safari**: Safari Menu → Clear History
4. Select "All time" and check "Cached images and files"
5. Click "Clear data"

## Method 4: Manual Cache Clear (Run in Browser Console)

1. Open Developer Tools (`F12`)
2. Go to Console tab
3. Paste this code and press Enter:

```javascript
// Clear all caches
if ('caches' in window) {
  caches.keys().then(names => {
    names.forEach(name => {
      console.log('🗑️ Deleting cache:', name);
      caches.delete(name);
    });
  });
}

// Clear Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      console.log('🔄 Unregistering Service Worker:', registration.scope);
      registration.unregister();
    });
  });
}

// Clear storage
localStorage.clear();
sessionStorage.clear();

console.log('✅ Cache cleared! Refreshing page...');
window.location.reload(true);
```

## Method 5: Incognito/Private Mode

1. Open an incognito/private window
2. Navigate to `http://localhost:5173`
3. This will load the latest version without cache

## Verification

After clearing cache, you should see:
- ✅ No more `isSlowConnection is not a function` error
- ✅ Service Worker registered successfully
- ✅ IndexedDB initialized for offline queue
- ✅ Offline indicator working properly

The development server has been restarted with cleared Vite cache, so the latest code should be available.
