export const loadRazorpay = () => {
  return new Promise((resolve) => {
    // Check if Razorpay is already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (amount, userDetails, onSuccess, onFailure) => {
  try {
    console.log('Initiating Razorpay payment for amount:', amount);
    
    // Load Razorpay script
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      throw new Error('Razorpay SDK failed to load');
    }

    // Get token from the user object stored in localStorage
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      throw new Error('User not authenticated');
    }

    const userData = JSON.parse(storedUser);
    const token = userData.token;
    
    if (!token) {
      throw new Error('Authentication token not found');
    }

    console.log('Creating Razorpay order...');

    // Create order on backend first
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders/create-razorpay-order`, {

      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ amount: Math.round(amount * 100) }) // Convert to paise
    });

    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);

    // Check if response is ok
    if (!response.ok) {
      let errorMessage = 'Failed to create Razorpay order';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('Error response:', errorData);
      } catch (e) {
        // If response is not JSON, use status text
        errorMessage = `${response.status}: ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    // Check if response has content
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (!responseText) {
      throw new Error('Empty response from server');
    }

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error('JSON parse error:', e);
      throw new Error('Invalid JSON response from server');
    }

    console.log('Parsed response:', responseData);

    const { razorpayOrder } = responseData;

    if (!razorpayOrder || !razorpayOrder.id) {
      throw new Error('Invalid response: missing razorpayOrder or order ID');
    }

    console.log('Razorpay order created:', razorpayOrder.id);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      name: 'Sarvin ',
      description: 'Order Payment',
      order_id: razorpayOrder.id,
      handler: function(response) {
        console.log('Payment success:', response);
        // Payment success
        onSuccess({
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_order_id: response.razorpay_order_id,
          razorpay_signature: response.razorpay_signature
        });
      },
      prefill: {
        name: userDetails.name,
        email: userDetails.email,
        contact: userDetails.contact
      },
      theme: {
        color: '#2A4365'
      },
      modal: {
        ondismiss: function() {
          console.log('Payment cancelled by user');
          onFailure('Payment cancelled by user');
        }
      }
    };

    console.log('Opening Razorpay with options:', options);

    const rzp = new window.Razorpay(options);
    
    rzp.on('payment.failed', function(response) {
      console.error('Payment failed:', response);
      onFailure(response.error.description || 'Payment failed');
    });
    
    rzp.open();
  } catch (error) {
    console.error('Payment initiation error:', error);
    onFailure(error.message);
  }
};