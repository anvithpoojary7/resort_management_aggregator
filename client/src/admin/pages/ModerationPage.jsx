import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar"; // ✅ Path to your Sidebar component

const API_BASE_URL = "http://localhost:8080";

const AddResort = () => {
  const navigate = useNavigate();

  const [resortImage, setResortImage] = useState(null);
  const [resort, setResort] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    amenities: [],
    type: "",
  });

  const [rooms, setRooms] = useState([
    { roomName: "", roomPrice: "", roomDescription: "", roomImages: [] },
    { roomName: "", roomPrice: "", roomDescription: "", roomImages: [] },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResort((prev) => ({ ...prev, [name]: value }));
  };

  const handleAmenityChange = (e) => {
    const arr = e.target.value.split(",").map((a) => a.trim()).filter(Boolean);
    setResort((prev) => ({ ...prev, amenities: arr }));
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const handleRoomImageChange = (index, fileList) => {
    const newFiles = Array.from(fileList).filter((f) => f.type.startsWith("image/"));

    setRooms((prevRooms) => {
      const updated = [...prevRooms];
      const combined = [...updated[index].roomImages, ...newFiles];
      const unique = combined.reduce((acc, curr) => {
        return acc.find(f => f.name === curr.name && f.size === curr.size) ? acc : [...acc, curr];
      }, []);
      updated[index].roomImages = unique.slice(0, 5);
      return updated;
    });
  };

  const addNewRoom = () => {
    if (rooms.length >= 5) return alert("Maximum 5 rooms allowed.");
    setRooms([...rooms, { roomName: "", roomPrice: "", roomDescription: "", roomImages: [] }]);
  };

  const removeRoom = (index) => {
    if (rooms.length <= 2) return alert("Minimum 2 rooms required.");
    const updated = [...rooms];
    updated.splice(index, 1);
    setRooms(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resortImage) return alert("Main resort image is required.");
    if (rooms.length < 2 || rooms.length > 5) return alert("Add 2 to 5 rooms.");

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      if (!room.roomName || !room.roomPrice || !room.roomDescription || room.roomImages.length < 2) {
        alert(`Room ${i + 1} is incomplete or missing images.`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("resortImage", resortImage);
    Object.entries(resort).forEach(([key, val]) =>
      formData.append(key, key === "amenities" ? JSON.stringify(val) : val)
    );
    formData.append(
      "rooms",
      JSON.stringify(
        rooms.map(({ roomName, roomPrice, roomDescription }) => ({
          roomName,
          roomPrice,
          roomDescription
        }))
      )
    );
    rooms.forEach((room, i) => {
      room.roomImages.forEach((file, j) => {
        formData.append(`roomImage_${i}_${j}`, file);
      });
    });

    try {
      const res = await fetch(`${API_BASE_URL}/api/resorts`, {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      const body = text ? JSON.parse(text) : {};
      if (res.ok) {
        alert("Resort submitted successfully!");
        navigate("/admin/resorts"); // ✅ Go to Manage Resorts after saving
      } else {
        alert(body.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Submission error:", err);
      alert("Server error while submitting resort.");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Add New Resort Listing</h1>
        <p className="text-gray-600 mb-6">
          Fill out the form below to add a new resort for approval.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl shadow">
          <input type="text" name="name" value={resort.name} onChange={handleChange} placeholder="Resort Name" required className="w-full border px-4 py-2 rounded" />
          <input type="text" name="location" value={resort.location} onChange={handleChange} placeholder="Location" required className="w-full border px-4 py-2 rounded" />
          <input type="number" name="price" value={resort.price} onChange={handleChange} placeholder="Price per night" min="0" required className="w-full border px-4 py-2 rounded" />
          <textarea name="description" value={resort.description} onChange={handleChange} placeholder="Resort description…" required className="w-full border px-4 py-2 h-32 resize-none rounded" />
          <input type="text" name="amenities" value={resort.amenities.join(", ")} onChange={handleAmenityChange} placeholder="WiFi, Pool, Spa..." className="w-full border px-4 py-2 rounded" />

          <select name="type" value={resort.type} onChange={handleChange} required className="w-full border px-4 py-2 rounded">
            <option value="">Select Resort Type</option>
            <option>Beach</option>
            <option>Mountain</option>
            <option>City</option>
            <option>Island</option>
            <option>Adventure</option>
            <option>Wellness</option>
            <option>Other</option>
          </select>

          <div>
            <label className="block mb-1 font-medium">Main Resort Image *</label>
            <input type="file" accept="image/*" required onChange={(e) => setResortImage(e.target.files[0])} className="w-full border px-4 py-2 rounded" />
          </div>

          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-2">Room Details</h3>
            {rooms.map((room, index) => (
              <div key={index} className="border p-4 rounded-lg bg-gray-50 space-y-2">
                <input type="text" placeholder="Room Name" value={room.roomName} onChange={(e) => handleRoomChange(index, "roomName", e.target.value)} required className="w-full border px-3 py-2 rounded" />
                <input type="number" placeholder="Room Price" value={room.roomPrice} onChange={(e) => handleRoomChange(index, "roomPrice", e.target.value)} required className="w-full border px-3 py-2 rounded" />
                <textarea placeholder="Room Description" value={room.roomDescription} onChange={(e) => handleRoomChange(index, "roomDescription", e.target.value)} required className="w-full border px-3 py-2 rounded h-24" />
                <label className="block text-sm text-gray-700">Add Room Images (2-5 images)</label>
                <input type="file" multiple accept="image/*" onChange={(e) => handleRoomImageChange(index, e.target.files)} className="w-full border px-3 py-2 rounded" />
                {room.roomImages.length > 0 && (
                  <p className="text-sm text-green-600">{room.roomImages.length} image(s) selected.</p>
                )}
                {rooms.length > 2 && (
                  <button type="button" onClick={() => removeRoom(index)} className="text-red-600 text-sm mt-2">
                    Remove Room
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addNewRoom} className="text-blue-600 font-semibold">
              + Add Another Room
            </button>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">
            Submit Resort
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddResort;
