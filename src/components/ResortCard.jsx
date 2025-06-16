import React from 'react';
import { Link } from 'react-router-dom';

const ResortCard = ({ resort }) => {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">{resort.name}</h2>
      <p className="text-gray-600 mb-1">Amenities: {resort.amenities.join(', ')}</p>
      <p className="text-blue-600 font-bold mb-3">₹{resort.price} / night</p>
      <Link
        to={`/resorts/${resort.id}`}
        className="inline-block text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View Details
      </Link>
    </div>
  );
};

export default ResortCard;
