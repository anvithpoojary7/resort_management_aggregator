import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const API_BASE_URL = "http://localhost:8080";
const AMENITY_OPTIONS = ["WiFi", "Pool", "Spa", "Parking", "Gym", "Bar", "Restaurant", "Beach Access"];

const AddResort = () => {
  const navigate = useNavigate();

  const [resortImage, setResortImage] = useState(null);
  const [resort, setResort] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    type: "",
    ownerName: "", // ✅ Added owner name field
  });

  const [rooms, setRooms] = useState([
    { roomName: "", roomPrice: "", roomDescription: "", roomImages: [], amenities: [] },
    { roomName: "", roomPrice: "", roomDescription: "", roomImages: [], amenities: [] },
  ]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResort((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomChange = (index, field, value) => {
    const updatedRooms = [...rooms];
    updatedRooms[index][field] = value;
    setRooms(updatedRooms);
  };

  const handleRoomAmenityToggle = (index, amenity) => {
    setRooms((prevRooms) =>
      prevRooms.map((room, i) =>
        i === index
          ? {
              ...room,
              amenities: room.amenities.includes(amenity)
                ? room.amenities.filter((a) => a !== amenity)
                : [...room.amenities, amenity],
            }
          : room
      )
    );
  };

  const handleRoomImageChange = (index, fileList) => {
    const acceptedFiles = [];
    const rejectedFiles = [];

    for (let file of fileList) {
      if (file.size <= 500 * 1024 && file.type.startsWith("image/")) {
        acceptedFiles.push(file);
      } else {
        rejectedFiles.push(file);
      }
    }

    setRooms((prevRooms) => {
      const updatedRooms = [...prevRooms];
      const existingImages = updatedRooms[index].roomImages || [];
      const combined = [...existingImages, ...acceptedFiles];
      const unique = combined.reduce((acc, curr) => {
        const isDuplicate = acc.find((f) => f.name === curr.name && f.size === curr.size);
        return isDuplicate ? acc : [...acc, curr];
      }, []);
      if (unique.length > 5) {
        alert("You can upload a maximum of 5 images per room.");
      }
      updatedRooms[index].roomImages = unique.slice(0, 5);
      return updatedRooms;
    });

    if (rejectedFiles.length > 0) {
      alert("Some images were skipped because they exceed 500KB.");
    }
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
    setRooms([...rooms, { roomName: "", roomPrice: "", roomDescription: "", roomImages: [], amenities: [] }]);
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
      if (!room.roomName || !room.roomPrice || !room.roomDescription || room.roomImages.length < 3) {
        alert(`Room ${i + 1} is incomplete or missing images.`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("resortImage", resortImage);
    Object.entries(resort).forEach(([key, val]) => formData.append(key, val));
    formData.append(
      "rooms",
      JSON.stringify(
        rooms.map(({ roomName, roomPrice, roomDescription, amenities }) => ({
          roomName,
          roomPrice,
          roomDescription,
          amenities,
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
        <form onSubmit={handleSubmit} className="space-y-5 bg-white p-6 rounded-lg shadow-sm border">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input type="text" name="name" value={resort.name} onChange={handleChange} placeholder="Resort Name" required className="border px-3 py-2 rounded text-sm" />
            <input type="text" name="location" value={resort.location} onChange={handleChange} placeholder="Location" required className="border px-3 py-2 rounded text-sm" />
            <input type="text" name="ownerName" value={resort.ownerName} onChange={handleChange} placeholder="Owner Name" required className="border px-3 py-2 rounded text-sm" /> {/* ✅ Owner name */}
            <input type="number" name="price" value={resort.price} onChange={handleChange} placeholder="Price per night" min="0" required className="border px-3 py-2 rounded text-sm" />
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

                <div>
                  <label className="text-sm font-medium">Select Room Amenities</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AMENITY_OPTIONS.map((amenity) => {
                      const isSelected = room.amenities.includes(amenity);
                      return (
                        <button
                          type="button"
                          key={`${index}-${amenity}`}
                          onClick={() => handleRoomAmenityToggle(index, amenity)}
                          className={`px-4 py-1 text-sm rounded-full border transition-colors duration-150 ${
                            isSelected
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 border-gray-300 hover:bg-blue-50"
                          }`}
                        >
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                </div>

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
