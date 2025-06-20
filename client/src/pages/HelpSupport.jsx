import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const HelpSupport = () => {
  const faqs = [
    {
      question: "How can I book a resort?",
      answer: "Go to the resort listing page, click on 'View Details' and choose your preferred dates."
    },
    {
      question: "Can I cancel my booking?",
      answer: "Yes, you can cancel from your dashboard before 24 hours of the check-in date."
    },
    {
      question: "Is there customer support?",
      answer: "Yes, contact us at support@resortbooking.com or call +91-9876543210."
    }
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-semibold mb-6 text-center">Help & Support</h1>
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="border-b pb-2">
            <button
              onClick={() => toggleFAQ(idx)}
              className="w-full text-left text-lg font-medium text-blue-700"
            >
              {faq.question}
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-gray-600 overflow-hidden mt-2"
                >
                  {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpSupport;
