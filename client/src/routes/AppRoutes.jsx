import React from 'react';
import { Routes, Route } from 'react-router-dom';

// User Pages
import Home from '../pages/Home';
import ResortList from '../pages/ResortList';
import ResortDetail from '../pages/ResortDetail';
import CombinedLoginRegister from '../pages/CombinedLoginRegister';
import Settings from '../pages/Settings';
import ContactUs from '../pages/ContactUs';
import HelpSupport from '../pages/HelpSupport';

// Owner Pages
import OwnerDashboard from '../owner/OwnerDashboard';
import AddResort from '../owner/AddResort';
import OwnerBookings from '../owner/OwnerBookings';

// Admin Pages
import AdminDashboard from '../admin/AdminDashboard';
import ManageResorts from '../admin/ManageResorts';
import ViewUsers from '../admin/ViewUsers';
import AllBookings from '../admin/AllBookings';

// Route Protection
import ProtectedRoute from './ProtectedRoute';

const AppRoutes = () => (
  <Routes>

    {/* ✅ Public / User Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/resorts" element={<ResortList />} />
    <Route path="/resorts/:id" element={<ResortDetail />} />
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
    <Route path="/owner/add-resort" element={
      <ProtectedRoute role="owner">
        <AddResort />
      </ProtectedRoute>
    } />
    <Route path="/owner/bookings" element={
      <ProtectedRoute role="owner">
        <OwnerBookings />
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
        <ManageResorts />
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

    {/* ⚠️ Optional: Fallback route for 404 */}
    {/* <Route path="*" element={<NotFound />} /> */}

  </Routes>
);

export default AppRoutes;