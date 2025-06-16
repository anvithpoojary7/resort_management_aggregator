import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const amenities = [
  {
    title: "Infinity Pool",
    description: "Dive into luxury with our temperature-controlled infinity pool.",
    image: "/a1.jpg",
  },
  {
    title: "Wellness Programs",
    description: "Balance your mind and body with curated wellness sessions.",
    image: "/a2.jpg",
  },
  {
    title: "Luxury Spa",
    description: "Relax, unwind, and rejuvenate with signature therapies.",
    image: "/a3.jpg",
  },
  {
    title: "High-Speed Wi-Fi",
    description: "Stay connected across the resort with seamless internet access.",
    image: "/a4.jpg",
  },
  {
    title: "Pet Friendly",
    description: "Bring your furry friends along — we welcome pets with open paws.",
    image: "/a5.jpeg", 
  },
];


const AmenityCarousel = () => {
  const [current, setCurrent] = useState(0);
  const total = amenities.length;

  const prev = () => setCurrent((current - 1 + total) % total);
  const next = () => setCurrent((current + 1) % total);

  const currentAmenity = amenities[current];
  const prevAmenity = amenities[(current - 1 + total) % total];
  const nextAmenity = amenities[(current + 1) % total];

  return (
    <div
      className="relative w-full h-[500px] flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${currentAmenity.image})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 z-0" />
      {/* Top Overlay with Heading */}
      <div className="absolute top-0 w-full z-10 p-5 bg-gradient-to-b from-black/100 to-transparent">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider drop-shadow-md mb-2">
            Explore by Amenities
          </h1>
          <p className="text-sm md:text-base text-white/80 font-light">
            Filter your stay experience based on what matters most to you.
          </p>
        </div>
      </div>

      {/* Left Preview */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-[75%]">
        <div className="rounded-r-lg bg-white/20 text-white px-6 py-4 w-72 h-full flex items-center justify-center backdrop-blur-sm">
          {prevAmenity.title}
        </div>
      </div>

      {/* Right Preview */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-[75%]">
        <div className="rounded-l-lg bg-white/20 text-white px-6 py-4 w-72 h-full flex items-center justify-center backdrop-blur-sm">
          {nextAmenity.title}
        </div>
      </div>

      {/* Center Card */}
      <div
        onClick={() => {
          console.log(`Filtering by: ${currentAmenity.title}`);
          // Add your actual filter logic here
        }}
        className="relative z-20 bg-white text-center max-w-xl p-6 border-2 border-white shadow-xl rounded-lg cursor-pointer transition transform hover:scale-105"
      >
        {/* Amenity Image */}
        <img
          src={currentAmenity.image}
          alt={currentAmenity.title}
          className="w-full h-40 object-cover rounded-md mb-4"
        />

        {/* Title & Description */}
        <h2 className="text-xl font-semibold tracking-wide mb-1">
          {currentAmenity.title.toUpperCase()}
        </h2>
        <p className="text-gray-700 text-sm">{currentAmenity.description}</p>
        <div className="mt-3 text-sm text-yellow-700 font-medium">MORE &gt;</div>
      </div>



      {/* Navigation Arrows */}
      <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 text-white">
        <ChevronLeft size={40} />
      </button>
      <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 text-white">
        <ChevronRight size={40} />
      </button>
    </div>
  );
};

export default AmenityCarousel;
