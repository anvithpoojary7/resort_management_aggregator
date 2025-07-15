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
    <section className="bg-gradient-to-b from-yellow-50 to-white py-16 px-4">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
      Your Stay. <span className="text-yellow-500">Your Vibe.</span>
    </h2>
    <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-4">
      Weekend trip? Bestie getaway? Family chill time? We've got stays that match your mood —
      <span className="font-medium"> beachy, bougie, or blissfully remote</span>.
      Verified spots, quick booking, and no stress.
    </p>
    <p className="text-lg sm:text-xl text-gray-600">
      Just pack your bags and vibe out.
      <span className="inline-block ml-2 animate-bounce">🧳🌴✨</span>
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

     
     <section className="bg-gradient-to-b from-yellow-50 to-white py-16 px-4">
  <div className="max-w-4xl mx-auto text-center">
    <h2 className="text-4xl sm:text-5xl font-bold text-gray-800 mb-6">
      Built on <span className="text-yellow-500">Trust</span>. Backed by Experience.
    </h2>
    <p className="text-lg sm:text-xl text-gray-600 font-[cursive] leading-relaxed">
      Every listing is handpicked, verified, and reviewed because your time off deserves the highest standards.
    </p>
    <p className="text-lg sm:text-xl text-gray-600 font-[cursive] leading-relaxed mt-2">
      Travel smart. Stay assured. ✅🧳
    </p>
  </div>
</section>

    </div>
  );
};

export default Home;