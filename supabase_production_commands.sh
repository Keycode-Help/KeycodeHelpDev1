#!/bin/bash

# Supabase Production Migration Commands
# Run these commands to deploy the transponder database to production

set -e

echo "🚀 Starting Supabase Production Migration for Transponder Database"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo -e "${RED}❌ Supabase CLI is not installed. Please install it first:${NC}"
    echo "npm install -g supabase"
    exit 1
fi

# Check if we're in the right directory
if [ ! -f "production_migration.sql" ] || [ ! -f "production_data_import.sql" ]; then
    echo -e "${RED}❌ Migration files not found. Please run this script from the project root directory.${NC}"
    exit 1
fi

echo -e "${BLUE}🔍 Checking Supabase connection...${NC}"

# Login to Supabase (if not already logged in)
if ! supabase projects list &> /dev/null; then
    echo -e "${YELLOW}⚠️  Not logged into Supabase. Please login:${NC}"
    supabase login
fi

# Get project reference
echo -e "${YELLOW}📋 Please enter your Supabase project reference (found in your project settings):${NC}"
read -p "Project Reference: " PROJECT_REF

if [ -z "$PROJECT_REF" ]; then
    echo -e "${RED}❌ Project reference is required${NC}"
    exit 1
fi

# Link to project
echo -e "${BLUE}🔗 Linking to Supabase project...${NC}"
supabase link --project-ref $PROJECT_REF

# Create migration files in Supabase migrations directory
echo -e "${BLUE}📁 Creating migration files...${NC}"

# Initialize Supabase if not already done
if [ ! -d "supabase" ]; then
    echo -e "${YELLOW}🏗️  Initializing Supabase project structure...${NC}"
    supabase init
fi

# Create timestamp for migration
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

# Copy migration files to supabase/migrations
echo -e "${BLUE}📄 Creating migration files...${NC}"
cp production_migration.sql "supabase/migrations/${TIMESTAMP}_create_transponder_schema.sql"
cp production_data_import.sql "supabase/migrations/${TIMESTAMP}_import_transponder_data.sql"

echo -e "${GREEN}✅ Migration files created:${NC}"
echo "  - supabase/migrations/${TIMESTAMP}_create_transponder_schema.sql"
echo "  - supabase/migrations/${TIMESTAMP}_import_transponder_data.sql"

# Ask if user wants to run migrations now
echo -e "${YELLOW}🤔 Do you want to run the migrations now? (y/n):${NC}"
read -p "Run migrations: " RUN_MIGRATIONS

if [ "$RUN_MIGRATIONS" = "y" ] || [ "$RUN_MIGRATIONS" = "Y" ]; then
    echo -e "${BLUE}🏃 Running database migrations...${NC}"
    
    # Push migrations to remote
    echo -e "${BLUE}📤 Pushing migrations to production...${NC}"
    supabase db push
    
    echo -e "${GREEN}✅ Schema migration completed!${NC}"
    
    # Ask about data import
    echo -e "${YELLOW}🤔 Do you want to import the transponder data now? (y/n):${NC}"
    read -p "Import data: " IMPORT_DATA
    
    if [ "$IMPORT_DATA" = "y" ] || [ "$IMPORT_DATA" = "Y" ]; then
        echo -e "${BLUE}📊 Importing transponder data...${NC}"
        
        # Check if CSV file exists
        if [ -f "/Users/apple/Downloads/transponder_data_full_v2.csv" ]; then
            # Upload CSV data using psql (requires connection string)
            echo -e "${YELLOW}📋 Please enter your Supabase database connection string:${NC}"
            echo "Format: postgresql://postgres:[password]@[host]:5432/postgres"
            read -s -p "Connection String: " DB_CONNECTION
            echo ""
            
            # Create temporary SQL file for data import
            cat > temp_import.sql << EOF
-- Import CSV data
CREATE TEMP TABLE temp_import_data (
    make VARCHAR(100),
    model VARCHAR(150),
    year_from VARCHAR(20),
    year_to VARCHAR(20),
    year_note VARCHAR(100),
    system_type VARCHAR(150),
    transponder_family VARCHAR(200),
    transponder_detail TEXT,
    cross_refs TEXT,
    oem_keys TEXT,
    notes TEXT
);

\\copy temp_import_data FROM '/Users/apple/Downloads/transponder_data_full_v2.csv' DELIMITER ',' CSV HEADER;

-- Run the import process from production_data_import.sql
$(cat production_data_import.sql | grep -A 1000 "STEP 4: PROCESS IMPORT DATA")
EOF
            
            # Execute import
            echo -e "${BLUE}📥 Executing data import...${NC}"
            psql "$DB_CONNECTION" -f temp_import.sql
            
            # Cleanup
            rm temp_import.sql
            
            echo -e "${GREEN}✅ Data import completed!${NC}"
        else
            echo -e "${YELLOW}⚠️  CSV file not found at /Users/apple/Downloads/transponder_data_full_v2.csv${NC}"
            echo -e "${YELLOW}Please upload the data manually via Supabase Dashboard or provide the correct path.${NC}"
        fi
    fi
fi

# Generate environment variables
echo -e "${BLUE}🔧 Generating environment variables...${NC}"

# Get project URL and anon key
PROJECT_URL="https://$PROJECT_REF.supabase.co"
echo -e "${GREEN}📝 Add these environment variables to your .env.local file:${NC}"
echo ""
echo "# Supabase Configuration"
echo "NEXT_PUBLIC_SUPABASE_URL=$PROJECT_URL"
echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=[Your Supabase Anon Key]"
echo "SUPABASE_SERVICE_ROLE_KEY=[Your Supabase Service Role Key]"
echo ""
echo -e "${YELLOW}📋 You can find your API keys in your Supabase project settings > API.${NC}"

# Create a sample .env.local file
cat > .env.local.example << EOF
# Supabase Configuration for Transponder Database
NEXT_PUBLIC_SUPABASE_URL=$PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Optional: Database direct connection (for admin operations)
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
EOF

echo -e "${GREEN}✅ Created .env.local.example file${NC}"

# Test connection
echo -e "${BLUE}🧪 Testing database connection...${NC}"
supabase db pull --dry-run

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Database connection successful!${NC}"
else
    echo -e "${RED}❌ Database connection failed. Please check your configuration.${NC}"
fi

# Summary
echo ""
echo -e "${GREEN}🎉 Migration process completed!${NC}"
echo -e "${GREEN}================================================${NC}"
echo ""
echo -e "${BLUE}📊 Summary:${NC}"
echo "✅ Schema migration files created"
echo "✅ Database schema deployed (if selected)"
echo "✅ Data import configured (if selected)"
echo "✅ Environment variables template created"
echo ""
echo -e "${BLUE}🔗 Next Steps:${NC}"
echo "1. Copy your API keys from Supabase Dashboard to .env.local"
echo "2. Test the API endpoints in your frontend"
echo "3. Deploy your frontend with the new environment variables"
echo ""
echo -e "${BLUE}📚 Available API Functions:${NC}"
echo "- search_vehicles(make, model, year, transponder_family, limit)"
echo "- search_transponders_fulltext(search_term, limit)"
echo "- get_vehicle_exact(make, model, year)"
echo ""
echo -e "${BLUE}📖 Views Available:${NC}"
echo "- transponder_data_view (full data with joins)"
echo "- api_transponder_search (optimized for frontend)"
echo "- vehicle_summary (dashboard stats)"
echo "- transponder_family_summary (family usage stats)"
echo ""
echo -e "${GREEN}🚀 Your transponder database is ready for production!${NC}"
