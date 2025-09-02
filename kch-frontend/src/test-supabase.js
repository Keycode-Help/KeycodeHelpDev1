// Test file to verify Supabase connection
import { supabase } from "./services/supabaseClient.js";
import TransponderAPI from "./services/transponderApi.js";

console.log("🧪 Testing Supabase Connection...");

console.log("Environment check:", {
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
  hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
  backendUrl: import.meta.env.VITE_BACKEND_URL,
});

// Test basic connection
supabase
  .from("vehicle_makes")
  .select("count", { count: "exact", head: true })
  .then(({ count, error }) => {
    if (error) {
      console.error("❌ Supabase connection failed:", error);
    } else {
      console.log("✅ Supabase connected! Vehicle makes count:", count);
    }
  });

// Test API functions
TransponderAPI.getDatabaseStats()
  .then((stats) => {
    console.log("✅ TransponderAPI working! Stats:", stats);
  })
  .catch((error) => {
    console.error("❌ TransponderAPI failed:", error);
  });

export { supabase, TransponderAPI };
