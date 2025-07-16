import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
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
    return Array.from({ length: 5 }, (_, i) =>
      i < rating ? (
        <FaStar key={i} className="text-yellow-400 mr-1" />
      ) : (
        <FaRegStar key={i} className="text-gray-300 mr-1" />
      )
    );
  };

  return (
    <section className="bg-gray-50 py-10 relative">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative mb-6 text-center">
          <h2 className="text-3xl font-semibold">Escape to These Stunning Retreats</h2>
          <p className="text-gray-500">Luxury stays with top-notch amenities and scenic views</p>
          <span
            onClick={() => navigate('/resorts')}
            className="absolute right-0 top-0 text-yellow-600 hover:underline font-medium text-sm cursor-pointer"
          >
            More &rarr;
          </span>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="custom-swiper"
        >
          {featuredResorts.length === 0 ? (
            <p className="text-center text-gray-600">
              No approved resorts available at the moment. Check back later!
            </p>
          ) : (
            featuredResorts.map((retreat) => (
              <SwiperSlide key={retreat._id}>
                <div className="relative group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                  <div className="relative">
                    <img
                      src={`${API_BASE_URL}/api/resorts/image/${encodeURIComponent(retreat.image)}`}
                      alt={retreat.name}
                      className="w-full h-64 object-cover group-hover:brightness-75 transition duration-300"
                    />
                    <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center mb-3">
                      <button
                        className="bg-yellow-400 text-white font-semibold px-4 py-1 rounded-full hover:bg-yellow-500 text-sm"
                        onClick={() => navigate(`/resorts/${retreat._id}`)}
                      >
                        View Details
                      </button>
                    </div>
                    <div
                      className="absolute top-3 right-3 text-xl p-1 bg-white/70 rounded-full cursor-pointer hover:scale-110 transition"
                      onClick={() => toggleFavorite(retreat._id)}
                    >
                      <FaHeart
                        className={favorites.includes(retreat._id) ? 'text-red-500' : 'text-gray-400'}
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-lg font-bold mb-1 hover:scale-105 hover:text-yellow-600 transition-all duration-300">
                      {retreat.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 mb-1">
                      <FaMapMarkerAlt className="mr-1 text-red-400" />
                      <span>{retreat.location}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">${retreat.price}/night</p>
                    <div className="flex items-center mb-2">{renderStars(retreat.rating || 4)}</div>
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

        {/* Custom Styles for Pagination */}
        <style>
          {`
            .swiper-pagination {
              margin-top: 20px !important;
              position: relative;
              text-align: center;
            }
            .swiper-pagination-bullet {
              background-color: black !important;
              opacity: 0.5;
              width: 10px;
              height: 10px;
              margin: 0 5px !important;
            }
            .swiper-pagination-bullet-active {
              opacity: 1;
              transform: scale(1.2);
            }
          `}
        </style>
      </div>
    </section>
  );
};

export default FeaturedRetreatsCarousel;
