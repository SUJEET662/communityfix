import React from "react";

const CommunityPreview = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="section-title">
          <h2>Join Our Community</h2>
          <p>Connect with neighbors and work together to improve your area</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="community-card bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1">
            <div className="community-image meetup h-48"></div>
            <div className="community-content p-6">
              <h3 className="text-2xl font-bold mb-4">Community Meetups</h3>
              <p className="text-gray-600 mb-6">
                Join our monthly meetups to discuss local issues and plan
                improvement projects with your neighbors.
              </p>
              <button className="btn btn-primary">View Schedule</button>
            </div>
          </div>

          <div className="community-card bg-white rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:-translate-y-1">
            <div className="community-image forum h-48"></div>
            <div className="community-content p-6">
              <h3 className="text-2xl font-bold mb-4">Discussion Forum</h3>
              <p className="text-gray-600 mb-6">
                Participate in our online forum to share ideas, report problems,
                and collaborate on solutions.
              </p>
              <button className="btn btn-primary">Join Discussion</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunityPreview;
