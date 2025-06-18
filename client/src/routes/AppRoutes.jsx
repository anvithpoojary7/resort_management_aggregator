import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ResortDetails from '../pages/ResortDetails';
import CombinedLoginRegister from '../pages/CombinedLoginRegister'; // ✅ correct import

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/resorts/:id" element={<ResortDetails />} />
    <Route path="/auth" element={<CombinedLoginRegister />} />
  </Routes>
);

export default AppRoutes;
