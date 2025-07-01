// ModerationPage.jsx
import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaUser, FaCalendarAlt, FaEye } from 'react-icons/fa';
import Sidebar from '../components/Sidebar'; // ✅ Add sidebar

const resorts = [
  {
    id: 1,
    name: 'Ocean Breeze Villa',
    location: 'Malibu, California',
    price: 650,
    owner: 'Michael Rodriguez',
    date: 'Feb 10, 2024',
    description: 'Stunning oceanfront villa with panoramic views, private beach access, and luxury amenities. Perfect for...',
    image: 'https://i.imgur.com/XOw3TGD.jpg',
  },
  {
    id: 2,
    name: 'Mountain Peak Lodge',
    location: 'Aspen, Colorado',
    price: 480,
    owner: 'Sarah Thompson',
    date: 'Feb 8, 2024',
    description: 'Cozy mountain lodge with breathtaking views, ski-in/ski-out access, and rustic charm. Ideal for winter...',
    image: 'https://i.imgur.com/mI0vQoA.jpg',
  },
  {
    id: 3,
    name: 'Desert Oasis Resort',
    location: 'Scottsdale, Arizona',
    price: 380,
    owner: 'James Wilson',
    date: 'Feb 12, 2024',
    description: 'Luxurious desert resort with spa services, golf course access, and stunning sunset views. Perfect for...',
    image: 'https://i.imgur.com/HfcuK7W.jpg',
  },
];

const ModerationPage = () => {
  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* ✅ Sidebar */}
      <Sidebar />

      {/* ✅ Main Content */}
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Resort Moderation</h1>
            <p className="text-gray-600">Review and approve pending resort listings</p>
          </div>
          <div className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold">
            {resorts.length} Pending
          </div>
        </div>

        {/* Search + Filters */}
        <div className="flex gap-3 mb-8">
          <input
            type="text"
            placeholder="Search resorts, owners, or locations..."
            className="flex-1 p-3 rounded-lg shadow-sm border border-gray-200 focus:ring focus:ring-blue-200"
          />
          <button className="bg-white border border-gray-300 rounded-lg px-4 py-2 font-medium shadow-sm">
            Filters
          </button>
        </div>

        {/* Resort Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {resorts.map((resort) => (
            <div
              key={resort.id}
              className="bg-white rounded-xl shadow hover:shadow-md transition duration-200 overflow-hidden relative"
            >
              <img src={resort.image} alt={resort.name} className="h-48 w-full object-cover" />
              <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-sm px-3 py-1 rounded-full font-medium">
                Pending
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold text-gray-800">{resort.name}</h2>
                  <p className="text-md font-bold text-gray-900">${resort.price}</p>
                </div>
                <div className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                  <FaMapMarkerAlt className="text-gray-500" />
                  {resort.location}
                </div>
                <div className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                  <FaUser className="text-gray-500" />
                  {resort.owner}
                </div>
                <div className="text-gray-600 text-sm flex items-center gap-2 mt-1">
                  <FaCalendarAlt className="text-gray-500" />
                  Submitted {resort.date}
                </div>
                <p className="text-sm text-gray-700 mt-3">{resort.description}</p>

                <div className="flex justify-between items-center mt-4">
                  <button className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
                    <FaEye />
                    View Details
                  </button>
                  <div className="flex gap-2">
                    <button className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full">
                      ❌
                    </button>
                    <button className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full">
                      ✔️
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ModerationPage;
