import React from "react";

const HowItWorks = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How CommunityFix Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transforming communities one issue at a time. Our simple process
            makes civic engagement effortless.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {/* Step 1 */}
          <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-blue-600 font-bold text-sm shadow-md">
                1
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Report an Issue
            </h3>
            <p className="text-gray-600">
              Snap a photo, add details, and pin the location on our interactive
              map.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-green-50 to-teal-50 hover:from-green-100 hover:to-teal-100 transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-paper-plane"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-green-600 font-bold text-sm shadow-md">
                2
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              We Notify Authorities
            </h3>
            <p className="text-gray-600">
              We automatically route your report to the relevant local
              department.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-chart-line"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-purple-600 font-bold text-sm shadow-md">
                3
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Monitor real-time updates and receive notifications on resolution
              progress.
            </p>
          </div>

          {/* Step 4 */}
          <div className="group text-center p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all duration-300 transform hover:-translate-y-2">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform duration-300">
                <i className="fas fa-check-double"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-amber-600 font-bold text-sm shadow-md">
                4
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Celebrate Success
            </h3>
            <p className="text-gray-600">
              Confirm resolution and share the success story with your
              community.
            </p>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-10 text-white text-center shadow-xl mb-16">
          <h3 className="text-3xl font-bold mb-8">Our Community Impact</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="stat">
              <div className="text-5xl font-bold mb-2 text-blue-400">
                1,245+
              </div>
              <div className="text-blue-200">Issues Reported</div>
            </div>
            <div className="stat">
              <div className="text-5xl font-bold mb-2 text-green-400">876</div>
              <div className="text-green-200">Issues Resolved</div>
            </div>
            <div className="stat">
              <div className="text-5xl font-bold mb-2 text-amber-400">92%</div>
              <div className="text-amber-200">Response Rate</div>
            </div>
            <div className="stat">
              <div className="text-5xl font-bold mb-2 text-purple-400">48h</div>
              <div className="text-purple-200">Avg. Resolution Time</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Make a Difference?
          </h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of active community members who are transforming
            their neighborhoods. Your report could be the catalyst for positive
            change.
          </p>
          <button className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-1">
            Report an Issue Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
