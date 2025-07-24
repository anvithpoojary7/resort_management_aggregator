// src/components/LoginAndPasswordInfo.jsx
import React from 'react';
import { FiX } from 'react-icons/fi';
import { motion } from 'framer-motion';

const LoginAndPasswordInfo = ({ onClose }) => {
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

        <h2 className="text-2xl font-semibold text-[#C07763] mb-6">Login & Password</h2>

        <div className="space-y-5 text-sm leading-relaxed">
          <p>
            <strong className="text-white">Having trouble logging in?</strong><br />
            <span className="text-gray-300">
              Double-check that your email and password are entered correctly. If you forgot your password,
              click “Forgot Password” on the login screen to reset it.
            </span>
          </p>
          <p>
            <strong className="text-white">Resetting your password:</strong><br />
            <span className="text-gray-300">
              You’ll receive an email with instructions to securely reset your password. Make sure to check
              your spam or promotions folder if you don’t see it.
            </span>
          </p>
          <p>
            <strong className="text-white">Creating a strong password:</strong><br />
            <span className="text-gray-300">
              We recommend using at least 8 characters, with a mix of uppercase, lowercase, numbers, and symbols.
            </span>
          </p>
          <p>
            <strong className="text-white">Changing your password:</strong><br />
            <span className="text-gray-300">
              Go to your Profile → Security → Change Password to update it at any time.
            </span>
          </p>
          <p>
            <strong className="text-white">Security tip:</strong><br />
            <span className="text-gray-300">
              Avoid reusing passwords from other sites and never share your login credentials with anyone.
            </span>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginAndPasswordInfo;
