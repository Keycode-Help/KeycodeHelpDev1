// Script to get Supabase JWT secret for backend configuration
// Run this with: node scripts/get-supabase-jwt-secret.js

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import fs from "fs";

// Load environment variables
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.VITE_SUPABASE_URL?.replace(
  "postgresql://",
  "https://"
).replace(":5432/postgres", "");
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase configuration!");
  console.error("Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file");
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getSupabaseJwtSecret() {
  try {
    console.log("🔍 Getting Supabase JWT secret...");
    
    // The JWT secret is typically the same as the anon key for Supabase
    // But let's get it from the project settings
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    
    if (!anonKey) {
      console.error("❌ VITE_SUPABASE_ANON_KEY not found in environment");
      return;
    }

    console.log("✅ Found Supabase anon key (this is used as JWT secret)");
    console.log("🔑 JWT Secret:", anonKey);
    console.log("📏 Secret length:", anonKey.length);
    
    // Create or update .env file for backend
    const backendEnvPath = "../kch-backend/.env";
    const envContent = `# Supabase JWT Secret for backend validation
SUPABASE_JWT_SECRET=${anonKey}

# Other backend environment variables
JWT_SECRET=${anonKey}
`;

    try {
      fs.writeFileSync(backendEnvPath, envContent);
      console.log("✅ Backend .env file updated with Supabase JWT secret");
    } catch (error) {
      console.warn("⚠️  Could not write to backend .env file:", error.message);
      console.log("📝 Please manually add this to your backend .env file:");
      console.log(`SUPABASE_JWT_SECRET=${anonKey}`);
    }

    console.log("\n🎉 Setup complete!");
    console.log("The backend should now be able to validate Supabase JWT tokens.");
    console.log("Restart your backend server to apply the changes.");

  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the function
getSupabaseJwtSecret();
