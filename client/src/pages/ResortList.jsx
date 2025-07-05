import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaRegStar } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8080';

const ResortList = () => {
  const navigate  = useNavigate();
  const location  = useLocation();
  const params    = new URLSearchParams(location.search);

 
  const query = {
    location:    params.get('location')   || '',
    checkIn:     params.get('checkIn'),
    checkOut:    params.get('checkOut'),
    petFriendly: params.has('petFriendly'),
    sort:        params.get('sort')       || '',
    maxPrice:    params.get('maxPrice')   || '',
    adults:      Number(params.get('adults')   || 0),
    children:    Number(params.get('children') || 0),
    rooms:       Number(params.get('rooms')    || 0),
  };

  const [resorts, setResorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  useEffect(() => {
    const fetchResorts = async () => {
      try {
        const qs   = new URLSearchParams(query).toString();
        const res  = await fetch(`${API_BASE_URL}/api/resortsearch/search?${qs}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        setResorts(await res.json());
      } catch (e) {
        console.error(e);
        setErr('Could not load resorts. Try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchResorts();
  }, [location.search]);      // refetch if query‑string changes

  if (loading) return <p className="text-center mt-10">Loading resorts…</p>;
  if (err)     return <p className="text-center text-red-500 mt-10">{err}</p>;

  return (
    <section className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">All Resorts</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resorts.length ? resorts.map((r) => (
            <div key={r._id} onClick={() => navigate(`/resorts/${r._id}`)}
                 className="cursor-pointer bg-white rounded-xl shadow
                            hover:shadow-lg overflow-hidden transition">
              <img src={`${API_BASE_URL}/api/resorts/image/${r.image}`}
                   alt={r.name} className="h-56 w-full object-cover" />
              <div className="p-4">
                <h2 className="text-lg font-bold">{r.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                  <FaMapMarkerAlt className="mr-1 text-red-400" />
                  <span>{r.location}</span>
                </div>
                <p className="text-sm text-gray-600 mb-1">₹{r.price}/night</p>
                <p className="text-xs text-gray-400 mb-2">
                  {(r.amenities || []).join(', ')}
                </p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) =>
                    i < (r.rating || 4)
                      ? <FaStar key={i} className="text-yellow-400 mr-1" />
                      : <FaRegStar key={i} className="text-gray-300 mr-1" />
                  )}
                </div>
              </div>
            </div>
          )) : (
            <p className="text-gray-600 col-span-full">No resorts match your filters.</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResortList;
