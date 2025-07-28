import React, { useState, useEffect } from 'react';
import { FiEdit, FiX } from 'react-icons/fi';


const ACCENT = '#C97B63';

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://resort-finder-2aqp.onrender.com'
  : 'http://localhost:8080';

// A simple modal for showing messages instead of alert()
const MessageModal = ({ message, onClose }) => (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
    <div className="bg-gray-800 rounded-lg p-6 text-white text-center">
      <p className="mb-4">{message}</p>
      <button
        onClick={onClose}
        className="px-4 py-2 rounded-lg text-white"
        style={{ backgroundColor: ACCENT }}
      >
        Close
      </button>
    </div>
  </div>
);

const ProfileSettings = ({ onClose }) => {
  const [editing, setEditing] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null); // For custom modal messages

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });

  // Effect to lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  // Effect to fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error("No authorization token found.");

        // CORRECTED: Using the full API_URL
        const response = await fetch(`${API_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch user data');
        }

        const userData = await response.json();
        setFormData({
          name: userData.name || '',
          address: userData.address || '',
          phone: userData.phone || '',
          email: userData.email || '',
        });

        if (userData.role) setUserRole(userData.role);
      } catch (error) {
        console.error("Fetch user data error:", error);
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) =>
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const saveProfile = async () => {
    try {
      // CORRECTED: Using the full API_URL
      const response = await fetch(`${API_URL}/api/user/update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          address: formData.address,
          phone: formData.phone,
        }),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      setMessage('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error(error);
      setMessage('Error updating profile');
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPwd || !newPwd) return setMessage('Fill both password fields');
    if (newPwd.length < 6) return setMessage('New password must be at least 6 characters');
    try {
      // CORRECTED: Using the full API_URL
      const response = await fetch(`${API_URL}/api/user/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      if (!response.ok) throw new Error('Failed to update password. Check current password.');
      setMessage('Password updated successfully');
      setCurrentPwd('');
      setNewPwd('');
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  const handleDeleteAccount = async () => {
    // Using custom modal instead of window.confirm
    const confirmed = await new Promise(resolve => {
        setMessage({
            text: 'Delete account permanently? This cannot be undone.',
            onConfirm: () => resolve(true),
            onCancel: () => resolve(false)
        });
    });

    if (!confirmed) {
        setMessage(null); // Close confirmation modal
        return;
    }

    try {
      // CORRECTED: Using the full API_URL
      const response = await fetch(`${API_URL}/api/user/delete`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to delete account');
      setMessage('Account deleted successfully');
      localStorage.removeItem('token');
      // Redirect after a short delay to allow user to see the message
      setTimeout(() => window.location.href = '/auth', 2000);
    } catch (error) {
      console.error(error);
      setMessage('Error deleting account');
    }
  };

  const userInitial = formData.name ? formData.name.charAt(0).toUpperCase() : 'U';

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }
  
  // Custom Confirmation Modal
    const ConfirmationModal = ({ message, onConfirm, onCancel }) => (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-6 text-white text-center shadow-xl">
                <p className="mb-4">{message}</p>
                <div className="flex justify-center gap-4">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500">
                        Cancel
                    </button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-white" style={{ backgroundColor: 'red' }}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );


  return (
    <>
      {/* This section handles the display of all messages and confirmations */}
      {message && typeof message === 'string' && (
        <MessageModal message={message} onClose={() => setMessage(null)} />
      )}
      {message && typeof message === 'object' && message.onConfirm && (
        <ConfirmationModal 
            message={message.text} 
            onConfirm={message.onConfirm}
            onCancel={message.onCancel}
        />
      )}

      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-auto">
        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/60 backdrop-blur-lg rounded-2xl shadow-2xl text-white px-6 py-8 grid gap-8">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200"
          >
            <FiX size={24} />
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold">
                Welcome, {formData.name || 'Guest'}
              </h1>
            
            </div>
            <div className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg"
              style={{ backgroundColor: ACCENT }}>
              {userInitial}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
                style={{ backgroundColor: ACCENT }}>
                {userInitial}
              </div>
              <div>
                <h2 className="text-xl font-bold leading-tight break-all">
                  {formData.name}
                </h2>
                <p className="text-gray-300 text-sm break-all">{formData.email}</p>
              </div>
            </div>
            <button
              onClick={editing ? saveProfile : () => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-white"
              style={{ backgroundColor: ACCENT }}
            >
              <FiEdit /> {editing ? 'Save' : 'Edit'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name (readonly) */}
            <div className="flex flex-col gap-1">
              <label className="text-gray-300">Name</label>
              <div className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white opacity-60 select-none cursor-not-allowed">
                {formData.name || '—'}
              </div>
            </div>

          
            <div className="flex flex-col gap-1">
              <label className="text-gray-300">Address</label>
              {editing ? (
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Add address"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-gray-400"
                />
              ) : (
                <div className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white break-words">
                  {formData.address || '—'}
                </div>
              )}
            </div>

          
            <div className="flex flex-col gap-1">
              <label className="text-gray-300">Phone</label>
              {editing ? (
                <input
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-gray-400"
                />
              ) : (
                <div className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white break-words">
                  {formData.phone || '—'}
                </div>
              )}
            </div>
          </div>

      
          <div className="mt-6 space-y-2">
            <label className="text-gray-300 block text-sm">My email address</label>
            <div className="flex items-center gap-2 text-white">
              <div className="w-3 h-3"
                style={{ backgroundColor: ACCENT, borderRadius: '9999px' }}
              ></div>
              <span className="text-sm break-all">{formData.email}</span>
            </div>
          </div>

        
          <section className="space-y-4">
            <h3 className="text-lg font-semibold">Change Password</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                placeholder="Current password"
                value={currentPwd}
                onChange={(e) => setCurrentPwd(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-gray-400"
              />
              <input
                type="password"
                placeholder="New password"
                value={newPwd}
                onChange={(e) => setNewPwd(e.target.value)}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-gray-400"
              />
            </div>
            <button
              onClick={handleUpdatePassword}
              className="px-4 py-2 rounded-xl text-white"
              style={{ backgroundColor: ACCENT }}
            >
              Update Password
            </button>
          </section>

        
          <section className="space-y-4 border-t border-white/10 pt-6">
            <h3 className="text-lg font-semibold text-red-400">Danger Zone</h3>
            <p className="text-gray-400 text-sm">
              Deleting your account is permanent and cannot be undone.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 rounded-xl text-white bg-red-600 hover:bg-red-700"
            >
              Delete Account
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

export default ProfileSettings;
