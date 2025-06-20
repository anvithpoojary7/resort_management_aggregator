import React from 'react';

const ContactUs = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg space-y-6">
      <h1 className="text-3xl font-semibold text-center">Contact Us</h1>
      
      <form
         action="https://formspree.io/f/mnnvzbjo"
  method="POST"
        className="space-y-4"
      >
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          className="w-full border p-2 rounded h-32"
          required
        ></textarea>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </form>

      {/* Optional Google Map */}
      <div className="w-full h-64">
          <iframe
            title="Our Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3939.668345660458!2d74.85595631478243!3d12.918983390889266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba35bdcb7c688cd%3A0x2b0e2f2f1f2b7b5f!2sMangalore%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1625559123456"
            className="w-full h-full border-0 rounded"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
    </div>
  );
};

export default ContactUs;

