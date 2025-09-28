# Supabase API Testing

This document explains how to test the Supabase API functionality in your waitlist application.

## Overview

The test suite verifies the following Supabase functionality:
- ✅ Database connection and access
- ✅ Waitlist operations (add, get, duplicate handling)
- ✅ Authentication (sign up, sign in, sign out)
- ✅ Payment table operations
- ✅ Row Level Security (RLS) policies

## Prerequisites

1. **Environment Variables**: Ensure your `.env.local` file contains:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Optional, for cleanup
   ```

2. **Dependencies**: Install required packages:
   ```bash
   npm install
   ```

## Running Tests

### Quick Test Run
```bash
npm run test:supabase
```

### Watch Mode (Re-runs on file changes)
```bash
npm run test:supabase:watch
```

### Manual Execution
```bash
npx tsx scripts/run-supabase-tests.ts
```

## Test Structure

### 1. Connection Tests
- **Supabase Client Connection**: Verifies the client initializes correctly
- **Database Access Test**: Confirms basic database connectivity

### 2. Waitlist Functionality
- **Add Operation**: Tests adding new entries to the waitlist
- **Get Operation**: Tests retrieving waitlist entries
- **Duplicate Handling**: Verifies unique email constraint enforcement

### 3. Authentication Tests
- **Sign Up**: Tests user registration
- **Sign In**: Tests user authentication
- **Sign Out**: Tests session termination

### 4. Payment Operations
- **Table Access**: Verifies payment table accessibility
- **Insert Operation**: Tests payment record creation

### 5. Cleanup
- Removes test data from both `waitlist` and `payments` tables
- Attempts to clean up test user accounts (requires admin access)

## Test Output

The test suite provides detailed output including:
- ✅ Individual test results with execution time
- 📊 Summary statistics (passed/failed/total time)
- ❌ Detailed error messages for failed tests
- 🎉 Overall success/failure status

Example output:
```
🚀 Starting Supabase API Tests...

✅ Supabase Client Connection - 45ms
✅ Database Access Test - 123ms
✅ Waitlist Add Operation - 234ms
✅ Waitlist Get Operation - 89ms
✅ Waitlist Duplicate Handling - 156ms
✅ Authentication Sign Up - 567ms
✅ Authentication Sign In - 234ms
✅ Authentication Sign Out - 78ms
✅ Payment Table Access - 67ms
✅ Payment Insert - 189ms
✅ Cleanup Test Data - 145ms

📊 Test Results Summary:
==================================================
Total Tests: 11
Passed: 11
Failed: 0
Total Time: 1927ms
Success Rate: 100.0%

🎉 All tests passed!
```

## Troubleshooting

### Common Issues

1. **Missing Environment Variables**
   ```
   ❌ Missing required environment variables:
     - NEXT_PUBLIC_SUPABASE_URL
   ```
   **Solution**: Check your `.env.local` file

2. **Database Connection Failed**
   ```
   ❌ Database Access Test - Database access failed: Invalid API key
   ```
   **Solution**: Verify your Supabase URL and anon key

3. **RLS Policy Issues**
   ```
   ❌ Waitlist Add Operation - Failed to add to waitlist: permission denied
   ```
   **Solution**: Check your RLS policies in Supabase dashboard

4. **Authentication Errors**
   ```
   ❌ Authentication Sign Up - Sign up failed: Email rate limit exceeded
   ```
   **Solution**: Wait a few minutes or use a different test email

### Test Data Cleanup

The test suite automatically cleans up test data, but if cleanup fails:

1. **Manual Waitlist Cleanup**:
   ```sql
   DELETE FROM waitlist WHERE email LIKE 'test-%@example.com';
   ```

2. **Manual Payment Cleanup**:
   ```sql
   DELETE FROM payments WHERE email LIKE 'test-%@example.com';
   ```

3. **Manual User Cleanup**: Use Supabase dashboard → Authentication → Users

## Extending Tests

To add new tests, modify `tests/supabase-test.ts`:

```typescript
private async testNewFeature(): Promise<void> {
  await this.runTest('New Feature Test', async () => {
    // Your test logic here
    const result = await someSupabaseOperation()
    
    if (!result.success) {
      throw new Error('Test failed')
    }
  })
}
```

Then add the test to the `runAllTests()` method:
```typescript
await this.testNewFeature()
```

## Security Notes

- Tests use temporary data with unique timestamps
- No real user data is affected
- Service role key is only used for cleanup (optional)
- All test data is automatically removed after execution