import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

const CombinedLoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = isLogin
      ? 'http://localhost:5000/api/auth/login'
      : 'http://localhost:5000/api/auth/register';

    const payload = isLogin
      ? { email, password }
      : { name: fullName, email, password };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          isLogin
            ? `Welcome back, ${data.user.email}!`
            : `Registered as ${data.user.email}`
        );
        console.log('User info:', data.user);
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Auth Error:', error);
      alert('Error: ' + error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch('http://localhost:5000/api/auth/google-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Google login successful as ${data.user.email}`);
        console.log('User info:', data.user);
      } else {
        alert(data.message || 'Google login failed');
      }
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
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 border rounded"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

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
