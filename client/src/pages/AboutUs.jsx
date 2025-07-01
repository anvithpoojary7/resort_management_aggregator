import React from "react";

export default function AboutUs() {
  return (
    <div className="bg-white text-gray-800 px-6 py-10 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-4 text-center">About Us</h1>
      <p className="text-lg mb-8 text-center max-w-3xl mx-auto">
        Welcome to <span className="font-semibold">ResortFinder</span>, your one-stop platform for discovering, comparing, and booking the finest resorts across the country. Whether you're planning a serene beachside retreat, a cozy mountain escape, or a luxurious city resort experience, we've got you covered.
      </p>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Our Mission</h2>
        <p className="text-gray-700">
          To bridge the gap between travelers and resort owners through a seamless, transparent, and trusted digital platform that enhances travel planning and resort management experiences.
        </p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div>
          <img src="https://source.unsplash.com/600x400/?resort,travel" alt="Travelers" className="rounded-xl shadow-md w-full h-auto" />
          <h3 className="text-xl font-semibold mt-4">For Travelers</h3>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Discover resorts by location, amenities, and availability</li>
            <li>Real-time booking and confirmations</li>
            <li>Verified guest reviews and ratings</li>
            <li>Personalized recommendations</li>
          </ul>
        </div>

        <div>
          <img src="https://source.unsplash.com/600x400/?resort,management" alt="Resort Owners" className="rounded-xl shadow-md w-full h-auto" />
          <h3 className="text-xl font-semibold mt-4">For Resort Owners</h3>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Easy and customizable resort listings</li>
            <li>Real-time booking and calendar management</li>
            <li>Secure user management tools</li>
            <li>Dedicated dashboard and analytics</li>
          </ul>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-2">Why Choose Us?</h2>
        <ul className="list-disc list-inside text-gray-700">
          <li>Trusted by both travelers and resort owners</li>
          <li>Simplified, secure booking and listing process</li>
          <li>Powerful admin control panel</li>
          <li>Reliable and modern technology stack</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-2">Our Vision</h2>
        <p className="text-gray-700">
          To become the most reliable and innovative resort discovery and management platform in the industry, helping people explore extraordinary places while enabling resort businesses to thrive online.
        </p>
      </section>
    </div>
  );
}
