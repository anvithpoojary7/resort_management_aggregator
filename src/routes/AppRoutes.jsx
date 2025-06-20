import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ResortList from '../pages/ResortList';
import ResortDetail from '../pages/ResortDetail';
import CombinedLoginRegister from '../pages/CombinedLoginRegister';
import Settings from '../pages/Settings'; 
import ContactUs from '../pages/ContactUs';
import HelpSupport from '../pages/HelpSupport';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/resorts" element={<ResortList />} />
    <Route path="/resorts/:id" element={<ResortDetail />} />
    <Route path="/auth" element={<CombinedLoginRegister />} />
    <Route path="/settings" element={<Settings />} /> 
    <Route path="/contact" element={<ContactUs />} />
    <Route path="/help" element={<HelpSupport />} />
  </Routes>
);

export default AppRoutes;

