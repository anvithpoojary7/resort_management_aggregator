import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

const AddResort = () => {
  const navigate = useNavigate();
  const currentOwnerId = JSON.parse(localStorage.getItem("user"))?.id;
  console.log("🟢 currentOwnerId in AddResort.jsx:", currentOwnerId);
  if (!currentOwnerId) navigate("/login");

  const [loading, setLoading] = useState(true);
  const [resortStatus, setResortStatus] = useState(null); // none | pending | approved | rejected
  const [resort, setResort] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    amenities: [],
    type: "",
  });
  const [imageFile, setImageFile] = useState(null); // Only one file

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resorts/owner/${currentOwnerId}`);
        const data = await res.json();

        if (!data) setResortStatus("none");
        else {
          setResortStatus(data.status);
          if (["approved", "rejected"].includes(data.status)) {
            navigate("/owner/dashboard");
          }
        }
      } catch (err) {
        console.error("Error checking resort status:", err);
        setResortStatus("none");
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, [currentOwnerId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResort((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (e) => {
    const arr = e.target.value
      .split(",")
      .map((a) => a.trim())
      .filter(Boolean);
    setResort((prev) => ({ ...prev, amenities: arr }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setImageFile(null);
      return;
    }
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please choose one image.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile); // Must match backend field name

    Object.entries(resort).forEach(([k, v]) =>
      formData.append(k, k === "amenities" ? JSON.stringify(v) : v)
    );
    formData.append("ownerId", currentOwnerId);

    try {
      const res = await fetch(`${API_BASE_URL}/api/resorts`, {
        method: "POST",
        body: formData,
      });
      const body = await res.json();

      if (res.ok) {
        alert("Resort submitted successfully and is pending review!");
        navigate("/owner/dashboard");
      } else {
        alert(body.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Server error while submitting resort.");
    }
  };

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading…</div>;
  }

  if (resortStatus === "pending") {
    return (
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow mt-8 text-center">
        <h2 className="text-xl font-semibold mb-2">Awaiting Approval</h2>
        <p className="text-gray-600 mb-4">
          Your resort is under review by the admin.
        </p>
        <button
          onClick={() => navigate("/owner/dashboard")}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded shadow mt-8">
      <h2 className="text-2xl font-bold mb-4">Add New Resort Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={resort.name}
          onChange={handleChange}
          placeholder="Resort Name"
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          name="location"
          value={resort.location}
          onChange={handleChange}
          placeholder="Location"
          required
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          value={resort.price}
          onChange={handleChange}
          placeholder="Price per night"
          min="0"
          required
          className="w-full border p-2 rounded"
        />

        <textarea
          name="description"
          value={resort.description}
          onChange={handleChange}
          placeholder="Resort description…"
          required
          className="w-full border p-2 rounded h-28"
        />

        <input
          type="text"
          name="amenities"
          value={resort.amenities.join(", ")}
          onChange={handleAmenityChange}
          placeholder="Amenities (comma separated)"
          className="w-full border p-2 rounded"
        />

        <select
          name="type"
          value={resort.type}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded"
        >
          <option value="">Select Resort Type</option>
          <option>Beach</option>
          <option>Mountain</option>
          <option>Desert</option>
          <option>City</option>
          <option>Island</option>
          <option>Adventure</option>
          <option>Wellness</option>
          <option>Other</option>
        </select>

        <input
          type="file"
          name="image" // ← match backend
          accept="image/*"
          onChange={handleImageChange}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded hover:bg-blue-700"
        >
          Submit Resort
        </button>
      </form>
    </div>
  );
};

export default AddResort;
