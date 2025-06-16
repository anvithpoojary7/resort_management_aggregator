import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const deals = [
  {
    title: 'Goa Beach Retreat',
    subtitle: 'Save 20% on luxury stays',
    image: '/td1.webp',
    link: '#',
  },
  {
    title: 'Hills of Munnar',
    subtitle: 'Cool weather + hot deals',
    image: '/td2.jpg',
    link: '#',
  },
  {
    title: 'Royal Udaipur',
    subtitle: 'Stay like a king',
    image: '/td3.jpg',
    link: '#',
  },
  {
    title: 'Backwaters in Kerala',
    subtitle: 'Boathouse specials',
    image: '/td4.jpg',
    link: '#',
  },
  {
    title: 'Desert Camps of Jaisalmer',
    subtitle: 'Experience the dunes in style',
    image: '/td5.jpg',
    link: '#',
  },
  {
    title: 'Tea Gardens of Darjeeling',
    subtitle: 'Wake up to misty mornings',
    image: '/td6.jpg',
    link: '#',
  },
];

const TopDealsCarousel = () => {
  return (
    <section className="bg-white py-2">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-4">Top Resort Deals</h2>
        <p className="text-center text-gray-500 mb-8">Escape to handpicked destinations with special prices</p>

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
          {deals.map((deal, idx) => (
            <SwiperSlide key={idx}>
              <div className="group relative rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition duration-300">
                <img src={deal.image} alt={deal.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white p-4 w-full">
                  <h3 className="text-lg font-bold">{deal.title}</h3>
                  <p className="text-sm">{deal.subtitle}</p>
                  <a href={deal.link} className="inline-block mt-1 text-sm text-yellow-300 hover:text-yellow-400">More &rarr;</a>
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
