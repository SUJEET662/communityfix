import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white mr-3">
                <i className="fas fa-hands-helping"></i>
              </div>
              <span className="text-2xl font-bold">CommunityFix</span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              Empowering citizens to improve their neighborhoods through
              collaborative issue reporting and resolution tracking.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-600 flex items-center justify-center text-white transition-colors"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-400 flex items-center justify-center text-white transition-colors"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-pink-600 flex items-center justify-center text-white transition-colors"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-gray-800 hover:bg-blue-700 flex items-center justify-center text-white transition-colors"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-blue-500">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/report"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Report an Issue
                </Link>
              </li>
              <li>
                <Link
                  to="/issues"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Track Issues
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-blue-500">
              Categories
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Road Damage
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Garbage & Waste
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Water Leaks
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Public Safety
                </span>
              </li>
              <li>
                <span className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                  Parks & Recreation
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 relative pb-2 after:absolute after:left-0 after:bottom-0 after:w-10 after:h-0.5 after:bg-blue-500">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center">
                <i className="fas fa-envelope text-blue-400 mr-3 w-5"></i>
                <span className="text-gray-400">support@communityfix.com</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-phone text-blue-400 mr-3 w-5"></i>
                <span className="text-gray-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <i className="fas fa-map-marker-alt text-blue-400 mr-3 w-5"></i>
                <span className="text-gray-400">123 Civic Center, City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CommunityFix. All rights reserved.
            Empowering communities through technology.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
