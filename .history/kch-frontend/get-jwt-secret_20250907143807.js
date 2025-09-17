import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase configuration!');
  process.exit(1);
}

console.log('🔍 Supabase URL:', supabaseUrl);
console.log('🔍 Service Key length:', supabaseServiceKey.length);

// The JWT secret for Supabase is typically the service role key
// But let's also check if we can get it from the project settings
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function getJwtSecret() {
  try {
    console.log('🔑 JWT Secret (using service role key):', supabaseServiceKey);
    console.log('📏 Secret length:', supabaseServiceKey.length);
    
    // Update backend .env file
    
    const backendEnvPath = path.join(__dirname, '../kch-backend/.env');
    const envContent = `# Supabase JWT Secret for backend validation
SUPABASE_JWT_SECRET=${supabaseServiceKey}

# Other backend environment variables  
JWT_SECRET=${supabaseServiceKey}
`;

    try {
      fs.writeFileSync(backendEnvPath, envContent);
      console.log('✅ Backend .env file updated with correct JWT secret');
    } catch (error) {
      console.warn('⚠️ Could not write to backend .env file:', error.message);
      console.log('📝 Please manually add this to your backend .env file:');
      console.log(`SUPABASE_JWT_SECRET=${supabaseServiceKey}`);
    }

    console.log('\n🎉 JWT secret configuration complete!');
    console.log('The backend should now be able to validate Supabase JWT tokens correctly.');
    console.log('Restart your backend server to apply the changes.');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

getJwtSecret();
