// Enhanced request service with offline support
import axios from 'axios';
import { queueAction, cacheData, getCachedData } from '../utils/offlineQueue';
import toast from 'react-hot-toast';

// Create axios instance with offline handling
const offlineAxios = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cache configuration for different endpoints
const CACHE_CONFIG = {
  '/user/profile': { ttl: 5 * 60 * 1000, key: 'user-profile' }, // 5 minutes
  '/user/subscription': { ttl: 10 * 60 * 1000, key: 'user-subscription' }, // 10 minutes
  '/user/orders': { ttl: 15 * 60 * 1000, key: 'user-orders' }, // 15 minutes
  '/trial/status': { ttl: 2 * 60 * 1000, key: 'trial-status' }, // 2 minutes
  '/kch-database/search': { ttl: 30 * 60 * 1000, key: 'kch-database' }, // 30 minutes
  '/pricelist': { ttl: 60 * 60 * 1000, key: 'pricelist' }, // 1 hour
};

// Request interceptor
offlineAxios.interceptors.request.use(
  async (config) => {
    // Add auth token if available
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Check if request should be cached
    const cacheConfig = getCacheConfig(config.url);
    if (cacheConfig && config.method === 'get') {
      const cachedData = await getCachedData(cacheConfig.key);
      if (cachedData) {
        console.log('📦 Serving cached data for:', config.url);
        // Return cached data instead of making request
        return Promise.reject({
          isCached: true,
          data: cachedData,
          config
        });
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
offlineAxios.interceptors.response.use(
  async (response) => {
    // Cache successful GET responses
    const cacheConfig = getCacheConfig(response.config.url);
    if (cacheConfig && response.config.method === 'get' && response.status === 200) {
      await cacheData(cacheConfig.key, response.data, 'api-response');
    }

    return response;
  },
  async (error) => {
    // Handle cached data
    if (error.isCached) {
      return Promise.resolve(error);
    }

    // Handle network errors
    if (!navigator.onLine || error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      console.log('📴 Network error, handling offline:', error.config?.url);
      return handleOfflineRequest(error.config);
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
      console.log('⏱️ Request timeout:', error.config?.url);
      return handleOfflineRequest(error.config);
    }

    // Handle 5xx server errors
    if (error.response?.status >= 500) {
      console.log('🔴 Server error, trying offline handling:', error.config?.url);
      return handleOfflineRequest(error.config);
    }

    return Promise.reject(error);
  }
);

// Get cache configuration for URL
function getCacheConfig(url) {
  if (!url) return null;
  
  for (const [endpoint, config] of Object.entries(CACHE_CONFIG)) {
    if (url.includes(endpoint)) {
      return config;
    }
  }
  return null;
}

// Handle offline request
async function handleOfflineRequest(config) {
  const { method, url, data, headers } = config;

  // For GET requests, try to return cached data
  if (method === 'get') {
    const cacheConfig = getCacheConfig(url);
    if (cacheConfig) {
      const cachedData = await getCachedData(cacheConfig.key);
      if (cachedData) {
        console.log('📦 Returning cached data for offline request:', url);
        return Promise.resolve({
          data: cachedData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config,
          cached: true
        });
      }
    }
  }

  // For POST/PUT/DELETE requests, queue for later
  if (['post', 'put', 'delete'].includes(method.toLowerCase())) {
    const action = {
      type: `${method.toUpperCase()} ${url}`,
      url: url,
      method: method.toUpperCase(),
      headers: headers,
      body: data ? JSON.stringify(data) : null,
      timestamp: Date.now()
    };

    const queued = await queueAction(action);
    if (queued) {
      console.log('📝 Queued offline action:', action.type);
      
      // Show user feedback
      toast.error('Action queued for when you\'re back online', {
        duration: 4000,
        icon: '📝'
      });

      // Return a mock success response
      return Promise.resolve({
        data: { 
          message: 'Action queued for offline sync',
          queued: true,
          offline: true 
        },
        status: 202,
        statusText: 'Accepted',
        headers: {},
        config,
        queued: true
      });
    }
  }

  // Return offline error
  return Promise.reject({
    message: 'Service unavailable offline',
    code: 'OFFLINE',
    config,
    offline: true
  });
}

// Enhanced GET request with offline support
export const get = async (url, config = {}) => {
  try {
    const response = await offlineAxios.get(url, config);
    return response;
  } catch (error) {
    if (error.isCached || error.cached) {
      return error;
    }
    throw error;
  }
};

// Enhanced POST request with offline support
export const post = async (url, data, config = {}) => {
  try {
    const response = await offlineAxios.post(url, data, config);
    return response;
  } catch (error) {
    if (error.queued) {
      return error;
    }
    throw error;
  }
};

// Enhanced PUT request with offline support
export const put = async (url, data, config = {}) => {
  try {
    const response = await offlineAxios.put(url, data, config);
    return response;
  } catch (error) {
    if (error.queued) {
      return error;
    }
    throw error;
  }
};

// Enhanced DELETE request with offline support
export const del = async (url, config = {}) => {
  try {
    const response = await offlineAxios.delete(url, config);
    return response;
  } catch (error) {
    if (error.queued) {
      return error;
    }
    throw error;
  }
};

// Check if response is from cache
export const isCachedResponse = (response) => {
  return response.cached || response.isCached;
};

// Check if response is queued
export const isQueuedResponse = (response) => {
  return response.queued;
};

// Check if response indicates offline mode
export const isOfflineResponse = (response) => {
  return response.offline || response.data?.offline;
};

export default offlineAxios;
