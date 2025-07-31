import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

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
    const newFiles = Array.from(fileList).filter(
      (f) => f.type.startsWith("image/") && f.size <= 500 * 1024
    );

    const rejected = Array.from(fileList).filter(f => f.size > 500 * 1024);
    if (rejected.length > 0) {
      alert("Some images were skipped because they exceed 500KB.");
    }

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

  const removeRoomImage = (roomIndex, imageIndex) => {
    setRooms((prevRooms) => {
      const updated = [...prevRooms];
      updated[roomIndex].roomImages.splice(imageIndex, 1);
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
    if (resortImage.size > 500 * 1024) return alert("Main resort image must be under 500KB.");

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
          roomDescription,
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
        navigate("/admin/resorts");
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
  <div className="flex-1 max-w-4xl mx-auto px-4 py-8">
    <h1 className="text-2xl font-semibold mb-4">Add New Resort</h1>
    <p className="text-gray-500 mb-6 text-sm">Fill out the form below to submit a new resort.</p>

    <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-sm border">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" value={resort.name} onChange={handleChange} placeholder="Resort Name" required className="border px-3 py-2 rounded text-sm" />
        <input type="text" name="location" value={resort.location} onChange={handleChange} placeholder="Location" required className="border px-3 py-2 rounded text-sm" />
        <input type="number" name="price" value={resort.price} onChange={handleChange} placeholder="Price per night" min="0" required className="border px-3 py-2 rounded text-sm" />
        <input type="text" name="amenities" value={resort.amenities.join(", ")} onChange={handleAmenityChange} placeholder="WiFi, Pool, Spa..." className="border px-3 py-2 rounded text-sm" />
        <select name="type" value={resort.type} onChange={handleChange} required className="border px-3 py-2 rounded text-sm">
          <option value="">Select Resort Type</option>
          <option>Beach</option>
          <option>Mountain</option>
          <option>City</option>
          <option>Island</option>
          <option>Adventure</option>
          <option>Wellness</option>
          <option>Other</option>
        </select>
      </div>

      <textarea name="description" value={resort.description} onChange={handleChange} placeholder="Resort description..." required className="border px-3 py-2 rounded text-sm w-full h-24 resize-none" />

      <div>
        <label className="text-sm font-medium">Main Resort Image (max 500KB)</label>
        <input
          type="file"
          accept="image/*"
          required={!resortImage}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file && file.size <= 500 * 1024) {
              setResortImage(file);
            } else {
              alert("Main resort image must be less than 500KB.");
              e.target.value = "";
            }
          }}
          className="border px-3 py-2 rounded text-sm mt-1 w-full"
        />
        {resortImage && (
          <div className="relative w-fit mt-2">
            <img
              src={URL.createObjectURL(resortImage)}
              alt="Preview"
              className="w-32 h-24 object-cover rounded shadow-sm"
            />
            <button
              type="button"
              onClick={() => setResortImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center hover:bg-red-600"
            >
              ×
            </button>
            <p className="text-xs text-gray-500 mt-1">{(resortImage.size / 1024).toFixed(1)} KB</p>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <h3 className="text-base font-medium">Room Details</h3>
        {rooms.map((room, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded border space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Room Name" value={room.roomName} onChange={(e) => handleRoomChange(index, "roomName", e.target.value)} required className="border px-3 py-2 rounded text-sm" />
              <input type="number" placeholder="Room Price" value={room.roomPrice} onChange={(e) => handleRoomChange(index, "roomPrice", e.target.value)} required className="border px-3 py-2 rounded text-sm" />
            </div>
            <textarea placeholder="Room Description" value={room.roomDescription} onChange={(e) => handleRoomChange(index, "roomDescription", e.target.value)} required className="w-full border px-3 py-2 rounded h-20 text-sm" />
            <input type="file" multiple accept="image/*" onChange={(e) => handleRoomImageChange(index, e.target.files)} className="w-full border px-3 py-2 rounded text-sm" />

            {room.roomImages.length > 0 && (
              <ul className="text-sm space-y-2 mt-2">
                {room.roomImages.map((img, imgIdx) => (
                  <li key={imgIdx} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img src={URL.createObjectURL(img)} alt={`room-${index}-${imgIdx}`} className="w-14 h-14 object-cover rounded border" />
                      <span className="text-xs text-gray-700">{img.name} - {(img.size / 1024).toFixed(1)} KB</span>
                    </div>
                    <button onClick={() => removeRoomImage(index, imgIdx)} type="button" className="text-red-500 text-xs hover:underline">Delete</button>
                  </li>
                ))}
              </ul>
            )}

            {rooms.length > 2 && (
              <button type="button" onClick={() => removeRoom(index)} className="text-red-600 text-xs hover:underline">
                Remove Room
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addNewRoom} className="text-blue-600 text-sm hover:underline">
          + Add Another Room
        </button>
      </div>

      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded text-sm hover:bg-blue-700">
        Submit Resort
      </button>
    </form>
  </div>
</div>

             
  );
};

export default AddResort;
