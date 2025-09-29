# Database Migration Guide

## Running Migrations

To run the database migrations for the waitlist and auth refactor:

1. **Prerequisites**:
   - Install the Supabase CLI: `npm install -g supabase`
   - Ensure you're logged in: `supabase login`
   - Link your project: `supabase link --project-ref YOUR_PROJECT_REF`

2. **Run Migrations**:
   ```bash
   # Apply all pending migrations
   supabase db push
   
   # Or apply migrations individually
   supabase migration up 002_cleanup_schema
   supabase migration up 003_refactor_auth_waitlist_schema
   ```

3. **Migration Files**:
   - `002_cleanup_schema.sql`: Drops old schema elements
   - `003_refactor_auth_waitlist_schema.sql`: Creates new schema with proper RLS policies

## Migration Steps

The migration process follows these steps:

### Phase 1: Database Cleanup
1. Remove Row Level Security (RLS) policies
2. Drop triggers
3. Drop functions
4. Drop tables
5. Drop custom ENUM types

### Phase 2: Schema Recreation
1. Create custom ENUM types for waitlist, orders, and payment status
2. Create profiles table with linked Supabase auth.users id and RLS for privacy
3. Create orders and payments tables linked to profiles
4. Create indexes for performance
5. Create triggers for automatic profile creation and updated_at timestamps
6. Enable Row Level Security and policies for granular user data access
7. Grant necessary permissions

## Rollback Process

If you need to rollback changes:

```bash
# Rollback one migration
supabase migration down

# Or rollback to a specific migration
supabase migration down --to 001_create_schema
```

## Important Notes

- The migration order is crucial to avoid dependency issues
- Always backup your database before running migrations in production
- Test migrations on a development/staging environment first
- The new schema properly links user accounts with Supabase Auth
- Row Level Security ensures users can only access their own data