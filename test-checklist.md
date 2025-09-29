# User Flow Testing Checklist

This document outlines the test steps to validate the complete user flow from signup to confirmation in the refactored Supabase Auth Waitlist Signup implementation.

## Test 1: User Signup Flow

### Prerequisites
- Database has been migrated using the new schema
- Supabase Auth email confirmation is enabled
- Application is running locally or deployed

### Steps
1. Navigate to the sign in page (`/signin`)
2. Click "Join Waitlist" to switch to signup mode
3. Enter a valid email and strong password
4. Click "Join Waitlist" button
5. Verify the following:
   - Form validation works properly
   - Account is created in Supabase Auth
   - Confirmation email is sent to the user
   - User is redirected to the pricing page with a success message

**Expected Results:**
- Account is created in Supabase with `email_confirmed_at` as null
- Confirmation email is sent to the provided email
- User sees "Please check your email to confirm your account" message
- User is redirected to `/pricing` after a short delay

## Test 2: Email Confirmation Flow

### Steps
1. Check the email account for the confirmation email
2. Click the confirmation link in the email
3. Verify the following:
   - Auth callback page (`/auth/callback`) processes the confirmation
   - `email_confirmed_at` field is set in the user's profile
   - User is redirected to the appropriate page (pricing)
   - If the user had come from the waitlist form, they should be added to the waitlist

**Expected Results:**
- User's email is now confirmed in Supabase Auth
- `email_confirmed_at` field is set in the user record
- User is redirected to `/pricing` page
- If waitlist email was stored in session, user is added to waitlist

## Test 3: Post-Confirmation Sign In

### Steps
1. Navigate to the sign in page (`/signin`)
2. Enter the email and password of the previously confirmed account
3. Click "Sign In" button
4. Verify the following:
   - User is successfully authenticated
   - User is redirected to the pricing page
   - User's profile data is properly accessible

**Expected Results:**
- User is successfully signed in
- User is redirected to `/pricing`
- User's profile data is accessible

## Test 4: Waitlist Functionality

### Steps
1. Sign in with a confirmed user account
2. Navigate to the pricing page
3. If not already on waitlist, click "Join Waitlist" button
4. Verify the following:
   - Profile's waitlist_status is set to 'pending'
   - Appropriate UI feedback is shown

**Expected Results:**
- User's profile is updated with `waitlist_status: 'pending'`
- Appropriate success message is displayed

## Test 5: Database Persistence Check

### Steps
1. Verify the following database records exist after each action:
   - Auth user record in `auth.users`
   - Profile record in `profiles` table (auto-created via trigger)
   - Waitlist status in `profiles.waitlist_status` field
   - RLS policies are properly enforcing access controls

## Test 6: Security Validation

### Steps
1. Verify that users can only access their own profile data
2. Verify that users can only access their own order/payment data
3. Verify that unconfirmed users cannot access protected resources

**Expected Results:**
- RLS policies are working correctly
- Users cannot access other users' data
- Unconfirmed users receive appropriate error messages

## Test 7: Error Handling

### Steps
1. Try to sign up with invalid email format
2. Try to sign up with weak password
3. Try to access auth callback without proper parameters
4. Try to access pricing page without confirming email

**Expected Results:**
- Proper validation errors are shown
- Weak passwords are rejected
- Invalid auth callbacks return appropriate errors
- Unconfirmed users receive clear instructions

## Validation Checklist

- [ ] Both entry points (Sign In and Join Waitlist) route users to unified signup flow
- [ ] Signup page validates email and password inputs
- [ ] Supabase Auth automatically sends confirmation email
- [ ] User receives clear instructions to check email
- [ ] Only confirmed users can access protected resources
- [ ] Profile record is automatically created via database trigger
- [ ] User's waitlist status is properly recorded
- [ ] Email confirmation requirement is enforced via Supabase settings
- [ ] Proper redirect URLs are configured
- [ ] Confirmation email template provides clear user guidance
- [ ] Password requirements are enforced
- [ ] Session management works properly after confirmation
- [ ] Database tables are properly linked with foreign keys
- [ ] Row Level Security is properly implemented
- [ ] All data is properly stored after migration and signup