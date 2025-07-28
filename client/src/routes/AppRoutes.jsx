import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Public / User Pages
import Home from '../pages/Home';
import ResortList from '../pages/ResortList';
import ResortDetail from '../pages/ResortDetail';
import ReservationForm from '../pages/ReservationForm';
import CombinedLoginRegister from '../pages/CombinedLoginRegister';
import Settings from '../pages/Settings';
import ContactUs from '../pages/ContactUs';
import HelpSupport from '../pages/HelpSupport';
import DealDetails from '../components/DealDetails'; 
import AmenityResortsList from '../pages/AmenityResortsList'; 
import About from '../pages/About';
import Notifications from '../pages/Notifications';


//  Admin Pages
import AdminLogin from '../admin/pages/AdminLogin';
import AdminDashboard from '../admin/pages/AdminDashboard';
import ModerationPage from '../admin/pages/ModerationPage';
import ViewUsers from '../admin/pages/ViewUsers';
import AllBookings from '../admin/pages/AllBookings';
import RevenueAnalytics from '../admin/pages/RevenueAnalytics';

// Route Protection
import ProtectedRoute from './ProtectedRoute';

const ADMIN_PATH = `/${process.env.REACT_APP_ADMIN_URL_PATH || 'admin-portal-secret/login'}`;

const AppRoutes = () => (
  <Routes>
    {/* ✅ Public Routes */}
    <Route path="/" element={<Home />} />
    <Route path="/resorts" element={<ResortList />} />
    <Route path="/resorts/:id" element={<ResortDetail />} />
    <Route path="/auth" element={<CombinedLoginRegister />} />
    <Route path="/settings" element={<Settings />} />
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/help" element={<HelpSupport />} />
    <Route path="/deal/:id" element={<DealDetails />} /> 
    <Route path="/amenity/:amenityName" element={<AmenityResortsList />} /> 
    <Route path="/about" element={<About />} />
    <Route path="/notifications" element={<Notifications />} />

    {/* ✅ Protected Reservation Route for Logged-in Users */}
    <Route
      path="/resorts/:id/reserve"
      element={
        <ProtectedRoute role="user">
          <ReservationForm />
        </ProtectedRoute>
      }
    />

    {/* ✅ Admin Routes */}
    <Route path={ADMIN_PATH} element={<AdminLogin />} />
    <Route
      path="/admin/dashboard"
      element={
        <ProtectedRoute role="admin">
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/resorts"
      element={
        <ProtectedRoute role="admin">
          <ModerationPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/users"
      element={
        <ProtectedRoute role="admin">
          <ViewUsers />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/bookings"
      element={
        <ProtectedRoute role="admin">
          <AllBookings />
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin/analytics"
      element={
        <ProtectedRoute role="admin">
          <RevenueAnalytics />
        </ProtectedRoute>
      }
    />

    {/* ⚠️ Optional: 404 Page */}
    {/* <Route path="*" element={<NotFound />} /> */}
  </Routes>
);

export default AppRoutes;
