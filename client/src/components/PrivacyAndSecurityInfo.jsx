// src/components/PrivacyAndSecurityInfo.jsx
import React from 'react';
import { FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const PrivacyAndSecurityInfo = ({ onClose }) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-[#1c1c1c] text-white rounded-2xl shadow-2xl max-w-xl w-full p-6 relative"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-red-500 transition"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-[#C07763] mb-6">Privacy & Security</h2>

        <div className="space-y-5 text-sm leading-relaxed">
          <p>
            <strong className="text-white">What data do we collect?</strong><br />
            <span className="text-gray-300">
              We collect basic information like name, email, and preferences to improve your booking experience.
            </span>
          </p>
          <p>
            <strong className="text-white">How is your data protected?</strong><br />
            <span className="text-gray-300">
              We use secure encryption and access control measures to protect your data. Your passwords are never stored in plain text.
            </span>
          </p>
          <p>
            <strong className="text-white">Can you delete your account?</strong><br />
            <span className="text-gray-300">
              Yes, you may request account deletion through Settings. All associated data will be erased permanently within 7 days.
            </span>
          </p>
          <p>
            <strong className="text-white">Third-party sharing?</strong><br />
            <span className="text-gray-300">
              We do not share your personal data with any third-party without your explicit consent.
            </span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PrivacyAndSecurityInfo;
