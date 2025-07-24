import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserEdit, FaKey, FaLock } from 'react-icons/fa';
import { FiX } from 'react-icons/fi';

import ProfileSettings from '../components/ProfileSettings';
import LoginAndPasswordInfo from '../components/LoginAndPasswordInfo';
import PrivacyAndSecurityInfo from '../components/PrivacyAndSecurityInfo';

const HelpSupport = () => {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(null);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const topics = [
    {
      icon: <FaUserEdit size={32} className="text-pink-500" />,
      title: 'Account settings',
      description: 'Adjust settings, manage notifications, learn about name changes and more.',
      onClick: () => setShowProfileSettings(true),
    },
    {
      icon: <FaKey size={32} className="text-gray-700" />,
      title: 'Login and password',
      description: 'Fix login issues and learn how to change or reset your password.',
      onClick: () => setShowLoginModal(true),
    },
    {
      icon: <FaLock size={32} className="text-gray-800" />,
      title: 'Privacy and security',
      description: 'Control who can see what you share and add extra protection to your account.',
      onClick: () => setShowPrivacyModal(true),
    },
  ];

  const faqs = [
    {
      question: 'How can I book a resort?',
      answer: "Go to the resort listing page, click on 'View Details' and choose your preferred dates.",
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel from your dashboard before 24 hours of the check-in date.',
    },
    {
      question: 'Is there customer support?',
      answer: 'Yes, contact us at support@resortbooking.com or call +91-9876543210.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">How can we help you?</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search help articles..."
        className="w-full p-3 rounded-lg border border-gray-300 shadow-sm mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Login Help Highlight */}
      <div className="bg-blue-100 flex flex-col md:flex-row justify-between items-start md:items-center p-4 rounded-lg mb-10">
        <div>
          <h2 className="font-medium text-blue-800 text-lg">Need help with logging in?</h2>
          <p className="text-sm text-blue-700">
            Learn what to do if you're having trouble with getting back on the platform.
          </p>
        </div>
        <button
          className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          onClick={() => setShowLoginModal(true)}
        >
          Get Help
        </button>
      </div>

      {/* Popular Topics */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12">
        {topics.map((topic, idx) => (
          <div
            key={idx}
            className="bg-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition h-full cursor-pointer"
            onClick={topic.onClick}
          >
            {topic.icon}
            <h3 className="text-lg font-semibold mt-3">{topic.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-center">Frequently Asked Questions</h2>
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

      {/* Privacy Modal */}
      <AnimatePresence>
        {showPrivacyModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1c1c1c] text-white rounded-2xl shadow-xl max-w-xl w-full p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="absolute top-3 right-3 text-white hover:text-red-500"
              >
                <FiX size={24} />
              </button>
              <PrivacyAndSecurityInfo onClose={() => setShowPrivacyModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#1c1c1c] text-white rounded-2xl shadow-xl max-w-xl w-full p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => setShowLoginModal(false)}
                className="absolute top-3 right-3 text-white hover:text-red-500"
              >
                <FiX size={24} />
              </button>
              <LoginAndPasswordInfo onClose={() => setShowLoginModal(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Settings (shown like modal) */}
      <AnimatePresence>
        {showProfileSettings && (
          <motion.div
            className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white text-black rounded-2xl shadow-xl max-w-xl w-full p-6 relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <button
                onClick={() => setShowProfileSettings(false)}
                className="absolute top-3 right-3 text-gray-600 hover:text-red-500"
              >
                <FiX size={24} />
              </button>
              <ProfileSettings onClose={() => setShowProfileSettings(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HelpSupport;
