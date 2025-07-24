import React, { useState, useEffect } from 'react';
import { FiEdit, FiX } from 'react-icons/fi';

const ACCENT = '#C97B63';

const ProfileSettings = ({ onClose }) => {
  const [editing, setEditing] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phone: '',
    email: '',
  });

  /* Disable background scroll */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* Fetch user profile from backend */
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('/api/user/profile', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        if (!response.ok) throw new Error('Failed to fetch user data');

        const userData = await response.json();
        const [firstName = '', ...rest] = (userData.name || '').trim().split(' ');
        const lastName = rest.join(' ');

        setFormData({
          firstName,
          lastName,
          address: userData.address || '',
          phone: userData.phone || '',
          email: userData.email || '',
        });

        if (userData.role) setUserRole(userData.role);
      } catch (error) {
        console.error(error);
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
      const response = await fetch('/api/user/update', {
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

      alert('Profile updated successfully');
      setEditing(false);
    } catch (error) {
      console.error(error);
      alert('Error updating profile');
    }
  };

  const handleUpdatePassword = async () => {
    if (!currentPwd || !newPwd) return alert('Fill both password fields');
    if (newPwd.length < 6) return alert('New password must be ≥ 6 chars');
    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ currentPassword: currentPwd, newPassword: newPwd }),
      });
      if (!response.ok) throw new Error('Failed to update password');
      alert('Password updated successfully');
      setCurrentPwd('');
      setNewPwd('');
    } catch (error) {
      console.error(error);
      alert('Error updating password');
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Delete account permanently?')) return;
    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Failed to delete account');
      alert('Account deleted successfully');
      localStorage.removeItem('token');
      window.location.href = '/auth';
    } catch (error) {
      console.error(error);
      alert('Error deleting account');
    }
  };

  const hasAddress = formData.address.trim().length > 0;
  const userInitial = formData.firstName ? formData.firstName[0].toUpperCase() : 'U';

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
        <p className="text-white">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/60 backdrop-blur-lg rounded-2xl shadow-2xl text-white px-6 py-8 grid gap-8">
        {/* close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-gray-200"
        >
          <FiX size={24} />
        </button>

        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">
              Welcome, {formData.firstName || 'Guest'}
            </h1>
            <p className="text-sm text-gray-300 capitalize">
              Role: {userRole || 'User'}
            </p>
          </div>
          {/* Circle Avatar */}
          <div className="flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg"
            style={{ backgroundColor: ACCENT }}>
            {userInitial}
          </div>
        </div>

        {/* user info */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold"
              style={{ backgroundColor: ACCENT }}>
              {userInitial}
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight break-all">
                {formData.firstName} {formData.lastName}
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

        {/* details grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* --- Name (read-only) --- */}
          <div className="flex flex-col gap-1">
            <label className="text-gray-300">First Name</label>
            <div className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white opacity-60 select-none cursor-not-allowed">
              {formData.firstName || '—'}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-gray-300">Last Name</label>
            <div className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white opacity-60 select-none cursor-not-allowed">
              {formData.lastName || '—'}
            </div>
          </div>

          {/* --- Address --- */}
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
            ) : hasAddress ? (
              <div className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white break-words">
                {formData.address}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setEditing(true)}
                className="text-sm text-left underline"
                style={{ color: ACCENT }}
              >
                + Add Address
              </button>
            )}
          </div>

          {/* --- Phone --- */}
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

        {/* Email Info */}
        <div className="mt-6 space-y-2">
          <label className="text-gray-300 block text-sm">My email address</label>
          <div className="flex items-center gap-2 text-white">
            <div
              className="w-3 h-3"
              style={{ backgroundColor: ACCENT, borderRadius: '9999px' }}
            ></div>
            <span className="text-sm break-all">{formData.email}</span>
            <span className="text-xs text-gray-400">1 month ago</span>
          </div>
        </div>

        {/* Change Password */}
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

        {/* Danger Zone */}
        <section className="space-y-4 border-t border-white/10 pt-6">
          <h3 className="text-lg font-semibold">Danger Zone</h3>
          <p className="text-gray-400 text-sm">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-xl text-white"
            style={{ backgroundColor: ACCENT }}
          >
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
};

export default ProfileSettings;
