import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { path: "/", label: "Home", icon: "fas fa-home" },
    { path: "/report", label: "Report Issue", icon: "fas fa-plus-circle" },
    { path: "/issues", label: "Track Issues", icon: "fas fa-binoculars" },
    { path: "/community", label: "Community", icon: "fas fa-users" },
    { path: "/contact", label: "Contact", icon: "fas fa-envelope" },
  ];

  // Handle body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add("menu-open");
    } else {
      document.body.classList.remove("menu-open");
    }

    return () => {
      document.body.classList.remove("menu-open");
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLoginClick = () => {
    navigate("/login");
    closeMenu();
  };

  const handleRegisterClick = () => {
    navigate("/register");
    closeMenu();
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  const handleReportIssue = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/report");
      closeMenu();
    }
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-800 border-red-200";
      case "electrical":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "pwd":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "municipal":
        return "bg-green-100 text-green-800 border-green-200";
      case "water":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "sanitation":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4">
        <nav className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
            onClick={closeMenu}
          >
            <i className="fas fa-hands-helping mr-2 text-blue-500"></i>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CommunityFix
            </span>
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-8">
            {navigationItems.map((item) => {
              // Hide "Report Issue" for non-public users
              if (item.path === "/report" && user && user.role !== "public") {
                return null;
              }
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`font-medium transition-all duration-300 flex items-center py-2 px-3 rounded-lg ${
                      location.pathname === item.path
                        ? "bg-blue-50 text-blue-600 border border-blue-200"
                        : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <i className={`${item.icon} mr-2 text-sm`}></i>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          {/* User Actions - Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      {user.username}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeColor(
                        user.role
                      )}`}
                    >
                      {user.role.toUpperCase()}
                    </span>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                </div>

                {user.role !== "public" && (
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    <i className="fas fa-tachometer-alt mr-2"></i>
                    Dashboard
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <button
                  onClick={handleLoginClick}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Login
                </button>
                <button
                  onClick={handleRegisterClick}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center"
                >
                  <i className="fas fa-user-plus mr-2"></i>
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={toggleMenu}
            aria-label="Toggle menu"
            style={{ width: "44px", height: "44px" }}
          >
            {isMenuOpen ? (
              <i className="fas fa-times text-lg"></i>
            ) : (
              <i className="fas fa-bars text-lg"></i>
            )}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${
            isMenuOpen
              ? "max-h-96 opacity-100 pb-4"
              : "max-h-0 opacity-0 overflow-hidden"
          }`}
        >
          <div className="bg-white border-t border-gray-200 pt-4 rounded-lg shadow-xl">
            <ul className="space-y-2">
              {/* Mobile Navigation Menu */}
              {navigationItems.map((item) => {
                // Hide "Report Issue" for non-public users
                if (item.path === "/report" && user && user.role !== "public") {
                  return null;
                }
                return (
                  <li key={item.path}>
                    {item.path === "/report" ? (
                      <button
                        onClick={handleReportIssue}
                        className={`flex items-center w-full px-4 py-3 rounded-lg mx-2 transition-all duration-300 ${
                          location.pathname === item.path
                            ? "bg-blue-500 text-white shadow-lg"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                      >
                        <i className={`${item.icon} mr-3 w-5 text-center`}></i>
                        {item.label}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-lg mx-2 transition-all duration-300 ${
                          location.pathname === item.path
                            ? "bg-blue-500 text-white shadow-lg"
                            : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                        }`}
                        onClick={closeMenu}
                      >
                        <i className={`${item.icon} mr-3 w-5 text-center`}></i>
                        {item.label}
                      </Link>
                    )}
                  </li>
                );
              })}
              {/* Mobile Auth Section */}
              <li className="border-t border-gray-200 pt-4 mt-3 px-4">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
                          {user.username}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(
                            user.role
                          )}`}
                        >
                          {user.role.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {user.role !== "public" && (
                      <Link
                        to="/dashboard"
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center mb-2"
                        onClick={closeMenu}
                      >
                        <i className="fas fa-tachometer-alt mr-2"></i>
                        Dashboard
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button
                      onClick={handleLoginClick}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <i className="fas fa-sign-in-alt mr-2"></i>
                      Login
                    </button>
                    <button
                      onClick={handleRegisterClick}
                      className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
                    >
                      <i className="fas fa-user-plus mr-2"></i>
                      Sign Up
                    </button>
                  </div>
                )}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        ></div>
      )}
    </header>
  );
};

export default Header;
