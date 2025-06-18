import React from 'react';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ResortDetails = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded mt-10">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Resort #{id} Details</h2>
      <p className="text-gray-700 mb-2">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eget lorem a justo mollis convallis.
      </p>
      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Book Now
      </button>
      <div className="mt-6">
        <Link to="/login" className="text-sm text-blue-600 hover:underline">
      Already have an account? Login
        </Link>
    </div>
    </div>
  );
};

export default ResortDetails;
