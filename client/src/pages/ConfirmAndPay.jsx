import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://resort-finder-2aqp.onrender.com"
    : "http://localhost:8080";

const ConfirmAndPay = () => {
  const { state: reservation } = useLocation();
  const navigate = useNavigate();

  // ------------------------------
  // ✅ Initialize all hooks at top
  // ------------------------------
  const [checkIn, setCheckIn] = useState(reservation?.checkIn || "");
  const [checkOut, setCheckOut] = useState(reservation?.checkOut || "");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isAvailable, setIsAvailable] = useState(false);
  const [availabilityMsg, setAvailabilityMsg] = useState("");
  const [isEditingDates, setIsEditingDates] = useState(false);
  const [isEditingGuests, setIsEditingGuests] = useState(false);

  const [guestsAdult, setGuestsAdult] = useState(reservation?.guestsAdult || 1);
  const [guestsChild, setGuestsChild] = useState(reservation?.guestsChild || 0);
  const [extraBed, setExtraBed] = useState(reservation?.extraBed || 0);

  // ------------------------------
  // Redirect if no reservation
  // ------------------------------
  useEffect(() => {
    if (!reservation) {
      navigate("/");
    }
  }, [reservation, navigate]);

  // ------------------------------
  // Check availability
  // ------------------------------
  const checkAvailability = async (ci, co) => {
    if (!ci || !co) return;
    if (new Date(ci) >= new Date(co)) {
      setAvailabilityMsg("⚠️ Check-out must be after check-in.");
      setIsAvailable(false);
      return;
    }

    try {
      const res = await axios.get(`${API_URL}/api/bookings/check-availability`, {
        params: { roomId: reservation.roomId, checkIn: ci, checkOut: co },
      });

      if (res.data.available) {
        setAvailabilityMsg("✅ Room is available!");
        setIsAvailable(true);
      } else {
        setAvailabilityMsg("❌ Room is not available for these dates.");
        setIsAvailable(false);
      }
    } catch (error) {
      console.error("Availability check error:", error);
      setAvailabilityMsg("⚠️ Error checking availability");
      setIsAvailable(false);
    }
  };

  // ------------------------------
  // Run availability check on change
  // ------------------------------
  useEffect(() => {
    if (checkIn && checkOut) {
      checkAvailability(checkIn, checkOut);
    }
  }, [checkIn, checkOut]);

  const handleDateChange = (field, value) => {
    if (field === "checkIn") {
      setCheckIn(value);
    } else {
      setCheckOut(value);
    }
  };

  // ------------------------------
  // Price Calculation
  // ------------------------------
  const nights =
    checkIn && checkOut
      ? (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
      : 0;
  const roomTotal = nights > 0 ? nights * reservation?.price : 0;
  const extraBedCost = nights > 0 ? extraBed * nights * 500 : 0;
  const taxes = Math.round((roomTotal + extraBedCost) * 0.1);
  const total = roomTotal + extraBedCost + taxes;

  // ------------------------------
  // Handle payment
  // ------------------------------
  const handlePayment = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in");
      navigate("/login");
      return;
    }

    if (!isAvailable) {
      alert("Room is not available for selected dates.");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/bookings`,
        {
          resort: reservation.resortId,
          room: reservation.roomId,
          checkIn,
          checkOut,
          totalAmount: total,
          guestsAdult,
          guestsChild,
          extraBed,
          paymentStatus: "paid",
          paymentId: "mock_" + Date.now(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        navigate("/reservation-success", {
          state: { ...reservation, checkIn, checkOut, guestsAdult, guestsChild },
        });
      } else {
        alert("Booking failed. Try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("An error occurred during booking.");
    }
  };

  // ------------------------------
  // UI
  // ------------------------------
  if (!reservation) {
    return <div className="p-8 text-center">Loading reservation...</div>;
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 py-12 px-6">
      <h1 className="text-3xl font-bold text-center mb-6">Confirm and Pay</h1>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">
          {/* Rare find banner */}
          <div className="border p-4 rounded-lg bg-pink-50 flex justify-between items-center">
            <div>
              <p className="font-semibold">This is a rare find.</p>
              <p className="text-sm text-gray-600">
                {reservation.resortName} is usually booked.
              </p>
            </div>
            <span className="text-pink-600 text-2xl">💎</span>
          </div>

          {/* Trip Details */}
          <div className="border p-4 rounded-lg space-y-4 shadow">
            <h2 className="text-xl font-semibold">Your Trip</h2>

            {/* Dates */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Dates</p>
                {isEditingDates ? (
                  <div className="space-y-2">
                    <input
                      type="date"
                      value={checkIn || ""}
                      onChange={(e) => handleDateChange("checkIn", e.target.value)}
                      className="border p-1 rounded"
                    />
                    <input
                      type="date"
                      value={checkOut || ""}
                      onChange={(e) => handleDateChange("checkOut", e.target.value)}
                      className="border p-1 rounded"
                    />
                    <button
                      onClick={() => setIsEditingDates(false)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    {availabilityMsg && (
                      <p className={`text-sm ${isAvailable ? "text-green-600" : "text-red-600"}`}>
                        {availabilityMsg}
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-600">
                    {checkIn || "—"} to {checkOut || "—"}
                  </p>
                )}
              </div>
              {!isEditingDates && (
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setIsEditingDates(true)}
                >
                  Edit
                </button>
              )}
            </div>

            {/* Guests */}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Guests</p>
                {isEditingGuests ? (
                  <div className="space-y-2">
                    <input
                      type="number"
                      min="1"
                      value={guestsAdult}
                      onChange={(e) => setGuestsAdult(Number(e.target.value))}
                      className="border p-1 rounded w-20"
                    />{" "}
                    Adults
                    <br />
                    <input
                      type="number"
                      min="0"
                      value={guestsChild}
                      onChange={(e) => setGuestsChild(Number(e.target.value))}
                      className="border p-1 rounded w-20"
                    />{" "}
                    Children
                    <br />
                    <button
                      onClick={() => setIsEditingGuests(false)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <p className="text-gray-600">
                    {guestsAdult} Adult{guestsAdult > 1 ? "s" : ""}
                    {guestsChild > 0 ? `, ${guestsChild} Child` : ""}
                  </p>
                )}
              </div>
              {!isEditingGuests && (
                <button
                  className="text-blue-600 hover:underline"
                  onClick={() => setIsEditingGuests(true)}
                >
                  Edit
                </button>
              )}
            </div>
          </div>

          {/* Payment Options */}
          <div className="border p-4 rounded-lg shadow space-y-3">
            <h2 className="text-xl font-semibold">Pay With</h2>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full p-2 border rounded bg-white"
            >
              <option value="upi">UPI</option>
              <option value="card">Credit/Debit Card</option>
              <option value="netbanking">Net Banking</option>
            </select>
          </div>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="border p-4 rounded-lg shadow space-y-4">
          <div className="flex gap-4">
            <img
              src={`${API_URL}/api/resorts/image/${reservation.roomImage}`}
              alt="Room"
              className="w-24 h-24 object-cover rounded"
            />
            <div>
              <h3 className="font-semibold">{reservation.roomName}</h3>
              <p className="text-sm text-gray-600">{reservation.resortName}</p>
              <p className="text-sm text-gray-600">★ 4.99 • Superhost</p>
            </div>
          </div>

          <hr />
          <h3 className="text-lg font-semibold">Your total</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between">
              <span>
                {nights > 0 ? `${nights} night${nights > 1 ? "s" : ""}` : "Price calculation"} × ₹
                {reservation.price}
              </span>
              <span>₹{roomTotal.toLocaleString()}</span>
            </div>
            {extraBed > 0 && nights > 0 && (
              <div className="flex justify-between">
                <span>
                  Extra bed: ₹500 × {extraBed} × {nights} nights
                </span>
                <span>₹{extraBedCost.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Taxes</span>
              <span>₹{taxes.toLocaleString()}</span>
            </div>
          </div>

          <hr />
          <div className="flex justify-between text-lg font-bold">
            <span>Total (INR)</span>
            <span>₹{total.toLocaleString()}</span>
          </div>

        <button
  onClick={handlePayment}
  className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
>
  Proceed to Pay
</button>

        </div>
      </div>
    </div>
  );
};

export default ConfirmAndPay;
