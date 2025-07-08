import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

const AddResort = () => {
  const navigate = useNavigate();
  const currentOwnerId = JSON.parse(localStorage.getItem("user"))?.id;

  const [loading, setLoading] = useState(true);
  const [resortStatus, setResortStatus] = useState(null);
  const [resort, setResort] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    amenities: [],
    type: "",
  });

  const [resortImage, setResortImage] = useState(null);
  const [roomImage1, setRoomImage1] = useState(null);
  const [roomImage2, setRoomImage2] = useState(null);

  useEffect(() => {
    if (!currentOwnerId) {
      navigate("/login");
      return;
    }

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

  const handleImageChange = (e, imageSetter) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      imageSetter(file);
    } else {
      alert("Please select a valid image file.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resortImage || !roomImage1 || !roomImage2) {
      alert("Please upload all 3 images (1 resort, 2 rooms).");
      return;
    }

    const formData = new FormData();
    formData.append("resortImage", resortImage);
    formData.append("roomImage1", roomImage1);
    formData.append("roomImage2", roomImage2);

    Object.entries(resort).forEach(([key, val]) =>
      formData.append(key, key === "amenities" ? JSON.stringify(val) : val)
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
      <div className="p-6 max-w-xl mx-auto bg-white rounded shadow mt-10 text-center">
        <h2 className="text-xl font-semibold mb-2">Awaiting Approval</h2>
        <p className="text-gray-600 mb-4">Your resort is under review by the admin.</p>
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
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Add New Resort Listing
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-4">
          <input
            type="text"
            name="name"
            value={resort.name}
            onChange={handleChange}
            placeholder="Resort Name"
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="text"
            name="location"
            value={resort.location}
            onChange={handleChange}
            placeholder="Location"
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <input
            type="number"
            name="price"
            value={resort.price}
            onChange={handleChange}
            placeholder="Price per night"
            min="0"
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
        </div>

        <textarea
          name="description"
          value={resort.description}
          onChange={handleChange}
          placeholder="Resort description…"
          required
          className="w-full border border-gray-300 rounded px-4 py-2 h-32 resize-none"
        />

        <div>
          <label className="block mb-1 text-sm font-medium">Amenities (comma separated)</label>
          <input
            type="text"
            name="amenities"
            value={resort.amenities.join(", ")}
            onChange={handleAmenityChange}
            placeholder="WiFi, Pool, Spa, Parking"
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          <div className="flex flex-wrap gap-2 mt-2">
            {resort.amenities.map((item, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">Resort Type</label>
          <select
            name="type"
            value={resort.type}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
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
        </div>

        {/* Resort Image */}
        <div>
          <label className="block mb-1 text-sm font-medium">Main Resort Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setResortImage)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          {resortImage && (
            <p className="text-sm text-green-600 mt-1">Selected: {resortImage.name}</p>
          )}
        </div>

        {/* Room Image 1 */}
        <div>
          <label className="block mb-1 text-sm font-medium">Room Image 1 *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setRoomImage1)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          {roomImage1 && (
            <p className="text-sm text-green-600 mt-1">Selected: {roomImage1.name}</p>
          )}
        </div>

        {/* Room Image 2 */}
        <div>
          <label className="block mb-1 text-sm font-medium">Room Image 2 *</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, setRoomImage2)}
            required
            className="w-full border border-gray-300 rounded px-4 py-2"
          />
          {roomImage2 && (
            <p className="text-sm text-green-600 mt-1">Selected: {roomImage2.name}</p>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Submit Resort
        </button>
      </form>
    </div>
  );
};

export default AddResort;
