export const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const initiatePayment = (options) => {
  return new Promise((resolve, reject) => {
    const rzp = new window.Razorpay({
      ...options,
      handler: function(response) {
        resolve(response);
      },
      prefill: {
        name: options.name,
        email: options.email,
        contact: options.contact
      },
      theme: {
        color: '#2A4365'
      }
    });
    
    rzp.on('payment.failed', function(response) {
      reject(new Error(response.error.description));
    });
    
    rzp.open();
  });
};