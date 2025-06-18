import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { FaStar, FaRegStar, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';

const retreats = [
  {
    id: 1,
    name: 'Serenity Bay Resort',
    place: 'Goa',
    price: '₹7,500/night',
    rating: 4,
    amenities: ['WiFi', 'Pool', 'Breakfast'],
    image: '/c4.jpg',
  },
  {
    id: 2,
    name: 'Mountain View Inn',
    place: 'Manali',
    price: '₹5,200/night',
    rating: 3,
    amenities: ['WiFi', 'Hiking', 'Pet Friendly'],
    image: '/c1.jpg',
  },
  {
    id: 3,
    name: 'Lakeside Paradise',
    place: 'Udaipur',
    price: '₹8,100/night',
    rating: 5,
    amenities: ['Spa', 'Lake View', 'Gym'],
    image: '/c2.jpg',
  },
  {
    id: 4,
    name: 'Royal Garden Stay',
    place: 'Ooty',
    price: '₹6,800/night',
    rating: 4,
    amenities: ['Gym', 'Parking', 'Breakfast'],
    image: '/c3.jpg',
  },
];

const FeaturedRetreatsCarousel = () => {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <section className="bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="relative mb-6">
          <div className="text-center">
            <h2 className="text-3xl font-semibold">Escape to These Stunning Retreats</h2>
            <p className="text-gray-500">Luxury stays with top-notch amenities and scenic views</p>
          </div>
          <a
            href="#"
            className="absolute right-0 top-0 text-yellow-600 hover:underline font-medium text-sm"
          >
            More &rarr;
          </a>
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
          {retreats.map((retreat) => (
            <SwiperSlide key={retreat.id}>
              <div className="relative group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300">
                
                {/* Image container with hover dark overlay */}
                <div className="relative">
                  <img
                    src={retreat.image}
                    alt={retreat.name}
                    className="w-full h-64 object-cover group-hover:brightness-75 transition duration-300"
                  />

                  {/* View Details Button */}
                  <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center mb-3">
                    <button className="bg-yellow-400 text-white font-semibold px-4 py-1 rounded-full hover:bg-yellow-500 text-sm">
                      View Details
                    </button>
                  </div>

                  {/* Favorite Heart */}
                  <div
                    className="absolute top-3 right-3 text-xl p-1 bg-white/70 rounded-full cursor-pointer hover:scale-110 transition"
                    onClick={() => toggleFavorite(retreat.id)}
                  >
                    <FaHeart
                      className={favorites.includes(retreat.id) ? 'text-red-500' : 'text-gray-400'}
                    />
                  </div>
                </div>

                {/* Resort Info */}
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-1">{retreat.name}</h3>

                  {/* Location with icon */}
                  <div className="flex items-center text-sm text-gray-500 mb-1">
                    <FaMapMarkerAlt className="mr-1 text-red-400" />
                    <span>{retreat.place}</span>
                  </div>

                  <p className="text-sm text-gray-600 mb-2">{retreat.price}</p>

                  {/* Star Rating */}
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, i) =>
                      i < retreat.rating ? (
                        <FaStar key={i} className="text-yellow-400 mr-1" />
                      ) : (
                        <FaRegStar key={i} className="text-gray-300 mr-1" />
                      )
                    )}
                  </div>

                  {/* Amenities */}
                  <div className="text-sm text-gray-500 flex flex-wrap gap-2">
                    {retreat.amenities.map((amenity, i) => (
                      <span key={i} className="bg-gray-100 px-2 py-1 rounded-md">{amenity}</span>
                    ))}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default FeaturedRetreatsCarousel;


