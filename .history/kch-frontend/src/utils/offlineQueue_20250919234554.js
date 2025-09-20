// Offline Queue System for Keycode Help
class OfflineQueue {
  constructor() {
    this.dbName = 'KeycodeHelpOffline';
    this.dbVersion = 1;
    this.db = null;
    this.init();
  }

  // Initialize IndexedDB
  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = () => {
        console.error('❌ Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('✅ IndexedDB initialized for offline queue');
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create offline actions store
        if (!db.objectStoreNames.contains('offlineActions')) {
          const actionStore = db.createObjectStore('offlineActions', {
            keyPath: 'id',
            autoIncrement: true
          });
          actionStore.createIndex('timestamp', 'timestamp', { unique: false });
          actionStore.createIndex('type', 'type', { unique: false });
        }

        // Create cached data store
        if (!db.objectStoreNames.contains('cachedData')) {
          const dataStore = db.createObjectStore('cachedData', {
            keyPath: 'key'
          });
          dataStore.createIndex('timestamp', 'timestamp', { unique: false });
          dataStore.createIndex('type', 'type', { unique: false });
        }
      };
    });
  }

  // Queue an action for offline execution
  async queueAction(action) {
    if (!this.db) {
      console.error('❌ IndexedDB not initialized');
      return false;
    }

    const actionData = {
      ...action,
      timestamp: Date.now(),
      attempts: 0,
      maxAttempts: 3
    };

    try {
      const transaction = this.db.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      await store.add(actionData);
      
      console.log('📝 Queued offline action:', action.type);
      return true;
    } catch (error) {
      console.error('❌ Failed to queue action:', error);
      return false;
    }
  }

  // Get all queued actions
  async getQueuedActions() {
    if (!this.db) {
      return [];
    }

    try {
      const transaction = this.db.transaction(['offlineActions'], 'readonly');
      const store = transaction.objectStore('offlineActions');
      const request = store.getAll();
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('❌ Failed to get queued actions:', error);
      return [];
    }
  }

  // Remove a queued action
  async removeAction(actionId) {
    if (!this.db) {
      return false;
    }

    try {
      const transaction = this.db.transaction(['offlineActions'], 'readwrite');
      const store = transaction.objectStore('offlineActions');
      await store.delete(actionId);
      
      console.log('🗑️ Removed offline action:', actionId);
      return true;
    } catch (error) {
      console.error('❌ Failed to remove action:', error);
      return false;
    }
  }

  // Cache data for offline access
  async cacheData(key, data, type = 'general') {
    if (!this.db) {
      return false;
    }

    const cacheData = {
      key,
      data,
      type,
      timestamp: Date.now()
    };

    try {
      const transaction = this.db.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      await store.put(cacheData);
      
      console.log('💾 Cached data:', key);
      return true;
    } catch (error) {
      console.error('❌ Failed to cache data:', error);
      return false;
    }
  }

  // Get cached data
  async getCachedData(key) {
    if (!this.db) {
      return null;
    }

    try {
      const transaction = this.db.transaction(['cachedData'], 'readonly');
      const store = transaction.objectStore('cachedData');
      const request = store.get(key);
      
      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          const result = request.result;
          if (result) {
            // Check if data is still fresh (24 hours)
            const isFresh = (Date.now() - result.timestamp) < (24 * 60 * 60 * 1000);
            resolve(isFresh ? result.data : null);
          } else {
            resolve(null);
          }
        };
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('❌ Failed to get cached data:', error);
      return null;
    }
  }

  // Clear old cached data
  async clearOldCache() {
    if (!this.db) {
      return;
    }

    const cutoffTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days

    try {
      const transaction = this.db.transaction(['cachedData'], 'readwrite');
      const store = transaction.objectStore('cachedData');
      const index = store.index('timestamp');
      const range = IDBKeyRange.upperBound(cutoffTime);
      
      const request = index.openCursor(range);
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };
    } catch (error) {
      console.error('❌ Failed to clear old cache:', error);
    }
  }

  // Sync all queued actions
  async syncActions() {
    const actions = await this.getQueuedActions();
    console.log(`🔄 Syncing ${actions.length} offline actions`);

    for (const action of actions) {
      try {
        const response = await fetch(action.url, {
          method: action.method,
          headers: action.headers,
          body: action.body
        });

        if (response.ok) {
          await this.removeAction(action.id);
          console.log('✅ Synced action:', action.type);
        } else {
          // Increment attempt count
          action.attempts++;
          if (action.attempts >= action.maxAttempts) {
            await this.removeAction(action.id);
            console.log('❌ Action failed permanently:', action.type);
          }
        }
      } catch (error) {
        console.log('❌ Failed to sync action:', action.type, error);
      }
    }
  }
}

// Create singleton instance
const offlineQueue = new OfflineQueue();

// Export functions for easy use
export const queueAction = (action) => offlineQueue.queueAction(action);
export const getQueuedActions = () => offlineQueue.getQueuedActions();
export const removeAction = (id) => offlineQueue.removeAction(id);
export const cacheData = (key, data, type) => offlineQueue.cacheData(key, data, type);
export const getCachedData = (key) => offlineQueue.getCachedData(key);
export const syncActions = () => offlineQueue.syncActions();
export const clearOldCache = () => offlineQueue.clearOldCache();

export default offlineQueue;
