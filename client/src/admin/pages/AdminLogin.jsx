import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const ADMIN_PASS_KEY = process.env.REACT_APP_ADMIN_PASSKEY || '';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminKey, setAdminKey] = useState(ADMIN_PASS_KEY);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const role = 'admin';

  // ✅ Redirect to dashboard if already logged in as admin
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const user = JSON.parse(localStorage.getItem('user'));
    if (isLoggedIn && user?.role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  // ✅ Prevent going back to login page if already logged in
  useEffect(() => {
    // Push current state once to start history
    window.history.pushState(null, '', window.location.href);
    const preventBack = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', preventBack);
    return () => window.removeEventListener('popstate', preventBack);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !adminKey) {
      alert('Email, password, and admin key are required.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/admin/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, adminKey, role }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store login state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        // ✅ Push a new history entry and lock navigation in AdminDashboard
        navigate('/admin/dashboard', { replace: true });
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Login error: ' + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f9ff] flex items-center justify-center px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md">
        {/* icon */}
        <div className="flex justify-center mb-4">
          <div className="bg-blue-100 p-4 rounded-full">
            <LogIn className="text-indigo-600 text-2xl" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-center mb-2">Admin Login</h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          You must supply the <span className="font-medium text-blue-700">Admin Pass Key</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin email"
            className="w-full px-4 py-2 border rounded text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded text-sm pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? '🙈' : '👁️'}
            </span>
          </div>

          <input
            type="text"
            placeholder="Admin Pass Key"
            className="w-full px-4 py-2 border rounded text-sm"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
          />

          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition"
          >
            Sign in as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
