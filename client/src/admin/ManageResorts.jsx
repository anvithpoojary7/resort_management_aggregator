// client/src/admin/ManageResorts.jsx
import React from 'react';
import Sidebar from '../components/Sidebar'; // Assuming correct path
import Header from '../../components/Header';   // Adjust path based on your Header.jsx location
import UserAndResortTables from '../../components/UserAndResortTables'; // Adjust path as this is a new component

const ManageResorts = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Resort Management</h1>
          {/* Render the shared component, defaulting to the 'resorts' tab */}
          <UserAndResortTables initialTab="resorts" />
        </main>
      </div>
    </div>
  );
};

export default ManageResorts;