import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaStar, FaRegStar, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const FeaturedRetreatsCarousel = () => {
  const [featuredResorts, setFeaturedResorts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    const fetchApprovedResorts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/resorts/admin/resorts`);
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Raw error response for fetching featured resorts:', errorText);
          throw new Error(`HTTP error! status: ${res.status}, response: ${errorText.substring(0, 100)}...`);
        }
        const data = await res.json();
        setFeaturedResorts(data.slice(0, 6));
      } catch (err) {
        console.error('Error fetching featured resorts:', err);
      }
    };

    fetchApprovedResorts();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        i < rating ? (
          <FaStar key={i} className="text-yellow-400 mr-1" />
        ) : (
          <FaRegStar key={i} className="text-gray-300 mr-1" />
        )
      );
    }
    return stars;
  };

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative mb-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">Escape to These Stunning Retreats</h2>
            <p className="text-gray-500">Luxury stays with top-notch amenities and scenic views</p>
          </div>
          <span
            onClick={() => navigate('/resorts')}
            className="absolute right-0 top-0 text-yellow-600 hover:underline font-medium text-sm cursor-pointer"
          >
            More &rarr;
          </span>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {featuredResorts.length === 0 ? (
            <p className="text-center text-gray-600">
              No approved resorts available at the moment. Check back later!
            </p>
          ) : (
            featuredResorts.map((retreat) => (
              <SwiperSlide key={retreat._id}>
                <div className="relative group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                  {/* Image container */}
                  <div className="relative">
                    <img
                      src={`${API_BASE_URL}/api/resorts/image/${encodeURIComponent(retreat.image)}`}
                      alt={retreat.name}
                      className="w-full h-64 object-cover group-hover:brightness-75 transition duration-300"
                    />

                    {/* View Details on hover */}
                    <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center mb-3">
                      <button
                        className="bg-yellow-400 text-white font-semibold px-4 py-1 rounded-full hover:bg-yellow-500 text-sm"
                        onClick={() => navigate(`/resorts/${retreat._id}`)}
                      >
                        View Details
                      </button>
                    </div>

                    {/* Favorite toggle */}
                    <div
                      className="absolute top-3 right-3 text-xl p-1 bg-white/70 rounded-full cursor-pointer hover:scale-110 transition"
                      onClick={() => toggleFavorite(retreat._id)}
                    >
                      <FaHeart
                        className={favorites.includes(retreat._id) ? 'text-red-500' : 'text-gray-400'}
                      />
                    </div>
                  </div>

                  {/* Resort Details */}
                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1">{retreat.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <FaMapMarkerAlt className="mr-1 text-red-400" />
                      <span>{retreat.location}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">${retreat.price}/night</p>
                    <div className="flex items-center mb-2">
                      {renderStars(retreat.rating || 4)}
                    </div>
                    <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                      {Array.isArray(retreat.amenities) &&
                        retreat.amenities.map((amenity, i) => (
                          <span key={i} className="bg-gray-100 px-2 py-1 rounded-md">
                            {amenity}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))
          )}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedRetreatsCarousel;
