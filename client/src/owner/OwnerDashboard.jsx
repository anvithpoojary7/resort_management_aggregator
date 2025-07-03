import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const OwnerDashboard = () => {
  const [resort, setResort] = useState(null);
  const [status, setStatus] = useState(""); // pending | approved | rejected | ""
  const [loading, setLoading] = useState(true);

  const currentOwnerId = JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (!currentOwnerId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/resorts/owner/${currentOwnerId}`);
        const data = await res.json();
        if (data?._id) {
          setResort(data);
          setStatus(data.status);   // pending | approved | rejected
        }
      } catch (err) {
        console.error("Error fetching resort:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentOwnerId]);

  // ───────── UI branches ─────────
  if (loading) return <p className="p-6">Loading...</p>;

  // 1️⃣ No resort
  if (!resort) {
    return (
      <div className="p-6 space-y-4">
        <h2 className="text-xl font-bold">You haven’t added a resort yet.</h2>
        <Link to="/owner/addresort" className="text-indigo-600 underline">
          Click here to add your resort
        </Link>
      </div>
    );
  }

  // 2️⃣ Pending
  if (status === "pending") {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-yellow-600">
          Your resort is under review by the admin.
        </h2>
      </div>
    );
  }

  // 3️⃣ Rejected
  if (status === "rejected") {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold text-red-600">
          Unfortunately your resort was rejected. Please edit and resubmit.
        </h2>
      </div>
    );
  }

  // 4️⃣ Approved
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome to Your Resort Dashboard</h2>
      <div className="border p-4 rounded shadow space-y-2">
        <p><strong>Name:</strong> {resort?.name}</p>
        <p><strong>Location:</strong> {resort?.location}</p>
        <p><strong>Type:</strong> {resort?.type}</p>
        <p><strong>Status:</strong> ✅ Approved</p>
      </div>
    </div>
  );
};

export default OwnerDashboard;