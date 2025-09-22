# Supabase Transponder Database Setup Instructions

## Overview

The complete transponder database has been split into 6 manageable parts for Supabase SQL Editor.

## Run Order (IMPORTANT - follow this exact sequence):

### 1. supabase_part1_cleanup_reference.sql

- Clears existing data
- Creates system types and transponder families
- Creates transponder details

### 2. supabase_part2_crossrefs_keys.sql

- Creates cross-references
- Creates OEM keys
- Creates notes
- Creates makes (vehicle manufacturers)

### 3. supabase_part3_models.sql

- Creates all vehicle models

### 4. supabase_part4_entries_1.sql

- Creates first batch of vehicle ranges and entries (1-65)

### 5. supabase_part5_entries_2.sql

- Creates second batch of vehicle ranges and entries (66-130)

### 6. supabase_part6_entries_3_final.sql

- Creates final batch of vehicle ranges and entries (131+)
- Resets database sequences
- Contains verification queries

## How to Run in Supabase:

1. Open Supabase Dashboard → SQL Editor
2. Copy and paste each file's contents ONE AT A TIME
3. Click "Run" after each file
4. Wait for completion before moving to the next file
5. Check for any errors and resolve before continuing

## Verification:

After running all parts, your database should contain:

- 195 transponder entries
- Complete vehicle make/model data
- All cross-references and OEM keys
- Full transponder family and system type data

## Troubleshooting:

If you get timeout errors, try running smaller sections at a time.
If you get constraint errors, ensure you ran the parts in the correct order.
If you get "null value in column non_member_price" error, the files have been updated to include required price columns (99.99, 79.99).
