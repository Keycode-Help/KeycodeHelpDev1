// Authentication Debugging Utility
// Run this in browser console: window.debugAuth()

export const debugAuthState = () => {
  console.log("🔍 === AUTHENTICATION DEBUG REPORT ===");
  
  // Check localStorage
  console.log("\n📱 LOCAL STORAGE:");
  const authUser = localStorage.getItem("auth_user");
  const authToken = localStorage.getItem("auth_token");
  console.log("- auth_user:", authUser ? "✅ Present" : "❌ Missing");
  console.log("- auth_token:", authToken ? `✅ Present (${authToken.length} chars)` : "❌ Missing");
  
  if (authUser) {
    try {
      const user = JSON.parse(authUser);
      console.log("- User data:", user);
    } catch (e) {
      console.log("- User data: ❌ Invalid JSON");
    }
  }
  
  // Check sessionStorage
  console.log("\n💾 SESSION STORAGE:");
  const sessionUser = sessionStorage.getItem("auth_user");
  const sessionToken = sessionStorage.getItem("auth_token");
  console.log("- auth_user:", sessionUser ? "✅ Present" : "❌ Missing");
  console.log("- auth_token:", sessionToken ? `✅ Present (${sessionToken.length} chars)` : "❌ Missing");
  
  // Check cookies
  console.log("\n🍪 COOKIES:");
  const cookies = document.cookie.split(';').reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split('=');
    if (key) acc[key] = value;
    return acc;
  }, {});
  
  const relevantCookies = ['access_token', 'refresh_token', 'next-auth.session-token'];
  relevantCookies.forEach(cookieName => {
    const value = cookies[cookieName];
    console.log(`- ${cookieName}:`, value ? `✅ Present (${value.length} chars)` : "❌ Missing");
  });
  
  // Check if JWT token is expired (basic check)
  if (authToken) {
    try {
      const tokenParts = authToken.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        const now = Math.floor(Date.now() / 1000);
        const isExpired = payload.exp && payload.exp < now;
        console.log("\n🔑 JWT TOKEN ANALYSIS:");
        console.log("- Format: ✅ Valid JWT structure");
        console.log("- Expires:", payload.exp ? new Date(payload.exp * 1000).toLocaleString() : "No expiry");
        console.log("- Status:", isExpired ? "❌ EXPIRED" : "✅ Valid");
        console.log("- Payload:", payload);
      }
    } catch (e) {
      console.log("\n🔑 JWT TOKEN ANALYSIS:");
      console.log("- Format: ❌ Invalid JWT structure");
    }
  }
  
  // Check current authentication state from React context (if available)
  console.log("\n⚛️ REACT AUTH CONTEXT:");
  console.log("- Check your browser's React DevTools for current auth state");
  
  // Recommendations
  console.log("\n💡 RECOMMENDATIONS:");
  if (!authToken && !cookies.access_token) {
    console.log("1. ❌ No authentication tokens found - user needs to log in");
  } else if (authToken && !cookies.access_token) {
    console.log("1. ⚠️ Token in localStorage but not in cookies - may cause issues");
    console.log("   Try logging out and logging back in");
  } else if (!authToken && cookies.access_token) {
    console.log("1. ⚠️ Token in cookies but not in localStorage - inconsistent state");
  }
  
  if (!cookies.refresh_token) {
    console.log("2. ❌ No refresh token - automatic token renewal won't work");
  }
  
  console.log("\n🛠️ QUICK FIXES:");
  console.log("- Clear all auth data: window.clearAllAuthData()");
  console.log("- Clear localStorage quota: window.clearLocalStorageQuota()");
  console.log("- Check network requests in DevTools for 401/403 errors");
  
  console.log("\n=== END DEBUG REPORT ===");
};

// Make it available globally for easy debugging
if (typeof window !== "undefined") {
  window.debugAuth = debugAuthState;
}
