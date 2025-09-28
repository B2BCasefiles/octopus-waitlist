import Razorpay from 'razorpay';
import { NextRequest, NextResponse } from 'next/server';

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { amount, currency } = (await request.json()) as { 
      amount: string; 
      currency: string; 
    };

    const options = {
      amount: amount,
      currency: currency,
      receipt: `rcp_order_${Date.now()}`, // Unique receipt ID
    };

    const order = await razorpay.orders.create(options);
    
    return NextResponse.json({ 
      orderId: order.id,
      amount: order.amount,
      currency: order.currency 
    }, { status: 200 });
    
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json(
      { error: 'Failed to create order' }, 
      { status: 500 }
    );
  }
}