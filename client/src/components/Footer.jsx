import { FaFacebookF, FaInstagram, FaXTwitter, FaLinkedinIn } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-black text-gray-300">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <h4 className="font-semibold text-white mb-3">Company</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline hover:text-white">About Us</a></li>
            <li><a href="#" className="hover:underline hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:underline hover:text-white">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Support</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline hover:text-white">FAQs</a></li>
            <li><a href="#" className="hover:underline hover:text-white">Contact</a></li>
            <li><a href="#" className="hover:underline hover:text-white">Help Center</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Explore</h4>
          <ul className="space-y-2">
            <li><a href="#" className="hover:underline hover:text-white">Beach Resorts</a></li>
            <li><a href="#" className="hover:underline hover:text-white">Hill Stays</a></li>
            <li><a href="#" className="hover:underline hover:text-white">Offers</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Follow Us</h4>
          <div className="flex space-x-4 mt-2 text-xl">
            <a href="#" className="text-gray-400 hover:text-blue-500 transition">
              <FaFacebookF />
            </a>
            <a href="#" className="text-gray-400 hover:text-pink-500 transition">
              <FaInstagram />
            </a>
            <a href="#" className="text-gray-400 hover:text-white transition">
              <FaXTwitter />
            </a>
            <a href="#" className="text-gray-400 hover:text-blue-300 transition">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-500">
        © 2025 ResortFinder · Privacy · Terms
      </div>
    </footer>
  );
};

export default Footer;
