// AddResort.jsx (Only the fetch URL is changed)
import React, { useState } from "react";

const AddResort = () => {
  const [resort, setResort] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    amenities: [],
    type: "",
  });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResort({ ...resort, [name]: value });
  };

  const handleAmenityChange = (e) => {
    const amenitiesArray = e.target.value.split(',').map(item => item.trim()).filter(item => item !== '');
    setResort({ ...resort, amenities: amenitiesArray });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
        alert("Please select an image file for the resort.");
        return;
    }

    // This is the crucial part: Get the owner ID.
    // In a real app, this would come from your authentication context (e.g., JWT).
    // For now, it's hardcoded, but consider how you'd get it securely.
    const ownerId = "some_owner_id_from_logged_in_user"; // Make sure this matches what's used in OwnerDashboard

    const formData = new FormData();
    formData.append('name', resort.name);
    formData.append('location', resort.location);
    formData.append('price', resort.price);
    formData.append('description', resort.description);
    formData.append('amenities', JSON.stringify(resort.amenities));
    formData.append('type', resort.type);
    formData.append('ownerId', ownerId); // This sends the ownerId with the resort
    formData.append('image', imageFile);

    try {
      // THIS IS THE LINE THAT NEEDS TO BE CHANGED
      const response = await fetch("http://localhost:8080/api/resorts", { // <--- ADDED 'http://' HERE
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        alert("Resort submitted successfully for moderation!");
        setResort({ name: "", location: "", price: "", description: "", amenities: [], type: "" });
        setImageFile(null);
        e.target.reset();
        // Optional: Redirect to dashboard after successful submission
        // navigate("/owner/dashboard");
      } else {
        const errorData = await response.json();
        alert(`Error adding resort: ${errorData.message || "Something went wrong."}`);
      }
    } catch (error) {
      console.error("Failed to submit resort:", error);
      alert("Network error: Could not connect to the server.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Resort Listing</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Resort Name"
          value={resort.name}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location (e.g., Goa, India)"
          value={resort.location}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price per night (in INR)"
          value={resort.price}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        />
        <div className="flex items-center space-x-2">
            <label htmlFor="image-upload" className="block text-sm font-medium text-gray-700">Resort Image:</label>
            <input
                id="image-upload"
                type="file"
                name="image"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
            />
            {imageFile && (
                <span className="text-sm text-gray-600 truncate">{imageFile.name}</span>
            )}
        </div>
        <textarea
          name="description"
          placeholder="Provide a detailed description of your resort..."
          value={resort.description}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg h-28 resize-y focus:ring-blue-500 focus:border-blue-500"
          required
        ></textarea>
        <input
          type="text"
          name="amenities"
          placeholder="Amenities (e.g., Pool, Free WiFi, Parking, Spa - comma separated)"
          value={resort.amenities.join(', ')}
          onChange={handleAmenityChange}
          className="w-full border p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
        />
        <select
          name="type"
          value={resort.type}
          onChange={handleChange}
          className="w-full border p-2 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Resort Type</option>
          <option value="Beach">Beach Resort</option>
          <option value="Mountain">Mountain Lodge</option>
          <option value="Desert">Desert Oasis</option>
          <option value="City">City Escape</option>
          <option value="Island">Island Paradise</option>
          <option value="Adventure">Adventure Resort</option>
          <option value="Wellness">Wellness Retreat</option>
          <option value="Other">Other</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 w-full"
        >
          Submit Resort for Review
        </button>
      </form>
    </div>
  );
};

export default AddResort;