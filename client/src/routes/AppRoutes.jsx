import React from 'react';
import { Routes, Route } from 'react-router-dom';

// ✅ Public / User Pages
import Home from '../pages/Home';
import ResortList from '../pages/ResortList';

import CombinedLoginRegister from '../pages/CombinedLoginRegister';
import Settings from '../pages/Settings';
import ContactUs from '../pages/ContactUs';
import HelpSupport from '../pages/HelpSupport';

// ✅ Owner Pages
import OwnerDashboard from '../owner/OwnerDashboard';
import OwnerMyResort from '../owner/OwnerMyResort';
import OwnerBookings from '../owner/OwnerBookings';
import OwnerProfile from '../owner/OwnerProfile';

// ✅ Admin Pages
import AdminDashboard from '../admin/pages/AdminDashboard';
import ModerationPage from '../admin/pages/ModerationPage'; // ✅ Replaces ManageResorts
import ViewUsers from '../admin/pages/ViewUsers';
import AllBookings from '../admin/pages/AllBookings';
import AdminAddResort from '../admin/pages/AddResort';

// ✅ Route Protection Component
import ProtectedRoute from './ProtectedRoute';
import RevenueAnalytics from '../admin/pages/RevenueAnalytics';

const AppRoutes = () => (
  <Routes>

    {/* ✅ Public / User Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/resorts" element={<ResortList />} />
  
    <Route path="/auth" element={<CombinedLoginRegister />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/help" element={<HelpSupport />} />

    {/* ✅ Owner Routes */}
    <Route path="/owner/dashboard" element={
      <ProtectedRoute role="owner">
        <OwnerDashboard />
      </ProtectedRoute>
    } />
    <Route path="/owner/my-resort" element={
      <ProtectedRoute role="owner">
        <OwnerMyResort />
      </ProtectedRoute>
    } />
    <Route path="/owner/bookings" element={
      <ProtectedRoute role="owner">
        <OwnerBookings />
      </ProtectedRoute>
    } />
    <Route path="/owner/profile" element={
      <ProtectedRoute role="owner">
        <OwnerProfile />
      </ProtectedRoute>
    } />

    {/* ✅ Admin Routes */}
    <Route path="/admin/dashboard" element={
      <ProtectedRoute role="admin">
        <AdminDashboard />
      </ProtectedRoute>
    } />
    <Route path="/admin/resorts" element={
      <ProtectedRoute role="admin">
        <ModerationPage />
      </ProtectedRoute>
    } />
    <Route path="/admin/users" element={
      <ProtectedRoute role="admin">
        <ViewUsers />
      </ProtectedRoute>
    } />
    <Route path="/admin/bookings" element={
      <ProtectedRoute role="admin">
        <AllBookings />
      </ProtectedRoute>
    } />
    <Route path="/admin/analytics" element={
      <ProtectedRoute role="admin">
        <RevenueAnalytics  />
      </ProtectedRoute>
    } />

    {/* ⚠️ Optional: Fallback Route for 404 */}
    {/* <Route path="*" element={<NotFound />} /> */}

  </Routes>
);

export default AppRoutes;

