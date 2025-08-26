export const faqData = [
   {
        id: 1,
        question: 'What is your return policy?',
        answer: 'We offer a 30-day return policy for all products in original condition with packaging. Items must be unused and include all original accessories and documentation. Custom orders and personalized items are not eligible for return.'
      },
      {
        id: 2,
        question: 'Do you provide installation services?',
        answer: 'Yes, we provide free professional installation for most appliances within 48 hours of delivery. Our certified technicians ensure proper setup and provide a brief tutorial on product usage. Installation is included for refrigerators, washing machines, air conditioners, and other major appliances.'
      },
      {
        id: 3,
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit/debit cards (Visa, MasterCard, American Express), UPI payments, net banking, and cash on delivery. We also offer EMI options for purchases above ₹10,000 with 0% interest for up to 12 months on select products.'
      },
      {
        id: 4,
        question: 'How long is the warranty period?',
        answer: 'Warranty periods vary by product and type, ranging from 1 to 10 years. Most appliances come with manufacturer warranty plus extended warranty options. Check individual product pages for specific warranty details. We also provide service support even after warranty expires.'
      },
      {
        id: 5,
        question: 'What are your delivery charges and timelines?',
        answer: 'Free delivery within Mumbai for orders above ₹5,000. For orders below ₹5,000, delivery charges are ₹200. Standard delivery takes 2-3 business days, while express delivery (next day) is available for ₹500 extra. We deliver Monday to Saturday, 9 AM to 7 PM.'
      },
      {
        id: 6,
        question: 'Do you offer annual maintenance contracts?',
        answer: 'Yes, we offer comprehensive Annual Maintenance Contracts (AMC) for all major appliances. Our AMC includes regular servicing, priority support, discounted spare parts, and 24/7 customer service. Plans start from ₹2,000 per year per appliance.'
      },
      {
        id: 7,
        question: 'Can I exchange my old appliance?',
        answer: 'Yes, we have an exchange program for most appliances. Our team will evaluate your old appliance and provide an exchange value that can be deducted from your new purchase. The exchange value depends on the condition, age, and model of your old appliance.'
      },
      {
        id: 8,
        question: 'What does the warranty cover?',
        answer: 'Our warranty covers manufacturing defects, component failures, and electrical issues. It includes free repair or replacement of defective parts and labor charges. Warranty does not cover damage due to misuse, accidents, or normal wear and tear.'
      },
      {
        id: 9,
        question: 'Do you offer financing options?',
        answer: 'Yes, we partner with leading financial institutions to offer easy EMI options. You can choose from 3, 6, 12, 18, or 24-month EMI plans. We also offer 0% interest EMI on select products during promotional periods. Credit approval is subject to bank terms.'
      },
      {
        id: 10,
        question: 'Do you deliver to remote locations?',
        answer: 'We deliver to most locations within Maharashtra. For remote areas, additional delivery charges may apply, and delivery time may be extended to 5-7 business days. Please check with our customer service team for specific location availability and charges.'
      },
      {
        id: 11,
        question: 'What if my appliance needs repair after warranty?',
        answer: 'We provide post-warranty repair services through our authorized service centers. Our skilled technicians use genuine spare parts and offer competitive pricing. We also provide a 3-month warranty on all repair work performed by our service team.'
      },
      {
        id: 12,
        question: 'How can I track my order?',
        answer: 'You can track your order using the tracking number provided via SMS and email. Visit our website and enter your order number in the tracking section, or call our customer service team. You will receive updates at every stage of the delivery process.'
      },
      {
        id: 13,
        question: 'Do you offer bulk discounts for corporate purchases?',
        answer: 'Yes, we offer special pricing for bulk orders and corporate purchases. Contact our sales team with your requirements, and we will provide a customized quote with volume discounts and flexible payment terms.'
      },
      {
        id: 14,
        question: 'Can I schedule a demo before purchasing?',
        answer: 'Absolutely! We offer free product demonstrations at our showroom. You can also request a home demonstration for select products. Our experts will showcase the features and help you make an informed decision.'
      },
      {
        id: 15,
        question: 'What is your price matching policy?',
        answer: 'We offer competitive pricing and will match legitimate competitor prices for identical products. The competitor must be an authorized dealer, and the product must be in stock. Terms and conditions apply.'
      }
];


export const getContactPageFAQs = () => {
  return faqData.slice(0, 4);
};
