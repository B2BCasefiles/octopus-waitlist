# OctopusClips - Video Editing Platform

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- pnpm (or npm/yarn)

### Installation

1. Install dependencies:
```bash
pnpm install
```

2. Copy the environment variables file:
```bash
cp .env.example .env.local
```

3. Configure your environment variables in `.env.local`:
```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Razorpay Configuration
NEXT_RAZORPAY_KEY_ID=your_razorpay_key_id
NEXT_RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

4. Run the development server:
```bash
pnpm dev
```

### Supabase Setup

1. Create a Supabase account at [supabase.io](https://supabase.io)
2. Create a new project
3. Get your Project URL and Public Anonymous Key from Project Settings > API
4. Set up the database tables using the schema in `supabase-schema.md`
5. Add the credentials to your `.env.local` file

### Razorpay Setup

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Navigate to Dashboard > Settings > API Keys
3. Create a new key pair (for production, use live keys; for testing, use test keys)
4. Add the key ID and key secret to your `.env.local` file

### Database Schema

The database schema is documented in `supabase-schema.md`. You can run these SQL commands in your Supabase SQL Editor to set up the required tables.

### Features

- **Waitlist Management**: Users can join the waitlist with email
- **Payment Integration**: Razorpay integration for founder access plans
- **User Authentication**: Supabase authentication system
- **Dashboard**: User dashboard to manage account and waitlist status

### Available Pages

- `/` - Home page with hero, features, and pricing
- `/signin` - Authentication page for sign in/up
- `/dashboard` - User dashboard with waitlist status
- `/pricing` - Pricing section with payment options
- `/payment-success` - Payment success confirmation
- `/payment-failure` - Payment failure page

### API Routes

- `/api/verify-payment` - Verifies payment signatures with Razorpay

### Development

The project uses:
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Supabase for authentication and database
- Razorpay for payments

### Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase public anonymous key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (for server-side operations)
- `RAZORPAY_KEY_ID`: Your Razorpay key ID
- `RAZORPAY_KEY_SECRET`: Your Razorpay key secret