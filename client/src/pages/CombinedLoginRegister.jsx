import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase'; 

const CombinedLoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true); // toggle between login and register

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      alert('Logging in...');
    } else {
      alert('Registering...');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User info:', user);
      alert(`Logged in as ${user.displayName}`);
    } catch (error) {
      console.error('Google Auth Error:', error);
      alert('Google authentication failed!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <div className="flex items-center justify-center mb-4 text-blue-600">
          <FaUser className="text-3xl mr-2" />
          <h2 className="text-2xl font-bold">{isLogin ? 'Login' : 'Register'}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              required
              className="w-full px-4 py-2 border rounded"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {/* Google Auth Button */}
        <button
          onClick={handleGoogleAuth}
          className="mt-4 w-full flex items-center justify-center border py-2 rounded hover:bg-gray-100 transition"
        >
          <FcGoogle className="text-xl mr-2" />
          Continue with Google
        </button>

        <div className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? (
            <>
              New here?{' '}
              <button onClick={() => setIsLogin(false)} className="text-blue-600 hover:underline">
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button onClick={() => setIsLogin(true)} className="text-blue-600 hover:underline">
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinedLoginRegister;
