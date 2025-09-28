# OctopusClips Project Analysis

## Authentication Flow

### Current Signup/Signin Flow
1. **Signin Page** (`/signin`): 
   - Single form with toggle between Sign In and Sign Up modes
   - Uses email/password authentication via Supabase
   - After sign up: redirects to `/pricing` after 2 seconds
   - After sign in: redirects to `/pricing` immediately
   - Includes loading states with spinner and disabled form during processing

2. **Supabase Integration** (`hooks/use-supabase.ts`):
   - Client-side authentication using Supabase JavaScript library
   - Uses `supabase.auth.signUp()` and `supabase.auth.signInWithPassword()`
   - Redirects to auth callback with `emailRedirectTo: ${window.location.origin}/auth/callback`

3. **Auth Callback** (`/auth/callback`):
   - Handles OAuth callback by extracting tokens from URL hash
   - Uses `supabase.auth.setSession()` to establish session
   - Checks for waitlist email in session storage and adds user to waitlist if present
   - Redirects to `/pricing` after successful authentication

### Potential Performance Issues in Authentication Flow
1. **Network Latency**: Multiple network calls to Supabase (check session, sign in/up, set session)
2. **Session State Management**: useEffect hook in useSupabase that runs on every component mount
3. **Database Operations**: Fetching user profiles after authentication
4. **Sequential Operations**: Multiple operations happening in sequence in the callback page
5. **Redirect Delays**: Unnecessary 2-second timeout after sign up

## Payment Flow

### Complete Payment Process
1. **Pricing Page** (`/pricing`):
   - Displays Free Waitlist and Founder Access options
   - Founder Access costs $10 (shown as $67 with 33% off from $100)
   - Payment handled via Razorpay integration

2. **Razorpay Integration** (`components/pricing.tsx`):
   - Calls `createRazorpayOrder(amount, userId)` to create order
   - Initializes Razorpay checkout with `window.Razorpay`
   - Payment handler calls `verifyPaymentSignature()` to verify transaction

3. **Payment Verification** (`lib/payment.ts` and `app/api/verify-payment/route.ts`):
   - Client calls API route `/api/verify-payment` with payment details
   - Server-side verification of payment signature using HMAC-SHA256
   - Updates Supabase orders table status to 'paid'
   - Creates payment record in payments table
   - Updates user profile to grant beta access

4. **Success Handling**:
   - Shows success toast message
   - Redirects to `/dashboard` after verification

## Theme & Styling

### Design System
1. **Color Palette**:
   - Primary: Purple (#6366f1) and Blue (#0ea5e9)
   - Secondary: Gold/Yellow (#f59e0b) for premium elements
   - Dark background (#0b0b0f) with light text (#ffffff)

2. **Visual Effects**:
   - Glassmorphism: `background: rgba(255, 255, 255, 0.06); backdrop-filter: blur(8px);`
   - Gradients: Multiple gradient effects for modern look
   - Custom shadows with glow effects
   - Textures: Subtle grain texture overlay

3. **Typography**:
   - Inter font for regular text
   - Poppins font for display headings
   - Responsive typography scaling

4. **UI Components**:
   - Uses shadcn/ui components (Card, Button, Input, etc.)
   - Custom glassmorphism and gradient styles
   - Hover animations and scale effects

### Styling Approach
- Tailwind CSS with custom theme configuration
- CSS variables for consistent color system
- Custom scrollbar styling
- Responsive design with mobile-first approach
- Dark mode as default (with next-themes for future light mode)

## Technologies Used

### Frontend
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### Backend Services
- Supabase (Authentication & Database)
- Razorpay (Payments)
- next-themes (Theme management)

### Payment Integration Details
- Razorpay SDK for payment processing
- Server-side signature verification for security
- Database storage of orders and payments in Supabase
- Profile updates to grant beta access after successful payment