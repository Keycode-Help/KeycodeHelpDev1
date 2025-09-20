// Debug script to check environment variables
console.log("=== Environment Debug ===");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("VITE_ENABLE_ANALYTICS:", process.env.VITE_ENABLE_ANALYTICS);
console.log("VITE_ENABLE_DEBUG_LOGS:", process.env.VITE_ENABLE_DEBUG_LOGS);
console.log("Is Production:", process.env.NODE_ENV === "production");
console.log("Is Development:", process.env.NODE_ENV === "development");
console.log("========================");
