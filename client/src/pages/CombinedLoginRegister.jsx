import React, { useState } from 'react';
import { FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, provider } from '../firebase';

const CombinedLoginRegister = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // LOGIN FLOW
        const result = await signInWithEmailAndPassword(auth, email, password);
        const token = await result.user.getIdToken();
        alert(`Logged in as ${result.user.email}`);
        console.log('Firebase Token:', token);
      } else {
        // REGISTER FLOW
        const result = await createUserWithEmailAndPassword(auth, email, password);
        const token = await result.user.getIdToken();

        const response = await fetch('http://localhost:5000/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // If your backend is checking Firebase token, include this:
            // Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: fullName,
            email: email,
            password: password, // this will be hashed by backend
          }),
        });

        const data = await response.json();
        if (response.ok) {
          alert('User registered and saved to DB successfully!');
        } else {
          alert(data.message || 'Error saving user to DB');
        }
      }
    } catch (error) {
      console.error('Auth Error:', error);
      alert(error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      alert(`Logged in as ${user.displayName}`);
      console.log('Google user info:', user);
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
