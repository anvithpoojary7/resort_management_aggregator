import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaKey } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { TopLoader } from './TopLoader'; // Import TopLoader

const CombinedLoginRegister = () => {
  const [mode, setMode] = useState('login'); // 'login', 'register', or 'verify'
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const navigate = useNavigate();
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) navigate('/', { replace: true });
  }, [user, navigate]);

  const clearForm = () => {
    setFirstName('');
    setLastName('');
    setPassword('');
    setConfirmPassword('');
    setVerificationCode('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Please fill all required fields.');

    setIsLoading(true); // Show loader

    if (mode === 'register') {
      if (!firstName || !lastName || !confirmPassword) return alert('Please fill all registration fields.');
      if (password !== confirmPassword) return alert('Passwords do not match.');
      if (password.length < 6) return alert('Password must be at least 6 characters.');
    }

    const name = `${firstName} ${lastName}`;
    const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload =
      mode === 'login'
        ? { email, password, role: 'user' }
        : { name, email, password, role: 'user' };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (mode === 'login') {
          login(data.user);
          // Keep loader visible for 800ms to show the transition
          setTimeout(() => {
            setIsLoading(false);
            navigate('/', { replace: true });
          }, 800);
        } else {
          setIsLoading(false);
          alert('Registration successful! A verification code has been sent to your email.');
          setMode('verify');
        }
      } else {
        setIsLoading(false);
        alert(data.message || 'Something went wrong');
      }
    } catch (err) {
      setIsLoading(false);
      alert('Error: ' + err.message);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (verificationCode.length !== 6) return alert('Please enter a valid 6-digit code.');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: verificationCode }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsLoading(false);
        alert('Account verified successfully! Please sign in.');
        setMode('login');
        clearForm();
      } else {
        setIsLoading(false);
        alert(data.message || 'Invalid verification code.');
      }
    } catch (err) {
      setIsLoading(false);
      alert('Verification failed: ' + err.message);
    }
  };

  const handleGoogleAuth = async () => {
    // Your Google authentication logic
  };

  return (
    <div className="relative">
      {/* Top Loader */}
      <TopLoader isLoading={isLoading} />

      {/* Optional Fullscreen Spinner */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[2000]">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="min-h-screen bg-[#f6f9ff] flex items-center justify-center px-4">
        <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md relative">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-100 p-4 rounded-full">
              {mode === 'login' && <LogIn className="text-indigo-600 text-2xl" />}
              {mode === 'register' && <FaUser className="text-blue-600 text-2xl" />}
              {mode === 'verify' && <FaKey className="text-green-600 text-2xl" />}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-center mb-1">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'register' && 'Create Account'}
            {mode === 'verify' && 'Verify Your Account'}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-2">
            {mode === 'login' && 'Sign in to your account'}
            {mode === 'register' && 'Join us today'}
            {mode === 'verify' && `A 6-digit code was sent to ${email}`}
          </p>

          {/* Forms */}
          {mode === 'verify' ? (
            <form onSubmit={handleVerify} className="space-y-4 mt-6">
              <input
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                required
                maxLength="6"
                className="w-full px-4 py-2 border rounded text-sm text-center tracking-[0.5em]"
              />
              <button
                type="submit"
                className="w-full py-2 rounded text-white font-semibold text-sm bg-gradient-to-r from-green-500 to-emerald-600 hover:opacity-90"
              >
                Verify Account
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {mode === 'register' && (
                <>
                  <input
                    type="text"
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded text-sm"
                  />
                </>
              )}

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded text-sm"
                disabled={mode === 'verify'}
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded text-sm pr-10"
                />
                <span
                  className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>

              {mode === 'register' && (
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-2 border rounded text-sm pr-10"
                  />
                  <span
                    className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirm(!showConfirm)}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className={`w-full py-2 rounded text-white font-semibold text-sm transition ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {mode === 'login' ? 'Sign in as User' : 'Register as User'}
              </button>
            </form>
          )}

          {/* Toggle Links */}
          {mode !== 'verify' && (
            <>
              <div className="flex items-center my-4">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-400 text-sm">or</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

              <button
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center border py-2 rounded hover:bg-gray-100 transition text-sm"
              >
                <FcGoogle className="text-xl mr-2" />
                Continue with Google
              </button>

              <p className="mt-4 text-center text-sm text-gray-600">
                {mode === 'login' ? 'New here?' : 'Already have an account?'}{' '}
                <button
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {mode === 'login' ? 'Create an account' : 'Sign in here'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CombinedLoginRegister;
