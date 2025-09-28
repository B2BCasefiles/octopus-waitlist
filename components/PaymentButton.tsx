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