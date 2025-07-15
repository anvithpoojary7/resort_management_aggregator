import React from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaUser, FaGlobe } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Header = ({ onMenuClick }) => {
  const { isLoggedIn, user } = useAuth();

  const getInitial = (name) => (name ? name[0].toUpperCase() : '');

  return (
    <div className="flex justify-between items-center w-full">
      <Link to="/" className="text-xl font-bold text-blue-600">ResortFinder</Link>
      <div className="flex items-center gap-4">
        <Link to="/auth?role=owner" className="text-black font-medium hover:bg-gray-100 py-2 px-3 rounded-full transition-colors duration-200">Become a host</Link>
        <button className="text-gray-700 hover:bg-gray-100 p-3 rounded-full transition-colors duration-200"><FaGlobe className="text-xl" /></button>
        <button onClick={onMenuClick} className="flex items-center gap-2 border rounded-full py-2 px-3 shadow-md hover:shadow-lg transition-shadow duration-200">
          <FaBars className="text-lg text-gray-700" />
          {isLoggedIn && user ? (
            user.profileImage ? (
              <img src={user.profileImage} alt="User" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 bg-gray-200 text-gray-700 rounded-full flex items-center justify-center text-sm font-semibold uppercase">
                {getInitial(user.name)}
              </div>
            )
          ) : (
            <FaUser className="text-xl text-gray-700" />
          )}
        </button>
      </div>
    </div>
  );
};

export default Header;