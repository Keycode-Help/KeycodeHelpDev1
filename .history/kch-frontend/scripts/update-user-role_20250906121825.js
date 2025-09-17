import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://chgpiymqsdxnulmtitdh.supabase.co'
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoZ3BpeW1xc2R4bnVsbXRpdGRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYxNzQ5MDcsImV4cCI6MjA1MTc1MDkwN30.hcX/YSh5bgmIFvTX31sdsdcrEDNQi+wIAAH/GZmJa1puxj/SRIm1lGZD3e4TqCpNbUaaPB9ofvG1Xq6Z4qPGpw=='

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateUserRole() {
  try {
    console.log('🔍 Updating user role for 5epmgllc@gmail.com...')
    
    // First, let's check the current user metadata
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Error listing users:', listError)
      return
    }
    
    const targetUser = users.find(user => user.email === '5epmgllc@gmail.com')
    
    if (!targetUser) {
      console.error('❌ User 5epmgllc@gmail.com not found')
      return
    }
    
    console.log('👤 Found user:', {
      id: targetUser.id,
      email: targetUser.email,
      current_metadata: targetUser.user_metadata
    })
    
    // Update the user's metadata to include SUPER_ADMIN role
    const { data, error } = await supabase.auth.admin.updateUserById(
      targetUser.id,
      {
        user_metadata: {
          ...targetUser.user_metadata,
          role: 'SUPER_ADMIN'
        }
      }
    )
    
    if (error) {
      console.error('❌ Error updating user metadata:', error)
      return
    }
    
    console.log('✅ Successfully updated user role to SUPER_ADMIN')
    console.log('📋 Updated user data:', {
      id: data.user.id,
      email: data.user.email,
      role: data.user.user_metadata.role,
      metadata: data.user.user_metadata
    })
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the update
updateUserRole()
