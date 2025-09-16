import React from "react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white py-20 md:py-28 overflow-hidden">

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-white/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/10 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Empower Your Community,{" "}
            <span className="text-blue-300">Fix Local Issues</span>
          </h1>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
            Report neighborhood problems, track their resolution, and connect
            with fellow citizens to create a better community together.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-5">
            <button
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate("/report")}
            >
              <i className="fas fa-plus-circle mr-2"></i>Report an Issue
            </button>
            <button
              className="bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1"
              onClick={() => navigate("/issues")}
            >
              <i className="fas fa-eye mr-2"></i>View Local Issues
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-20 bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-300">15K+</div>
              <div className="text-blue-100">Community Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-300">1.2K+</div>
              <div className="text-green-100">Issues Resolved</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-300">92%</div>
              <div className="text-amber-100">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-300">48h</div>
              <div className="text-purple-100">Avg. Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
