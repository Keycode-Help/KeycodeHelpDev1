// Script to update existing user's role to SUPER_ADMIN
// Run this with: node scripts/update-super-admin-role.js

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

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

// Create Supabase client with service role key (has admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function updateSuperAdminRole() {
  try {
    console.log("🔍 Looking for user: 5epmgllc@gmail.com");

    // First, let's list all users to find the one we need
    const { data: users, error: listError } =
      await supabase.auth.admin.listUsers();

    if (listError) {
      console.error("❌ Error listing users:", listError);
      return;
    }

    console.log(`📋 Found ${users.users.length} users in Supabase Auth`);

    // Find the specific user
    const targetUser = users.users.find(
      (user) => user.email === "5epmgllc@gmail.com"
    );

    if (!targetUser) {
      console.error("❌ User 5epmgllc@gmail.com not found in Supabase Auth");
      console.log("Available users:");
      users.users.forEach((user) => {
        console.log(`  - ${user.email} (ID: ${user.id})`);
      });
      return;
    }

    console.log("✅ Found user:", {
      id: targetUser.id,
      email: targetUser.email,
      current_role: targetUser.user_metadata?.role || "No role set",
      user_metadata: targetUser.user_metadata,
    });

    // Update the user's metadata to include SUPER_ADMIN role
    const { data: updateData, error: updateError } =
      await supabase.auth.admin.updateUserById(targetUser.id, {
        user_metadata: {
          ...targetUser.user_metadata,
          role: "SUPER_ADMIN",
          fname: targetUser.user_metadata?.fname || "Super",
          lname: targetUser.user_metadata?.lname || "Admin",
        },
      });

    if (updateError) {
      console.error("❌ Error updating user:", updateError);
      return;
    }

    console.log("✅ User updated successfully!");
    console.log("Updated user data:", {
      id: updateData.user.id,
      email: updateData.user.email,
      role: updateData.user.user_metadata?.role,
      user_metadata: updateData.user.user_metadata,
    });

    // Also update the password to ensure it's set correctly
    const { error: passwordError } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      {
        password: "Mrguru2054",
      }
    );

    if (passwordError) {
      console.warn(
        "⚠️  Warning: Could not update password:",
        passwordError.message
      );
    } else {
      console.log("✅ Password updated successfully");
    }

    console.log("🎉 Super Admin role update completed!");
    console.log("The user should now be able to access admin features.");
  } catch (error) {
    console.error("❌ Unexpected error:", error);
  }
}

// Run the function
updateSuperAdminRole();
