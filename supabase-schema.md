# Supabase Database Schema for OctopusClips

## waitlist table

```sql
CREATE TABLE waitlist (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  plan VARCHAR(50) DEFAULT 'free',
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_waitlist_email ON waitlist(email);
```

## payments table

```sql
CREATE TABLE payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id VARCHAR(255) UNIQUE NOT NULL,
  payment_id VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  plan VARCHAR(50) NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'INR',
  status VARCHAR(50) DEFAULT 'created',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_email ON payments(email);
CREATE INDEX idx_payments_status ON payments(status);
```

## RLS (Row Level Security) Policies

```sql
-- For waitlist table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select for all" ON waitlist FOR SELECT USING (true);
CREATE POLICY "Allow insert for all" ON waitlist FOR INSERT WITH CHECK (true);

-- For payments table
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow select for own payments" ON payments FOR SELECT USING (auth.uid() = email);
CREATE POLICY "Allow insert for authenticated users" ON payments FOR INSERT WITH CHECK (auth.uid() = email);
```

## Setup Instructions:

1. Create these tables in your Supabase dashboard under the SQL Editor
2. Enable RLS if you want to restrict data access
3. Make sure to install the required extensions like `pgcrypto` for UUID generation
4. You can run these queries directly in the Supabase SQL Editor