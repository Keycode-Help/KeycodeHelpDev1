import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: "../.env.local" });

// Supabase configuration
const supabaseUrl =
  process.env.VITE_SUPABASE_URL || "https://chgpiymqsdxnulmtitdh.supabase.co";
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for admin operations

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "❌ Error: Supabase URL or Service Role Key not found in environment variables."
  );
  console.error(
    "Please make sure VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in your .env file"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function updateUserRole() {
  try {
    console.log("🔍 Updating user role for 5epmgllc@gmail.com...");

    // First, let's check the current user metadata
    const {
      data: { users },
      error: listError,
    } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Error listing users:", listError);
      return;
    }

    const targetUser = users.find(
      (user) => user.email === "5epmgllc@gmail.com"
    );

    if (!targetUser) {
      console.error("❌ User 5epmgllc@gmail.com not found");
      return;
    }

    console.log("👤 Found user:", {
      id: targetUser.id,
      email: targetUser.email,
      current_metadata: targetUser.user_metadata,
    });

    // Update the user's metadata to include SUPER_ADMIN role
    const { data, error } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      {
        user_metadata: {
          ...targetUser.user_metadata,
          role: "SUPER_ADMIN",
        },
      }
    );

    if (error) {
      console.error("❌ Error updating user metadata:", error);
      return;
    }

    console.log("✅ Successfully updated user role to SUPER_ADMIN");
    console.log("📋 Updated user data:", {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata.role,
      metadata: data.user.user_metadata,
    });
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the update
updateUserRole();
