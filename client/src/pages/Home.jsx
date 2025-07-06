// Home.jsx (no changes needed from previous step if already applied)
import React, { useState, useEffect } from 'react';
import ResortSearchBar from '../components/ResortSearchBar';
import TopDealsCarousel from '../components/TopDealsCarousel';
import AmenityCarousel from '../components/AmenityCarousel';
import FeaturedRetreatsCarousel from '../components/FeaturedRetreatsCarousel';

const Home = () => {
  const backgrounds = ['/resortpic.jpg', '/resort2.jpg', '/resort3.webp'];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % backgrounds.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Slideshow Section - pt-20 is crucial here to prevent content hiding under fixed navbar */}
      <div className="relative w-full h-[500px] overflow-hidden pt-20"> {/* This pt-20 is necessary */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-center transition-all duration-1000"
          style={{ backgroundImage: `url(${backgrounds[current]})` }}
        ></div>
        <div className="absolute top-0 left-0 w-full h-full bg-black/50"></div>

        {/* Text Overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-4xl font-bold mb-2">Explore Luxury Resorts</h1>
          <p className="text-lg">
            Find the perfect escape for your next vacation
          </p>
        </div>
      </div>

      {/* Search Bar Section */}
      <section className="w-full bg-white py-4 z-20 relative">
        <div className="max-w-6xl mx-auto px-4">
          <ResortSearchBar />
        </div>
      </section>

      {/* Top Deals Carousel */}
      <section className="w-full bg-white py-12 px-4">
        <TopDealsCarousel />
      </section>

      {/* Mood-Based Highlight Section */}
      <section className="bg-yellow-50 py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Your Stay. Your Vibe.
          </h2>
          <p className="text-lg text-gray-600 font-[cursive] leading-relaxed">
            Weekend trip? Bestie getaway? Family chill time? We’ve got stays that match your mood —
            beachy, bougie, or blissfully remote. Verified spots, quick booking, and no stress.
            Just pack your bags and vibe out. 💼🌴✨
          </p>
        </div>
      </section>

      {/* Amenity Carousel */}
      <section className="py-10">
        <AmenityCarousel />
      </section>

  
      <section className="py-10">
        <FeaturedRetreatsCarousel />
      </section>

     
      <section className="bg-yellow-50 py-12">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">
            Built on Trust. Backed by Experience.
          </h2>
          <p className="text-lg text-gray-600 font-[cursive] leading-relaxed">
            Every listing is handpicked, verified, and reviewed because your time off deserves the highest standards.
            Travel smart. Stay assured.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;