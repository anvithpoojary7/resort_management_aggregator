import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../firebase';

const CombinedLoginRegister = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [role, setRole] = useState('user');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const redirectToDashboard = (role) => {
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'owner') navigate('/owner/dashboard');
    else navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert('Please fill all required fields.');
      return;
    }

    if (!isLogin) {
      if (!firstName || !lastName || !confirmPassword) {
        alert('Please fill all registration fields.');
        return;
      }

      if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
      }

      if (password.length < 6) {
        alert('Password must be at least 6 characters.');
        return;
      }
    }

    const name = `${firstName} ${lastName}`;
    const endpoint = isLogin
      ? 'http://localhost:8080/api/auth/login'
      : 'http://localhost:8080/api/auth/register';

    const payload = isLogin
      ? { email, password, role }
      : { name, email, password, role };

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('user', JSON.stringify(data.user));
          redirectToDashboard(data.user.role);
        } else {
          alert('Registration successful! Please login.');
          setIsLogin(true); // Switch to login form
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
          setConfirmPassword('');
        }
      } else {
        alert(data.message || 'Something went wrong');
      }
    } catch (error) {
      alert('Error: ' + error.message);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await fetch('http://localhost:8080/api/auth/google-login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.displayName,
          email: user.email,
          role,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('user', JSON.stringify(data.user));
        redirectToDashboard(data.user.role);
      } else {
        alert(data.message || 'Google login failed');
      }
    } catch (error) {
      alert('Google authentication failed!');
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9ff] flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md relative">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            {isLogin ? (
              <LogIn className="text-indigo-600 text-2xl" />
            ) : (
              <FaUser className="text-blue-600 text-2xl" />
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-1">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-center text-sm text-gray-500 mb-2">
          {isLogin ? 'Sign in to your account' : 'Join us today'}
        </p>
        <p className="text-sm text-center text-gray-600 mb-4">
          You are signing in as: <span className="text-blue-700 font-medium">{role}</span>
        </p>

        <div className="mb-4">
          <label className="text-sm text-gray-600">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full mt-1 px-3 py-2 border rounded text-sm focus:outline-none"
          >
            <option value="user">User - Standard user access</option>
            <option value="admin">Admin - Manage users & data</option>
            <option value="owner">Owner - Platform owner access</option>
          </select>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
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

          {!isLogin && (
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

          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-blue-600 text-sm hover:underline">
                Forgot Password?
              </a>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-2 rounded text-white font-semibold text-sm transition ${
              isLogin
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {isLogin
              ? `Sign in as ${role.charAt(0).toUpperCase() + role.slice(1)}`
              : `Register as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">or continue with</span>
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
          {isLogin ? 'New here?' : 'Already have an account?'}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? 'Create an account' : 'Sign in here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default CombinedLoginRegister;