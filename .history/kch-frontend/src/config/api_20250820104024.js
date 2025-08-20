// API Configuration
const API_CONFIG = {
  // Base URL for all API calls
  BASE_URL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8080",

  // API endpoints
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      ADMIN_REGISTER: "/auth/admin-register",
      RESET_PASSWORD: "/auth/reset-password",
      RESET_PASSWORD_CONFIRM: "/auth/reset-password/confirm",
      GET_USER_PROFILE: "/auth/getUserProfile",
      UPDATE_PROFILE: "/auth/updateProfile",
      REFRESH_TOKEN: "/auth/refresh",
      ME: "/auth/me",
    },

    // Admin endpoints
    ADMIN: {
      REGISTRATION_CODE_REQUEST: "/admin-registration-code/request",
      USER_HISTORY: "/admin/user-history",
      REGISTERED_USERS: "/admin/registered-users",
      DOCUMENT_VALIDATION: "/admin/document-validation",
    },

    // Vehicle endpoints
    VEHICLE: {
      REQUEST_KEYCODE: "/vehicle/request-keycode",
      USER_REQUESTS: "/vehicle/user-requests",
      UPDATE_REQUEST: "/vehicle/update-request",
      DELETE_REQUEST: "/vehicle/delete-request",
    },

    // Cart endpoints
    CART: {
      ITEMS: "/cart/items",
      CHECKOUT: "/cart/checkout",
      ADD_SUBSCRIPTION: "/cart/addSubscription",
    },

    // User endpoints
    USER: {
      SUBSCRIPTION: "/keycode-user/subscription",
      DELETE: "/keycode-user/delete",
    },

    // Support endpoints
    SUPPORT: {
      CONTACT: "/support/contact",
    },

    // Compliance endpoints
    COMPLIANCE: {
      STATUS: "/compliance/status",
    },

    // Makes endpoints
    MAKES: {
      GET_MAKES: "/makes/getMakes",
    },
  },

  // Helper function to build full URLs
  buildUrl: (endpoint) => {
    return `${API_CONFIG.BASE_URL}${endpoint}`;
  },

  // Helper function to build URL with parameters
  buildUrlWithParams: (endpoint, params = {}) => {
    const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  },
};

export default API_CONFIG;
