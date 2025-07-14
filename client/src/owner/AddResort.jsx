import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:8080";

const AddResort = () => {
  const navigate = useNavigate();
  const currentOwnerId = JSON.parse(localStorage.getItem("user"))?.id;

  const [loading, setLoading] = useState(true);
  // resortStatus state will still be updated, but not directly used for rendering
  // a specific "pending" message within this component.
  const [resortStatus, setResortStatus] = useState(null); 
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
    {
      roomName: "",
      roomPrice: "",
      roomDescription: "",
      roomImages: [], // This will store File objects
    },
    {
      roomName: "",
      roomPrice: "",
      roomDescription: "",
      roomImages: [], // This will store File objects
    },
  ]);

  useEffect(() => {
    if (!currentOwnerId) {
      navigate("/login");
      return;
    }

    const checkStatusAndRedirect = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resorts/owner/${currentOwnerId}`);
        const data = await res.json();

        if (data && data._id) {
          // If a resort exists for this owner (regardless of its status),
          // immediately navigate them to their dashboard.
          // The dashboard component should then handle displaying the specific status (pending, approved, rejected).
          setResortStatus(data.status); // Still set the status, might be useful for debugging or future logic
          navigate("/owner/dashboard", { replace: true });
        } else {
          // No resort found for this owner, allow them to add one.
          setResortStatus("none"); 
        }
      } catch (err) {
        console.error("Error checking resort status:", err);
        // On error, assume no resort exists or we can't verify, so allow adding.
        setResortStatus("none"); 
      } finally {
        setLoading(false);
      }
    };

    checkStatusAndRedirect();
  }, [currentOwnerId, navigate]);

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
      // Concatenate the new files with the existing files for the specific room
      const combinedFiles = [...updated[index].roomImages, ...newFiles];

      // Deduplicate files to prevent adding the exact same file twice
      const uniqueFiles = combinedFiles.reduce((acc, current) => {
        const x = acc.find(item => item.name === current.name && item.size === current.size);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);

      // Ensure we don't exceed the 5 image limit
      if (uniqueFiles.length > 5) {
        alert(`You can select a maximum of 5 images per room. Only the first 5 will be kept for Room ${index + 1}.`);
        updated[index].roomImages = uniqueFiles.slice(0, 5); // Take only the first 5
      } else {
        updated[index].roomImages = uniqueFiles;
      }

      return updated;
    });
  };

  const addNewRoom = () => {
    if (rooms.length >= 5) {
      alert("You can add a maximum of 5 rooms.");
      return;
    }
    setRooms([...rooms, {
      roomName: "",
      roomPrice: "",
      roomDescription: "",
      roomImages: [],
    }]);
  };

  const removeRoom = (index) => {
    if (rooms.length <= 2) {
      alert("At least 2 rooms are required.");
      return;
    }
    const updated = [...rooms];
    updated.splice(index, 1);
    setRooms(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resortImage) {
      alert("Main resort image is required.");
      return;
    }

    if (rooms.length < 2 || rooms.length > 5) {
      alert("You must add between 2 and 5 rooms.");
      return;
    }

    for (let i = 0; i < rooms.length; i++) {
      const room = rooms[i];
      if (
        !room.roomName ||
        !room.roomPrice ||
        !room.roomDescription ||
        room.roomImages.length < 2 ||
        room.roomImages.length > 5
      ) {
        alert(`Room ${i + 1} must have all details and 2 to 5 images. Currently selected: ${room.roomImages.length}`);
        return;
      }
    }

    const formData = new FormData();
    formData.append("resortImage", resortImage);

    Object.entries(resort).forEach(([key, val]) =>
      formData.append(key, key === "amenities" ? JSON.stringify(val) : val)
    );
    formData.append("ownerId", currentOwnerId);

    // Append room data (excluding images for now, as they are appended separately)
    formData.append("rooms", JSON.stringify(
      rooms.map(({ roomName, roomPrice, roomDescription }) => ({
        roomName,
        roomPrice,
        roomDescription,
      }))
    ));

    // Append room images
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

      const text = await res.text(); // Get raw text to handle potential empty responses
      const body = text ? JSON.parse(text) : {}; // Parse if not empty

      if (res.ok) {
        alert("Resort submitted successfully and is pending review!");
        navigate("/owner/dashboard", { replace: true }); // Redirect to dashboard after successful submission
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

  // If resortStatus is not "none", it means a resort was found and the user
  // should have already been redirected to the dashboard.
  // This ensures the form is only shown if no resort exists.
  if (resortStatus !== "none") {
    // This case should ideally not be reached if the useEffect logic works correctly
    // But it's a fallback to prevent rendering the form if a redirect was intended.
    return null; 
  }

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Add New Resort Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <label className="block mb-1">Main Resort Image *</label>
          <input type="file" accept="image/*" required onChange={(e) => setResortImage(e.target.files[0])} className="w-full border px-4 py-2 rounded" />
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">Room Details</h3>
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
  );
};

export default AddResort;