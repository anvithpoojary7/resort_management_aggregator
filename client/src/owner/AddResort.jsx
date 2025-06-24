import React, { useState } from "react";

const AddResort = () => {
  const [resort, setResort] = useState({
    name: "",
    location: "",
    price: "",
    image: "",
  });

  const handleChange = (e) => {
    setResort({ ...resort, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/resorts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(resort),
    });

    if (response.ok) {
      alert("Resort added successfully!");
      setResort({ name: "", location: "", price: "", image: "" });
    } else {
      alert("Error adding resort.");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Add New Resort</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Resort Name"
          value={resort.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={resort.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price per night"
          value={resort.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={resort.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Add Resort
        </button>
      </form>
    </div>
  );
};

export default AddResort;