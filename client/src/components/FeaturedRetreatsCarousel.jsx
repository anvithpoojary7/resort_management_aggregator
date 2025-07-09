import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaMapMarkerAlt, FaStar, FaRegStar, FaHeart } from 'react-icons/fa';

const API_BASE_URL = 'http://localhost:8080';

const ResortList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const query = {
    location: params.get('location') || '',
    checkIn: params.get('checkIn'),
    checkOut: params.get('checkOut'),
    petFriendly: params.has('petFriendly'),
    sort: params.get('sort') || '',
    maxPrice: params.get('maxPrice') || '',
    adults: Number(params.get('adults') || 0),
    children: Number(params.get('children') || 0),
    rooms: Number(params.get('rooms') || 0),
  };

  const [resorts, setResorts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  // Fetch resorts
  useEffect(() => {
    const fetchResorts = async () => {
      try {

        const qs = new URLSearchParams(query).toString();
        const res = await fetch(`${API_BASE_URL}/api/resortsearch/search?${qs}`);
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
  }, [location.search]);

  // Fetch wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/wishlist/status`, {
          credentials: 'include',
        });
        if (!res.ok) return;
        const data = await res.json();
        setWishlist(data.map((id) => id.toString())); // Normalize to string
      } catch (e) {
        console.error('Wishlist fetch failed:', e.message);
      }
    };
    fetchWishlist();
  }, []);

  // Toggle Wishlist
  const toggleWishlist = async (resortId, e) => {
    e.stopPropagation(); // Prevent card click navigation

    const isWishlisted = wishlist.includes(resortId);
    const method = isWishlisted ? 'DELETE' : 'POST';

    try {
      const res = await fetch(`${API_BASE_URL}/api/wishlist/${resortId}`, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setWishlist((prev) =>
          isWishlisted ? prev.filter((id) => id !== resortId) : [...prev, resortId]
        );
      } else {
        const data = await res.json();
        alert(data.message || 'Please log in to use wishlist');
      }
    } catch (err) {
      console.error('Error updating wishlist:', err);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading resorts…</p>;
  if (err) return <p className="text-center text-red-500 mt-10">{err}</p>;

  return (
    <section className="bg-gray-50 py-10 min-h-screen">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-2xl font-semibold mb-6">All Resorts</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {resorts.length ? resorts.map((r) => (
            <div key={r._id}
              onClick={() => navigate(`/resorts/${r._id}`)}
              className="relative cursor-pointer bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition"
            >
              <img
                src={`${API_BASE_URL}/api/resorts/image/${r.image}`}
                alt={r.name}
                className="h-56 w-full object-cover"
              />

<<<<<<< HEAD
                  {/* Image container with hover dark overlay */}
                  <div className="relative">
                    <img
                      src={`${API_BASE_URL}/api/resorts/image/${encodeURIComponent(retreat.image)}`}
                      alt={retreat.name}
                      className="w-full h-64 object-cover group-hover:brightness-75 transition duration-300" // Corrected
                    />

                  
                    <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center mb-3">
                      <button
                        className="bg-yellow-400 text-white font-semibold px-4 py-1 rounded-full hover:bg-yellow-500 text-sm" // Corrected
                        onClick={() => navigate(`/resorts/${retreat._id}`)}
                      >
                        View Details
                      </button>
                    </div>

           
                    <div
                      className="absolute top-3 right-3 text-xl p-1 bg-white/70 rounded-full cursor-pointer hover:scale-110 transition" // Corrected
                      onClick={() => toggleFavorite(retreat._id)}
                    >
                      <FaHeart
                        className={favorites.includes(retreat._id) ? 'text-red-500' : 'text-gray-400'} // Corrected
                      />
                    </div>
                  </div>

                
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">{retreat.name}</h3>

                 
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <FaMapMarkerAlt className="mr-1 text-red-400" /> {/* Corrected */}
                      <span>{retreat.location}</span>
                    </div>

                    <p className="text-sm text-gray-600 mb-2">${retreat.price}/night</p>

                   
                    <div className="flex items-center mb-2">
                        {renderStars(retreat.rating || 4)} {/* Assuming a default rating of 4 if not provided */}
                    </div>

                    {/* Amenities */}
                    <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                      {retreat.amenities && Array.isArray(retreat.amenities) && retreat.amenities.map((amenity, i) => ( // Added Array.isArray check
                        <span key={i} className="bg-gray-100 px-2 py-1 rounded-md">{amenity}</span> // Corrected
                      ))}
                    </div>
                  </div>
=======
              {/* Heart icon */}
              <button
                onClick={(e) => toggleWishlist(r._id, e)}
                className="absolute top-3 right-3 text-xl p-1 bg-white/80 rounded-full z-10 hover:scale-110 transition"
              >
                <FaHeart className={wishlist.includes(r._id) ? 'text-red-500' : 'text-gray-400'} />
              </button>

              <div className="p-4">
                <h2 className="text-lg font-bold">{r.name}</h2>
                <div className="flex items-center text-sm text-gray-500 mt-1 mb-2">
                  <FaMapMarkerAlt className="mr-1 text-red-400" />
                  <span>{r.location}</span>
>>>>>>> 133de5f6e210dc3e94f96ff3cf315ea8905fa854
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
