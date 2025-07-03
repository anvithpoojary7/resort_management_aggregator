import React, { useEffect, useState } from "react";

const OwnerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentOwnerId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/api/resorts/owner/${currentOwnerId}/bookings` );
        const data = await res.json();
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (currentOwnerId) {
      fetchBookings();
    }
  }, [currentOwnerId]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Resort Bookings</h2>
      {loading ? (
        <p>Loading bookings...</p>
      ) : bookings.length > 0 ? (
        <ul className="space-y-4">
          {bookings.map((booking) => (
            <li
              key={booking._id}
              className="border p-4 rounded shadow hover:shadow-lg transition"
            >
              <p className="font-semibold">
                Resort: {booking.resortDetails?.name || "N/A"}
              </p>
              <p>Customer Name: {booking.customerName}</p>
              <p>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</p>
              <p>Check-out: {new Date(booking.checkOutDate).toLocaleDateString()}</p>
              <p>Guests: {booking.numberOfGuests}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookings found.</p>
      )}
    </div>
  );
};

export default OwnerBookings;