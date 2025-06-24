import React from "react";

const OwnerBookings = () => {
  // This would usually fetch data from your backend
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Resort Bookings</h1>
      <p className="text-gray-600">List of users who booked your resorts.</p>

      {/* Placeholder content */}
      <div className="mt-4 bg-white p-4 rounded shadow">
        <p><strong>Resort:</strong> Beach Paradise</p>
        <p><strong>Booked by:</strong> user@example.com</p>
        <p><strong>Dates:</strong> 10 July - 12 July</p>
      </div>
    </div>
  );
};

export default OwnerBookings;