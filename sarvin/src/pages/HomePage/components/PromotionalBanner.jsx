import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const PromotionalBanner = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-[#2A4365] to-[#1A365D] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <defs>
            <pattern id="pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0,40 L40,0 M-10,10 L10,-10 M30,50 L50,30" stroke="white" strokeWidth="2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="inline-block bg-[#C87941] text-white px-4 py-2  text-sm font-semibold mb-4">
            Limited Time Offer
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Special Seasonal Sale</h2>
          {/* <p className="text-xl mb-8">
            Enjoy up to 30% off on premium appliances and transform your home today!
          </p> */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/products?filter=featured">
              <Button
                variant="secondary"
                size="lg"
                className="animate-pulse"
              >
                Shop the Sale
              </Button>
            </Link>
            <Link to="/products">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-[#2A4365]"
              >
                Browse All Products
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromotionalBanner;