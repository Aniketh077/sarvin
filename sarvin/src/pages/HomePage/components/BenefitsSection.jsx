import React from 'react';
import { Truck, Shield, CreditCard, Phone } from 'lucide-react';

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders across India.'
    },
    {
      icon: Shield,
      title: 'Extended Warranty',
      description: 'period varies with each product.'
    },
    {
      icon: CreditCard,
      title: 'Secure Payment',
      description: '100% secure checkout with Razorpay'
    },
    {
      icon: Phone,
      title: '24/7 Support',
      description: 'Dedicated customer service team'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Sarvin?</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We're committed to providing the best shopping experience
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="text-center group">
              <div className="bg-gradient-to-br from-[#EBF5FF] to-[#DBEAFE] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <benefit.icon className="h-10 w-10 text-[#2A4365]" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;