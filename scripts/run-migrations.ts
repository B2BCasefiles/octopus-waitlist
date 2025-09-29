// scripts/run-migrations.ts

import { createClient } from '@supabase/supabase-js';

// This script runs the database migrations in the correct order
// Run with: npx tsx scripts/run-migrations.ts

const runMigrations = async () => {
  // Get Supabase credentials from environment
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  console.log('Starting database migration process...');

  try {
    // First, run the cleanup migration
    console.log('Running migration 002: Cleanup old schema...');
    const cleanupResult = await runCleanupMigration(supabase);
    if (!cleanupResult.success) {
      throw new Error(`Cleanup migration failed: ${cleanupResult.error}`);
    }
    console.log('✓ Cleanup migration completed successfully');

    // Then, run the new schema migration
    console.log('Running migration 003: Apply new schema...');
    const newSchemaResult = await runNewSchemaMigration(supabase);
    if (!newSchemaResult.success) {
      throw new Error(`New schema migration failed: ${newSchemaResult.error}`);
    }
    console.log('✓ New schema migration completed successfully');

    console.log('All migrations completed successfully!');
  } catch (error) {
    console.error('Migration process failed:', error);
    process.exit(1);
  }
};

// Migration to clean up the old schema
const runCleanupMigration = async (supabase: any) => {
  try {
    // Remove RLS policies first
    await supabase.rpc('drop_policy_if_exists', { schema_name: 'public', table_name: 'profiles', policy_name: 'Users can view own profile' });
    await supabase.rpc('drop_policy_if_exists', { schema_name: 'public', table_name: 'profiles', policy_name: 'Users can update own profile' });
    await supabase.rpc('drop_policy_if_exists', { schema_name: 'public', table_name: 'orders', policy_name: 'Users can view own orders' });
    await supabase.rpc('drop_policy_if_exists', { schema_name: 'public', table_name: 'orders', policy_name: 'Users can insert own orders' });
    await supabase.rpc('drop_policy_if_exists', { schema_name: 'public', table_name: 'payments', policy_name: 'Users can view own payments' });
    await supabase.rpc('drop_policy_if_exists', { schema_name: 'public', table_name: 'payments', policy_name: 'Users can insert own payments' });

    // Drop triggers
    const dropTriggerQuery = `
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
      DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
      DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
    `;
    await supabase.rpc('execute_sql', { query: dropTriggerQuery });

    // Drop functions
    const dropFunctionQuery = `
      DROP FUNCTION IF EXISTS public.handle_new_user();
      DROP FUNCTION IF EXISTS update_updated_at_column();
    `;
    await supabase.rpc('execute_sql', { query: dropFunctionQuery });

    // Drop tables
    await supabase.rpc('execute_sql', { query: 'DROP TABLE IF EXISTS payments;' });
    await supabase.rpc('execute_sql', { query: 'DROP TABLE IF EXISTS orders;' });
    await supabase.rpc('execute_sql', { query: 'DROP TABLE IF EXISTS profiles;' });

    // Drop custom ENUM types
    await supabase.rpc('execute_sql', { query: 'DROP TYPE IF EXISTS payment_status;' });
    await supabase.rpc('execute_sql', { query: 'DROP TYPE IF EXISTS order_status;' });
    await supabase.rpc('execute_sql', { query: 'DROP TYPE IF EXISTS waitlist_status;' });

    // Remove any old waitlist table that might exist
    await supabase.rpc('execute_sql', { query: 'DROP TABLE IF EXISTS waitlist;' });

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Migration to create the new schema
const runNewSchemaMigration = async (supabase: any) => {
  try {
    // Create custom ENUM types
    const enumQueries = `
      CREATE TYPE waitlist_status AS ENUM ('pending', 'confirmed', 'rejected', 'active');
      CREATE TYPE order_status AS ENUM ('created', 'paid', 'failed', 'refunded', 'cancelled');
      CREATE TYPE payment_status AS ENUM ('pending', 'success', 'failure', 'refunded');
    `;
    await supabase.rpc('execute_sql', { query: enumQueries });

    // Create profiles table
    const createProfilesQuery = `
      CREATE TABLE profiles (
          id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
          email TEXT UNIQUE,
          username TEXT,
          first_name TEXT,
          last_name TEXT,
          phone TEXT,
          waitlist_status waitlist_status DEFAULT 'pending',
          beta_access BOOLEAN DEFAULT false,
          bought_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await supabase.rpc('execute_sql', { query: createProfilesQuery });

    // Create orders table
    const createOrdersQuery = `
      CREATE TABLE orders (
          id BIGSERIAL PRIMARY KEY,
          user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          razorpay_order_id TEXT UNIQUE NOT NULL,
          amount INTEGER NOT NULL,
          currency TEXT DEFAULT 'INR',
          plan_type TEXT DEFAULT 'founder',
          status order_status DEFAULT 'created',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await supabase.rpc('execute_sql', { query: createOrdersQuery });

    // Create payments table
    const createPaymentsQuery = `
      CREATE TABLE payments (
          id BIGSERIAL PRIMARY KEY,
          order_id BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
          user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
          razorpay_payment_id TEXT UNIQUE,
          razorpay_signature TEXT,
          status payment_status NOT NULL DEFAULT 'pending',
          amount INTEGER NOT NULL,
          payment_method TEXT,
          failure_reason TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;
    await supabase.rpc('execute_sql', { query: createPaymentsQuery });

    // Create indexes
    const createIndexesQuery = `
      CREATE INDEX idx_profiles_email ON profiles(email);
      CREATE INDEX idx_profiles_waitlist_status ON profiles(waitlist_status);
      CREATE INDEX idx_profiles_beta_access ON profiles(beta_access);
      CREATE INDEX idx_orders_user_id ON orders(user_id);
      CREATE INDEX idx_orders_razorpay_order_id ON orders(razorpay_order_id);
      CREATE INDEX idx_orders_status ON orders(status);
      CREATE INDEX idx_payments_order_id ON payments(order_id);
      CREATE INDEX idx_payments_user_id ON payments(user_id);
      CREATE INDEX idx_payments_razorpay_payment_id ON payments(razorpay_payment_id);
      CREATE INDEX idx_payments_status ON payments(status);
    `;
    await supabase.rpc('execute_sql', { query: createIndexesQuery });

    // Create functions
    const createFunctionsQuery = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = NOW();
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `;
    await supabase.rpc('execute_sql', { query: createFunctionsQuery });

    // Create triggers
    const createTriggersQuery = `
      CREATE TRIGGER update_profiles_updated_at 
          BEFORE UPDATE ON profiles 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();

      CREATE TRIGGER update_orders_updated_at 
          BEFORE UPDATE ON orders 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();

      CREATE TRIGGER update_payments_updated_at 
          BEFORE UPDATE ON payments 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();

      CREATE OR REPLACE FUNCTION public.handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
          INSERT INTO public.profiles (id, email)
          VALUES (NEW.id, NEW.email);
          RETURN NEW;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
    `;
    await supabase.rpc('execute_sql', { query: createTriggersQuery });

    // Enable Row Level Security
    const enableRLSQuery = `
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
      ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
    `;
    await supabase.rpc('execute_sql', { query: enableRLSQuery });

    // Create RLS policies
    const createPoliciesQuery = `
      CREATE POLICY "Users can view own profile" ON profiles
          FOR SELECT USING (auth.uid() = id);

      CREATE POLICY "Users can update own profile" ON profiles
          FOR UPDATE USING (auth.uid() = id);

      CREATE POLICY "Users can insert own profile" ON profiles
          FOR INSERT WITH CHECK (auth.uid() = id);

      CREATE POLICY "Users can view own orders" ON orders
          FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own orders" ON orders
          FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own orders" ON orders
          FOR UPDATE USING (auth.uid() = user_id);

      CREATE POLICY "Users can view own payments" ON payments
          FOR SELECT USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert own payments" ON payments
          FOR INSERT WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update own payments" ON payments
          FOR UPDATE USING (auth.uid() = user_id);
    `;
    await supabase.rpc('execute_sql', { query: createPoliciesQuery });

    // Grant permissions
    const grantPermissionsQuery = `
      GRANT USAGE ON SCHEMA public TO anon, authenticated;
      GRANT ALL ON profiles TO anon, authenticated;
      GRANT ALL ON orders TO anon, authenticated;
      GRANT ALL ON payments TO anon, authenticated;
      GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
    `;
    await supabase.rpc('execute_sql', { query: grantPermissionsQuery });

    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
};

// Helper function to execute raw SQL (would need to be implemented in the database)
// This is a placeholder - in real implementation, you'd need to create a database function
// or use a different approach since Supabase doesn't allow direct execution of multi-statement queries
const executeRawSQL = async (supabase: any, query: string) => {
  // This is a placeholder implementation
  // In a real application, you would run these queries directly in the Supabase SQL Editor
  // or use the Supabase CLI to manage migrations
  console.log('Executing SQL query:', query);
};

runMigrations();