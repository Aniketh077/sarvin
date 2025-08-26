import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapPin, Phone, Mail, Clock, Send, MessageCircle, Headphones, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { submitContactForm, resetContactState } from '../store/slices/newsletterContactSlice';
import { useToast } from '../contexts/ToastContext';
import  FAQModal from '../components/FAQModal/FAQModal';
import { getContactPageFAQs } from '../data/faqData';

const ContactPage = () => {
  const dispatch = useDispatch();
  const { showSuccess, showError } = useToast();
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);
  
  // Redux state
  const { 
    contactSubmitting, 
    contactSubmitted, 
    contactError 
  } = useSelector(state => state.newsletterContact);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showError('Please fill in all required fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showError('Please enter a valid email address');
      return;
    }

    try {
      await dispatch(submitContactForm(formData)).unwrap();
      showSuccess('Your message has been sent successfully! We\'ll get back to you within 24 hours.');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      showError(error.message || 'Failed to send message. Please try again.');
    }
  };

  // Handle success/error states
  useEffect(() => {
    if (contactSubmitted) {
      // Reset the state after showing success
      const timer = setTimeout(() => {
        dispatch(resetContactState());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [contactSubmitted, dispatch]);

  useEffect(() => {
    if (contactError) {
      // Reset error state after 5 seconds
      const timer = setTimeout(() => {
        dispatch(resetContactState());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [contactError, dispatch]);

  // Handler functions for actions
  const handleGetDirections = () => {
    const address = "123 Electronics Plaza, Andheri West, Mumbai 400058, Maharashtra, India";
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const handleCallNow = () => {
    window.open('tel:+919310979906');
  };

  const handleSendEmail = () => {
    window.open('mailto:sarvinhomeappl@gmail.com');
  };

  const handleLiveChat = () => {
    const whatsappNumber = '+919310979906';
    const message = 'Hello! I would like to get assistance with your products and services.';
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${whatsappNumber.replace('+', '')}?text=${encodedMessage}`, '_blank');
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Our Factory',
      details: ['Plot No. 33 Bhankri - Pali Road', 'Behind JAV Forging', 'Faridabad, Haryana - 121001'],
      action: 'Get Directions',
      onClick: handleGetDirections
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+91 93109 79906', 'Customer Support', 'Mon-Sat: 8AM-8PM'],
      action: 'Call Now',
      onClick: handleCallNow
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: ['sarvinhomeappl@gmail.com', 'We reply within 24 hours'],
      action: 'Send Email',
      onClick: handleSendEmail
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      details: ['Available 24/7', 'Instant responses', 'Expert assistance'],
      action: 'Start Chat',
      onClick: handleLiveChat
    }
  ];

  const departments = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'sales', label: 'Sales & Products' },
    { value: 'support', label: 'Technical Support' },
    { value: 'warranty', label: 'Warranty Claims' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
    { value: 'partnership', label: 'Business Partnership' }
  ];

  const faqs = getContactPageFAQs();

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-[#2A4365] to-[#1A365D] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-xl text-gray-200">
              We're here to help you find the perfect appliances for your home. 
              Reach out to our expert team for personalized assistance.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-[#EBF5FF] w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <info.icon className="h-6 w-6 text-[#2A4365]" />
                </div>
                <h3 className="text-lg font-semibold mb-3">{info.title}</h3>
                <div className="space-y-1 mb-4">
                  {info.details.map((detail, idx) => (
                    <p key={idx} className="text-gray-600 text-sm">{detail}</p>
                  ))}
                </div>
                <button 
                  onClick={info.onClick}
                  className="text-[#2A4365] hover:text-[#C87941] font-medium text-sm transition-colors"
                >
                  {info.action}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Send us a Message</h2>
              <p className="text-gray-600 mb-8">
                Have a question or need assistance? Fill out the form below and our team will get back to you within 24 hours.
              </p>

              {contactSubmitted ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">Message Sent!</h3>
                  <p className="text-green-600">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      fullWidth
                      placeholder="Enter your full name"
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      fullWidth
                      placeholder="Enter your email address"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Phone Number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      fullWidth
                      placeholder="Enter your phone number"
                    />
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#2A4365] focus:outline-none focus:ring-1 focus:ring-[#2A4365]"
                      >
                        <option value="">Select a subject</option>
                        {departments.map((dept) => (
                          <option key={dept.value} value={dept.value}>
                            {dept.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      required
                      className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-[#2A4365] focus:outline-none focus:ring-1 focus:ring-[#2A4365]"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>
                  
                  {contactError && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-600 text-sm">
                        {contactError.message || 'An error occurred. Please try again.'}
                      </p>
                    </div>
                  )}
                  
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    leftIcon={<Send className="h-5 w-5" />}
                    isLoading={contactSubmitting}
                    disabled={contactSubmitting}
                    fullWidth
                  >
                    {contactSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              )}
            </div>

            {/* Map & Additional Info */}
            <div>
              <h2 className="text-3xl font-bold mb-6">Visit Our Factory</h2>
              
              {/* Google Maps Embed */}
              <div className="rounded-lg overflow-hidden shadow-md mb-6"> 
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3497.031630850157!2d77.2490059!3d28.3893757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cdbb65aaaaa91%3A0x483a7e0ac5ff8dda!2sSARVATRA%20INDUSTRIES%20(INDIA)%20PRIVATE%20LIMITED!5e0!3m2!1sen!2sin!4v1692277924567!5m2!1sen!2sin"
    width="100%"
    height="300"
    style={{ border: 0 }}
    allowFullScreen=""
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    title="Factory Location - Plot No. 33 Bhankri - Pali Road, Behind JAV Forging, Faridabad, Haryana - 121001"
  ></iframe>
</div>


              {/* Store Hours */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-[#2A4365]" />
                  Store Hours
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Saturday</span>
                    <span className="font-medium">8:00 AM - 8:00 PM</span>
                  </div>
                  {/* <div className="flex justify-between">
                    <span className="text-gray-600">Saturday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div> */}
                </div>
              </div>

              {/* Quick Contact */}
              <div className="bg-[#2A4365] text-white rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Headphones className="h-5 w-5 mr-2" />
                  Need Immediate Help?
                </h3>
                <p className="text-gray-200 mb-4">
                  Our customer support team is available 24/7 to assist you with any questions or concerns.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="flex-1"
                    onClick={handleCallNow}
                  >
                    Call Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 border-white text-white hover:bg-white hover:text-[#2A4365]"
                    onClick={handleLiveChat}
                  >
                    Live Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-gray-600">
                Quick answers to common questions about our products and services
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-4">
                Can't find what you're looking for?
              </p>
              <Button 
                variant="outline"
                onClick={() => setIsFAQModalOpen(true)}
              >
                View All FAQs
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Modal */}
      <FAQModal 
        isOpen={isFAQModalOpen} 
        onClose={() => setIsFAQModalOpen(false)} 
      />

      {/* Support Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-[#2A4365] to-[#1A365D] text-white rounded-2xl p-12">
              <div className="bg-white/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10" />
              </div>
              <h2 className="text-3xl font-bold mb-4">Ready to Connect? We're Here to Help!</h2>
              <p className="text-xl text-gray-200 mb-8">
                Get instant support through WhatsApp or call our dedicated team at +91 93109 79906 . 
                Experience seamless service and expert guidance for all your appliance needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="secondary" 
                  size="lg"
                  onClick={handleLiveChat}
                  leftIcon={<MessageCircle className="h-5 w-5" />}
                >
                  Chat on WhatsApp
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="border-white text-white hover:bg-white hover:text-[#2A4365]"
                  onClick={handleCallNow}
                  leftIcon={<Phone className="h-5 w-5" />}
                >
                  Call +91 93109 79906
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;