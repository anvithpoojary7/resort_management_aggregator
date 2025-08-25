import React, { useState, useEffect } from "react";
import axios from "axios";

const EditResortModal = ({ resort, onClose, fetchResorts }) => {
  const [resortData, setResortData] = useState({
    name: "",
    location: "",
    price: "",
  });

  useEffect(() => {
    if (resort) {
      setResortData({
        name: resort.name || "",
        location: resort.location || "",
        price: resort.price || "",
      });
    }
  }, [resort]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResortData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    // ✅ ================== SOLUTION ==================
    // ADD THIS VALIDATION BLOCK
    if (
      !resortData.name.trim() ||
      !resortData.location.trim() ||
      String(resortData.price).trim() === ""
    ) {
      alert("Please make sure Name, Location, and Price are not empty.");
      return; // Stop the function here if data is invalid
    }
    // ✅ ===============================================

    try {
      // The data sent is now guaranteed to be valid
      await axios.put(
        `http://localhost:8080/api/admin/resorts/${resort._id}`,
        resortData
      );
      await fetchResorts();
      onClose();
      alert("Resort updated successfully!");
    } catch (error) {
      console.error("Error updating resort:", error);
      // This will now only show up for genuine server/network errors
      alert("Failed to update resort. Check console for details.");
    }
  };

  return (
    // ... all your JSX for the modal remains exactly the same
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Resort</h2>

        <label className="block mb-3">
          <span className="text-gray-700 font-medium">Name</span>
          <input
            type="text"
            name="name"
            value={resortData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </label>

        <label className="block mb-3">
          <span className="text-gray-700 font-medium">Location</span>
          <input
            type="text"
            name="location"
            value={resortData.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </label>

        <label className="block mb-4">
          <span className="text-gray-700 font-medium">Price</span>
          <input
            type="number"
            name="price"
            value={resortData.price}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-blue-300"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Save
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold text-lg"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default EditResortModal;