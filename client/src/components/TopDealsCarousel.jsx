import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const deals = [
  {
    id: 'goa-beach-retreat',
    title: 'Goa Beach Retreat',
    subtitle: 'Save 20% on luxury stays',
    image: '/td1.webp',
  },
  {
    id: 'hills-of-munnar',
    title: 'Hills of Munnar',
    subtitle: 'Cool weather + hot deals',
    image: '/td2.jpg',
  },
  {
    id: 'royal-udaipur',
    title: 'Royal Udaipur',
    subtitle: 'Stay like a king',
    image: '/td3.jpg',
  },
  {
    id: 'backwaters-in-kerala',
    title: 'Backwaters in Kerala',
    subtitle: 'Boathouse specials',
    image: '/td4.jpg',
  },
  {
    id: 'desert-camps-jaisalmer',
    title: 'Desert Camps of Jaisalmer',
    subtitle: 'Experience the dunes in style',
    image: '/td5.jpg',
  },
  {
    id: 'tea-gardens-darjeeling',
    title: 'Tea Gardens of Darjeeling',
    subtitle: 'Wake up to misty mornings',
    image: '/td6.jpg',
  },
];

const TopDealsCarousel = () => {
  return (
    <section className="bg-white py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 relative">
        <h2 className="text-3xl font-semibold text-center mb-4">Top Resort Deals</h2>
        <p className="text-center text-gray-500 mb-8">
          Escape to handpicked destinations with special prices
        </p>

        {/* Custom Navigation Buttons */}
        <div className="absolute top-[50%] -translate-y-1/2 left-0 z-10">
          <div className="swiper-button-prev-custom p-3 bg-white/80 hover:bg-white rounded-full shadow cursor-pointer">
            <FaArrowLeft />
          </div>
        </div>
        <div className="absolute top-[50%] -translate-y-1/2 right-0 z-10">
          <div className="swiper-button-next-custom p-3 bg-white/80 hover:bg-white rounded-full shadow cursor-pointer">
            <FaArrowRight />
          </div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          breakpoints={{
            320: { slidesPerView: 1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >
          {deals.map((deal) => (
            <SwiperSlide key={deal.id}>
              <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
                <img
                  loading="lazy"
                  src={deal.image}
                  alt={deal.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/fallback.jpg';
                  }}
                />
                <div className="absolute bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4 w-full">
                  <h3 className="text-lg font-bold">{deal.title}</h3>
                  <p className="text-sm">{deal.subtitle}</p>
                  <Link
                    to={`/deal/${deal.id}`}
                    className="inline-block mt-1 text-sm text-yellow-300 hover:text-yellow-400"
                  >
                    More &rarr;
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TopDealsCarousel;
