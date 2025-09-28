import Razorpay from 'razorpay'

// Create a function to initialize Razorpay when needed (server-side only)
export const createRazorpayInstance = () => {
  if (typeof window !== 'undefined') {
    // Client-side, return null
    return null;
  }
  
  const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!key_id || !key_secret) {
    console.error('Razorpay environment variables are not set');
    return null;
  }
  
  try {
    const razorpayInstance = new Razorpay({
      key_id,
      key_secret,
    });
    return razorpayInstance;
  } catch (error) {
    console.error('Error creating Razorpay instance:', error);
    return null;
  }
};

// Export a function that creates the instance when needed
export const getRazorpayInstance = () => {
  if (typeof window !== 'undefined') {
    // Client-side, return null
    return null;
  }
  return createRazorpayInstance();
};

// For backward compatibility with existing code
export const razorpay = getRazorpayInstance();
