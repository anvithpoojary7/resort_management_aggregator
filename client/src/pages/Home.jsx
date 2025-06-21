import React, { useState, useEffect } from 'react';
import ResortSearchBar from '../components/ResortSearchBar';
import TopDealsCarousel from '../components/TopDealsCarousel';
import AmenityCarousel from '../components/AmenityCarousel';
import FeaturedRetreatsCarousel from '../components/FeaturedRetreatsCarousel';

const Home = () => {
  const [resorts, setResorts] = useState([]);
  const backgrounds = ['/resortpic.jpg', '/resort2.jpg', '/resort3.webp'];
  const [current, setCurrent] = useState(0);

  // Fetch resorts from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/resorts')
      .then((res) => res.json())
      .then((data) => setResorts(data))
      .catch((err) => console.error('Error fetching resorts:', err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % backgrounds.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Slideshow Section */}
      <div className="relative w-full h-[500px] overflow-hidden">
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${backgrounds[current]})` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-4xl font-bold mb-2">Explore Luxury Resorts</h1>
          <p className="text-lg">Find the perfect escape for your next vacation</p>
        </div>
      </div>

      {/* Resort Data Section */}
      <div className="px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Top Resorts</h2>
        <ul className="space-y-2">
          {resorts.map((resort, index) => (
            <li key={index} className="bg-white shadow p-4 rounded">
              <h3 className="text-xl font-semibold">{resort.name}</h3>
              <p className="text-gray-600">{resort.location}</p>
              <p className="text-yellow-600">⭐ {resort.rating}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Other Sections */}
      <div className="w-full bg-white py-4 z-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <ResortSearchBar />
        </div>
      </div>
      <div className="w-full bg-white py-12 px-4">
        <TopDealsCarousel />
      </div>
      <section className="bg-yellow-50 py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Your Stay. Your Vibe.
          </h2>
          <p className="text-lg text-gray-600 font-[cursive] leading-relaxed">
            Weekend trip? Bestie getaway? Family chill time? We’ve got stays that match your mood — beachy, bougie, or blissfully remote.
          </p>
        </div>
      </section>
      <div className="py-10"><AmenityCarousel/></div>
      <div><FeaturedRetreatsCarousel/></div>
      <section className="bg-yellow-50 py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Built on Trust. Backed by Experience.
          </h2>
          <p className="text-lg text-gray-600 font-[cursive] leading-relaxed">
            Every listing is handpicked, verified, and reviewed because your time off deserves the highest standards.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
