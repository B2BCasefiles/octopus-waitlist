# Supabase Auth Configuration Guide

This guide outlines the necessary Supabase Auth settings to ensure proper email confirmation and secure authentication flow.

## Required Auth Settings

### 1. Email Confirmation Settings
- **Enable Email Confirmation**: Required for secure signup flow
  - Go to your Supabase dashboard → Authentication → Settings
  - Enable "Email Confirmations"
  - This ensures users must confirm their email before accessing protected resources

### 2. Redirect URLs
- **Site URL**: Set to your production URL (e.g., `https://yoursite.com`)
- **Redirect URLs**: Add the following:
  - `http://localhost:3000/auth/callback` (for development)
  - `https://yoursite.com/auth/callback` (for production)

### 3. Email Templates
Customize the confirmation email template to provide clear instructions:

**Subject**: Confirm your email for [Your App Name]

**Content**:
```
Welcome to [Your App Name]!

Please confirm your email address by clicking the link below:
{{ .ConfirmationURL }}

If you didn't sign up for an account, you can safely ignore this email.
```

### 4. Password Requirements
- **Minimum Length**: At least 6 characters (recommended: 8+)
- **Additional Security**: Consider enabling additional password strength requirements

### 5. Security Settings
- **Disable Sign Ups**: Should be disabled to allow all signups (unless you want to restrict to specific domains)
- **Blocklist**: Configure email domain blocklists if needed
- **Rate Limiting**: Configure appropriate rate limits to prevent spam

## Supabase Auth API Usage

The application implements the following best practices:

1. **Secure Signup**:
   - Uses `supabase.auth.signUp()` with proper email and password validation
   - Automatically sends confirmation email
   - Properly handles `requiresConfirmation` response

2. **Email Confirmation Flow**:
   - The auth callback page checks if `user.email_confirmed_at` exists
   - Only allows access after email confirmation
   - Provides clear user feedback if email is not confirmed

3. **Secure Signin**:
   - Uses `supabase.auth.signInWithPassword()` for secure login
   - Implements proper error handling
   - Redirects to appropriate pages after authentication

## Migration Scripts

The application includes migration scripts for a complete database refactor:

1. `002_cleanup_schema.sql` - Drops existing schema in reverse dependency order
2. `003_refactor_auth_waitlist_schema.sql` - Creates new schema with proper RLS policies

## Environment Variables Required

Make sure these are configured in your `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```