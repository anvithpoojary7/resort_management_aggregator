import React, { useState, useEffect } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiEdit, FiX } from 'react-icons/fi';

/**
 * ProfileSettings – scroll‑free modal
 * Dark translucent theme, warm terracotta accents (#C97B63)
 * Fields: first / last name, address, language
 * Password change requires current + new password
 */
const ACCENT = '#C97B63';

const ProfileSettings = ({ onClose }) => {
  const [editing, setEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [avatarModal, setAvatarModal] = useState(false);
  const [currentPwd, setCurrentPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [userRole, setUserRole] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    language: '',
    email: '',
  });

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user'));
    if (!stored) return;

    const [firstName = '', ...rest] = (stored.name || '').trim().split(' ');
    setFormData({
      firstName,
      lastName: rest.join(' '),
      address: stored.address || '',
      language: stored.language || '',
      email: stored.email || '',
    });

    if (stored.profileImage) setImageUrl(stored.profileImage);
    if (stored.role) setUserRole(stored.role);
  }, []);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file?.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageUrl(reader.result);
      setAvatarModal(false);
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = () => {
    const stored = JSON.parse(localStorage.getItem('user')) || {};
    const updated = {
      ...stored,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      address: formData.address,
      language: formData.language,
      profileImage: imageUrl,
    };
    localStorage.setItem('user', JSON.stringify(updated));
    setEditing(false);
  };

  const handleUpdatePassword = () => {
    if (!currentPwd || !newPwd) return alert('Fill both password fields');
    if (newPwd.length < 6) return alert('New password must be ≥ 6 chars');
    alert('Password updated (demo)');
    setCurrentPwd('');
    setNewPwd('');
  };

  const handleDeleteAccount = () => {
    if (!window.confirm('Delete account permanently?')) return;
    localStorage.removeItem('user');
    alert('Account deleted (demo)');
    window.location.href = '/auth';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 md:p-6 overflow-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-black/60 backdrop-blur-lg rounded-2xl shadow-2xl text-white px-6 py-8 grid gap-8">
        <button onClick={onClose} className="absolute top-4 right-4 text-white hover:text-gray-200">
          <FiX size={24} />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Welcome, {formData.firstName || 'Guest'}</h1>
            <p className="text-sm text-gray-300 capitalize">Role: {userRole || 'N/A'}</p>
          </div>
          <FaUserCircle className="text-4xl text-white/70" />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={imageUrl || '/default-avatar.jpg'}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover cursor-pointer hover:opacity-80"
              onClick={() => setAvatarModal(true)}
            />
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {['firstName', 'lastName', 'address'].map((field) => (
            <div key={field} className="flex flex-col gap-1">
              <label className="text-gray-300 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              <input
                name={field}
                disabled={!editing}
                value={formData[field]}
                onChange={handleChange}
                placeholder={field}
                className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-gray-400 disabled:opacity-60" />
            </div>
          ))}

          <div className="flex flex-col gap-1">
            <label className="text-gray-300">Language</label>
            <select
              name="language"
              disabled={!editing}
              value={formData.language}
              onChange={handleChange}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white disabled:opacity-60"
            >
              <option value="">Select</option>
              <option value="english">English</option>
              <option value="hindi">Hindi</option>
              <option value="kannada">Kannada</option>
            </select>
          </div>
        </div>
        {/* Email Info */}
       <div className="mt-6 space-y-2">
          <label className="text-gray-300 block text-sm">My email address</label>
          <div className="flex items-center gap-2 text-white">
            <div className="w-3 h-3" style={{ backgroundColor: '#C97B63', borderRadius: '9999px' }}></div>
            <span className="text-sm break-all">{formData.email}</span>
            <span className="text-xs text-gray-400">1 month ago</span>
          </div>
          <button className="text-sm hover:underline" style={{ color: '#C97B63' }}>+ Add Email Address</button>
        </div>

        <section className="space-y-4">
          <h3 className="text-lg font-semibold">Change Password</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="Current password"
              value={currentPwd}
              onChange={(e) => setCurrentPwd(e.target.value)}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-gray-400" />
            <input
              type="password"
              placeholder="New password"
              value={newPwd}
              onChange={(e) => setNewPwd(e.target.value)}
              className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-white placeholder:text-gray-400" />
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
          <h3 className="text-lg font-semibold">Danger Zone</h3>
          <p className="text-gray-400 text-sm">Deleting your account is permanent and cannot be undone.</p>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 rounded-xl text-white"
            style={{ backgroundColor: ACCENT }}
          >
            Delete Account
          </button>
        </section>
      </div>

      {avatarModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="relative w-full max-w-sm bg-black/90 backdrop-blur-md rounded-2xl p-6 text-white">
            <button
              onClick={() => setAvatarModal(false)}
              className="absolute top-2 right-2 text-gray-300 hover:text-white"
            >
              <FiX size={20} />
            </button>
            <img src={imageUrl || '/default-avatar.jpg'} alt="Large Avatar" className="w-full h-64 object-cover rounded-xl mb-4" />
            <div className="flex justify-between">
              <label className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                Change Photo
                <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
              </label>
              <button
                onClick={() => { setImageUrl(''); setAvatarModal(false); }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
