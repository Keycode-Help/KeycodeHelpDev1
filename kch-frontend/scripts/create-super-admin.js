// Script to create Super Admin user using Supabase Auth API
// Run this with: node scripts/create-super-admin.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL?.replace('postgresql://', 'https://').replace(':5432/postgres', '');
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need to add this to .env.local

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!');
  console.error('Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file');
  console.error('You can find this in your Supabase project settings under API');
  process.exit(1);
}

// Create Supabase client with service role key (has admin privileges)
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSuperAdmin() {
  try {
    console.log('🔐 Creating Super Admin user...');
    
    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: '5epmgllc@gmail.com',
      password: 'Mrguru2054',
      email_confirm: true,
      user_metadata: {
        role: 'SUPER_ADMIN',
        fname: 'Super',
        lname: 'Admin'
      }
    });

    if (authError) {
      console.error('❌ Auth Error:', authError);
      return;
    }

    console.log('✅ User created in Supabase Auth:', authData.user.id);

    // Step 2: Insert into your custom users table (if you have one)
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          id: authData.user.id, // Use the auth user ID
          email: '5epmgllc@gmail.com',
          fname: 'Super',
          lname: 'Admin',
          role: 'SUPER_ADMIN',
          is_verified: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ])
      .select();

    if (userError) {
      console.error('❌ User Table Error:', userError);
      // User was created in auth but failed to insert in custom table
      console.log('⚠️  User exists in Auth but not in custom users table');
      console.log('You may need to create the users table or handle this manually');
    } else {
      console.log('✅ User inserted into custom users table:', userData);
    }

    console.log('🎉 Super Admin user created successfully!');
    console.log('User ID:', authData.user.id);
    console.log('Email:', authData.user.email);
    console.log('Role:', authData.user.user_metadata.role);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the function
createSuperAdmin();
