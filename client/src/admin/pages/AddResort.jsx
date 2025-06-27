import React, { useState } from 'react';

const AddResort = () => {
  const [resortInfo, setResortInfo] = useState({
    name: '',
    location: '',
    price: '',
    description: '',
    ownerName: '',
    email: '',
    phone: '',
    amenities: [''],
    images: ['']
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setResortInfo({ ...resortInfo, [name]: value });
  };

  const handleArrayChange = (field, index, value) => {
    const updated = [...resortInfo[field]];
    updated[index] = value;
    setResortInfo({ ...resortInfo, [field]: updated });
  };

  const addField = (field) => {
    setResortInfo({ ...resortInfo, [field]: [...resortInfo[field], ''] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted resort:', resortInfo);
    // You can send this to MongoDB here
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-2">Add New Resort</h1>
      <p className="text-gray-500 mb-6">Create a new resort listing for the platform</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Resort Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🏠 Resort Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input name="name" value={resortInfo.name} onChange={handleChange} placeholder="Resort Name *" className="input" required />
            <input name="location" value={resortInfo.location} onChange={handleChange} placeholder="Location *" className="input" required />
            <input type="number" name="price" value={resortInfo.price} onChange={handleChange} placeholder="Price per Night *" className="input" required />
          </div>
          <textarea name="description" value={resortInfo.description} onChange={handleChange} placeholder="Description" className="textarea mt-4" />
        </div>

        {/* Owner Info */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">👤 Owner Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input name="ownerName" value={resortInfo.ownerName} onChange={handleChange} placeholder="Owner Name *" className="input" required />
            <input name="email" value={resortInfo.email} onChange={handleChange} placeholder="Email Address *" className="input" type="email" required />
            <input name="phone" value={resortInfo.phone} onChange={handleChange} placeholder="Phone Number" className="input" />
          </div>
        </div>

        {/* Amenities */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🛎️ Amenities</h2>
          {resortInfo.amenities.map((amenity, idx) => (
            <input
              key={idx}
              value={amenity}
              onChange={(e) => handleArrayChange('amenities', idx, e.target.value)}
              placeholder="Enter amenity"
              className="input mb-2"
            />
          ))}
          <button type="button" onClick={() => addField('amenities')} className="text-blue-600 hover:underline mt-1">+ Add Amenity</button>
        </div>

        {/* Resort Images */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">🖼️ Resort Images</h2>
          {resortInfo.images.map((img, idx) => (
            <input
              key={idx}
              value={img}
              onChange={(e) => handleArrayChange('images', idx, e.target.value)}
              placeholder="Enter image URL"
              className="input mb-2"
            />
          ))}
          <button type="button" onClick={() => addField('images')} className="text-blue-600 hover:underline mt-1">+ Add Image URL</button>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button type="reset" className="px-4 py-2 border rounded mr-2">Cancel</button>
          <button type="submit" className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-4 py-2 rounded shadow">Add Resort</button>
        </div>
      </form>
    </div>
  );
};

export default AddResort;
