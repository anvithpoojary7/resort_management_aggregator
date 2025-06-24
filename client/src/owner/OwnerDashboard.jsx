import React from "react";
import { useNavigate } from "react-router-dom";

const OwnerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Welcome, Resort Owner</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          onClick={() => navigate("/owner/add-resort")}
          className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">➕ Add Resort</h2>
          <p className="text-gray-600">Add a new resort listing.</p>
        </div>

        <div
          onClick={() => navigate("/owner/bookings")}
          className="cursor-pointer bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">📅 View Bookings</h2>
          <p className="text-gray-600">Check who booked your resorts.</p>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;