import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, Facebook, Twitter, Instagram, Youtube, ArrowRight } from 'lucide-react';
import FAQModal from '../FAQModal/FAQModal';

const Footer = () => {
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);

  const handleFAQClick = (e) => {
    e.preventDefault();
    setIsFAQModalOpen(true);
  };

  const closeFAQModal = () => {
    setIsFAQModalOpen(false);
  };

  return (
    <>
      <footer className="bg-[#1A202C] text-white">
        <div className="container mx-auto px-4">
          {/* Main Footer Content */}
          <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center mb-4">
                <img
                  src="/sarvinindia.jpeg"
                  alt="Sarvin"
                  className="h-10 w-auto object-contain"
                  style={{ maxWidth: '120px' }}
                />
              </Link>
              <p className="text-gray-300 mb-6">
                Sarvin brings you the best in home appliances with premium quality, innovative technology,
                and exceptional customer service. Transform your home with our wide range of products.
              </p>
              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-[#C87941] mt-1 mr-3" />
                  <span className="text-gray-300">sarvinhomeappl@gmail.com</span>
                </div>
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-[#C87941] mt-1 mr-3" />
                  <span className="text-gray-300">+91 93109 79906</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-300 hover:text-[#C87941] transition-colors">Home</Link></li>
                <li><Link to="/products" className="text-gray-300 hover:text-[#C87941] transition-colors">Shop</Link></li>
                {/* <li><Link to="/deals" className="text-gray-300 hover:text-[#C87941] transition-colors">Special Deals</Link></li> */}
                <li><Link to="/about" className="text-gray-300 hover:text-[#C87941] transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-300 hover:text-[#C87941] transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Help & Info with Newsletter */}
            <div className="space-y-8">
              {/* Help & Info Section */}
              <div>
                <h3 className="text-lg font-semibold mb-4 border-b border-gray-700 pb-2">Help & Info</h3>
                <ul className="space-y-2">
                  <li><a href="tel:+919310979906" className="text-gray-300 hover:text-[#C87941] transition-colors">Customer Service +91 93109 79906</a></li>
                  <li>
                    <button 
                      onClick={handleFAQClick}
                      className="text-gray-300 hover:text-[#C87941] transition-colors text-left"
                    >
                      FAQs
                    </button>
                  </li>
                </ul>
              </div>

              {/* Newsletter Section */}
              {/* <div>
                <p className="text-gray-300 text-sm mb-4">
                  Subscribe to our newsletter for the latest products and exclusive offers
                </p>
                <form className="space-y-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 text-gray-900 rounded-md focus:outline-none text-sm"
                  />
                  <button
                    type="submit"
                    className="w-full bg-[#C87941] hover:bg-[#B86931] px-3 py-2 rounded-md flex items-center justify-center transition-colors text-sm"
                  >
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </form>
              </div> */}
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-700 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 text-sm mb-4 md:mb-0">
                &copy; {new Date().getFullYear()} Sarvin Home Appliances. All rights reserved.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/profile.php?id=100079974925586&mibextid=ZbWKwL" className="text-gray-300 hover:text-[#C87941] transition-colors" aria-label="Facebook">
                  <Facebook className="h-5 w-5" />
                </a>
                {/* <a href="#" className="text-gray-300 hover:text-[#C87941] transition-colors" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a> */}
                <a href="https://www.instagram.com/sarvinindia/" className="text-gray-300 hover:text-[#C87941] transition-colors" aria-label="Instagram">
                  <Instagram className="h-5 w-5" />
                </a>
                {/* <a href="#" className="text-gray-300 hover:text-[#C87941] transition-colors" aria-label="YouTube">
                  <Youtube className="h-5 w-5" />
                </a> */}
              </div>
            </div>
          </div>
        </div>
      </footer>

      <FAQModal isOpen={isFAQModalOpen} onClose={closeFAQModal} />
    </>
  );
};

export default Footer;