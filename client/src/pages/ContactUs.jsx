import React, { useState, useRef } from "react";
import { FaEnvelope, FaCommentDots, FaPhoneAlt, FaTimes } from "react-icons/fa";
import emailjs from "@emailjs/browser";

const ContactUs = () => {
  const [modal, setModal] = useState(null); // 'email', 'message', 'call'
  const formRef = useRef();

  const closeModal = () => setModal(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("resortfinderinbox@gmail.com");
    alert("Email copied to clipboard!");
  };

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_fk468kj",
        "template_l05nief",
        formRef.current,
        "zG1Il6jXa4VeMb3Fv"
      )
      .then(
        () => {
          alert("Message sent successfully!");
          formRef.current.reset();
          setModal(null);
        },
        (error) => {
          alert("Failed to send message. Please try again.");
          console.error(error);
        }
      );
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Hero Section */}
      <div
        className="h-[500px] bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: "url('/b1.jpg')",
        }}
      >
        <h1 className="text-5xl font-bold text-white backdrop-blur-sm bg-black/40 px-8 py-4 rounded-2xl">
          Contact Resort Finder
        </h1>
      </div>

      {/* Contact Options */}
      <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center py-16 px-4">
        {/* Email Us */}
        <div
          className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition cursor-pointer"
          onClick={() => setModal("email")}
        >
          <FaEnvelope className="mx-auto text-3xl text-blue-600 mb-4" />
          <p className="font-bold text-lg mb-1">Email Us</p>
          <p className="text-gray-700">resortfinderinbox@gmail.com</p>
        </div>

        {/* Message Us */}
        <div
          className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition cursor-pointer"
          onClick={() => setModal("message")}
        >
          <FaCommentDots className="mx-auto text-3xl text-blue-600 mb-4" />
          <p className="font-bold text-lg mb-1">Message Us</p>
          <p className="text-gray-700">Click to contact support</p>
        </div>

        {/* Call Us */}
        <div
          className="bg-white rounded-2xl shadow p-8 hover:shadow-lg transition cursor-pointer"
          onClick={() => setModal("call")}
        >
          <FaPhoneAlt className="mx-auto text-3xl text-blue-600 mb-4" />
          <p className="font-bold text-lg mb-1">Call Us</p>
          <p className="text-gray-700">+91-98765-43210</p>
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] text-white rounded-xl p-8 w-full max-w-lg relative shadow-lg">
            <button
              className="absolute top-4 right-4 text-white hover:text-red-500"
              onClick={closeModal}
            >
              <FaTimes size={18} />
            </button>

            {/* Email Modal */}
            {modal === "email" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Email Us</h2>
                <p className="mb-4">
                  For any inquiries, you can email us directly at:
                </p>
                <p className="text-blue-400 text-lg mb-4">
                  resortfinderinbox@gmail.com
                </p>
                <button
                  onClick={handleCopyEmail}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                >
                  Copy Email
                </button>
              </>
            )}

            {/* Message Modal - EmailJS Integration */}
            {modal === "message" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Send a Message</h2>
                <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    required
                    className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    required
                    className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number (Optional)"
                    className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none"
                  />
                  <textarea
                    name="message"
                    required
                    placeholder="How can we help you?"
                    rows={4}
                    className="w-full bg-gray-800 text-white rounded px-4 py-2 focus:outline-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
                  >
                    Send Message
                  </button>
                </form>
              </>
            )}

            {/* Call Modal */}
            {modal === "call" && (
              <>
                <h2 className="text-2xl font-bold mb-4">Call Us</h2>
                <p className="mb-2 text-lg">+91-98765-43210</p>
                <p className="mb-4">Available from 9:00 AM – 6:00 PM (Mon–Sat)</p>
                <a
                  href="tel:+919876543210"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold inline-block"
                >
                  Call Now
                </a>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="bg-gray-200 py-6 text-center text-sm text-gray-600">
        <p>We’re here to help — contact us anytime.</p>
      </div>
    </div>
  );
};

export default ContactUs;
