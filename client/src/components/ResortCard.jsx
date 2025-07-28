// src/components/ResortCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaRegStar, FaHeart, FaMapMarkerAlt } from 'react-icons/fa';

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://resort-finder-2aqp.onrender.com'
  : 'http://localhost:8080';

const ResortCard = ({ resort, isWishlisted, onToggleWishlist, isLoadingToggle = false }) => {
  const navigate = useNavigate();

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (onToggleWishlist) {
      onToggleWishlist(resort._id);
    }
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
    <div
      className="relative group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 cursor-pointer"
      // CORRECTED: Wrapped the navigation path in backticks to create a valid string.
      onClick={() => navigate(`/resorts/${resort._id}`)}
    >
      <div className="relative">
        {/* Image */}
        {resort.image && (
          <img
            // CORRECTED: Wrapped the URL in `{` and backticks for a valid JSX expression.
            src={`${API_BASE_URL}/api/resorts/image/${encodeURIComponent(resort.image)}`}
            alt={resort.name}
            className="w-full h-64 object-cover group-hover:brightness-75 transition duration-300"
          />
        )}

        {/* View Details Button on Hover */}
        <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition duration-300 flex justify-center mb-3">
          <button
            className="bg-yellow-400 text-white font-semibold px-4 py-1 rounded-full hover:bg-yellow-500 text-sm"
            onClick={(e) => {
              e.stopPropagation();
              // CORRECTED: Wrapped the navigation path in backticks here as well.
              navigate(`/resorts/${resort._id}`);
            }}
          >
            View Details
          </button>
        </div>

        {/* Heart button for wishlist */}
        <button
          className="absolute top-3 right-3 text-xl p-1 bg-white/70 rounded-full cursor-pointer hover:scale-110 transition"
          onClick={handleHeartClick}
          disabled={isLoadingToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isLoadingToggle ? (
            <FaHeart className="text-gray-400 animate-pulse" />
          ) : (
            <FaHeart
              className={isWishlisted ? 'text-red-500' : 'text-gray-400'}
            />
          )}
        </button>
      </div>

      <div className="p-4">
        <h3 className="text-lg font-bold mb-1 hover:scale-105 hover:text-yellow-600 transition-all duration-300">
          {resort.name}
        </h3>
        {/* Location */}
        {resort.location && (
          <div className="flex items-center text-sm text-gray-500 mb-1">
            <FaMapMarkerAlt className="mr-1 text-red-400" />
            <span>{resort.location}</span>
          </div>
        )}
        <p className="text-sm text-gray-600 mb-2">₹{resort.price}/night</p>
        {/* Rating */}
        {resort.rating && (
          <div className="flex items-center mb-2">{renderStars(resort.rating)}</div>
        )}
        <div className="text-sm text-gray-500 flex flex-wrap gap-2">
          {Array.isArray(resort.amenities) &&
            resort.amenities.map((amenity, i) => (
              <span key={i} className="bg-gray-100 px-2 py-1 rounded-md">
                {amenity}
              </span>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ResortCard;