
FOLLOWING ARE THE STEPS TO IMPLMENT THE RAZORPAY PAYMENT GATWAY 
2. Server-Side (API Route - App Router):
Create Order API: Create an API route (e.g., app/api/order/route.ts) to handle order creation. This route will use your RAZORPAY_KEY_SECRET to interact with Razorpay's API.
TypeScript

    // app/api/order/route.ts
    import Razorpay from 'razorpay';
    import { NextRequest, NextResponse } from 'next/server';

    const razorpay = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    export async function POST(request: NextRequest) {
      const { amount, currency } = (await request.json()) as { amount: string; currency: string };
      const options = {
        amount: amount,
        currency: currency,
        receipt: 'rcp_order_1', // Unique receipt ID
      };
      const order = await razorpay.orders.create(options);
      return NextResponse.json({ orderId: order.id }, { status: 200 });
    }
3. Client-Side (Payment Component):
Include Razorpay Script: Dynamically load the Razorpay checkout script in your layout.tsx or the specific page where payment will occur.
TypeScript

    // app/layout.tsx (or relevant page)
    import Script from 'next/script';

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <body>
            {children}
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
          </body>
        </html>
      );
    }
Payment Button Component: Create a client-side component (e.g., components/PaymentButton.tsx) to initiate the payment.
TypeScript

    // components/PaymentButton.tsx
    'use client';
    import { useState } from 'react';

    const PaymentButton = () => {
      const [loading, setLoading] = useState(false);

      const handlePayment = async () => {
        setLoading(true);
        try {
          const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: '50000', currency: 'INR' }), // Example amount in paisa
          });
          const data = await response.json();
          const orderId = data.orderId;

          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: '50000', // Must match the amount used to create the order
            currency: 'INR',
            order_id: orderId,
            name: 'Your Company Name',
            description: 'Test Payment',
            handler: function (response: any) {
              alert('Payment Successful: ' + response.razorpay_payment_id);
              // You can send response.razorpay_payment_id, razorpay_order_id, razorpay_signature to your backend for verification
            },
            prefill: {
              name: 'John Doe',
              email: 'john.doe@example.com',
              contact: '9999999999',
            },
            theme: {
              color: '#3399cc',
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } catch (error) {
          console.error('Payment initiation failed:', error);
          alert('Payment failed. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      return (
        <button onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      );
    };

    export default PaymentButton;


DERIVALABLES :
FIX THIS ERROR 
nhandled Runtime Error
Error: `key_id` or `oauthToken` is mandatory

Source
lib\razorpay\client.ts (3:25) @ eval

  1 | import Razorpay from 'razorpay'
  2 |
> 3 | export const razorpay = new Razorpay({
    |                         ^
  4 |   key_id: process.env.RAZORPAY_KEY_ID!,
  5 |   key_secret: process.env.RAZORPAY_KEY_SECRET!,