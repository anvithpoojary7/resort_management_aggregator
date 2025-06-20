import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ResortDetail = () => {
  const { id } = useParams();
  const [resort, setResort] = useState(null);

  useEffect(() => {
    fetch(`/api/resorts/${id}`)
      .then((res) => res.json())
      .then((data) => setResort(data))
      .catch((err) => console.error('Error:', err));
  }, [id]);

  if (!resort) return <div className="p-6">Loading resort details...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <img
        src={resort.image}
        alt={resort.name}
        className="w-full h-96 object-cover rounded-lg"
      />
      <h2 className="text-3xl font-bold mt-4">{resort.name}</h2>
      <p className="text-gray-500">{resort.place}</p>
      <p className="text-lg font-semibold mt-2">{resort.price}</p>
      <div className="mt-4">
        <h3 className="font-bold">Amenities:</h3>
        <ul className="list-disc list-inside text-gray-700">
          {resort.amenities.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ResortDetail;
