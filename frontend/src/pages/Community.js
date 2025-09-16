import React from "react";

const Community = () => {
  const events = [
    {
      id: 1,
      title: "Neighborhood Cleanup Day",
      date: "September 15, 2023",
      time: "9:00 AM - 12:00 PM",
      location: "City Park",
      image:
        "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      attendees: 47,
    },
    {
      id: 2,
      title: "Town Hall Meeting",
      date: "September 22, 2023",
      time: "6:30 PM - 8:30 PM",
      location: "Community Center",
      image:
        "https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80",
      attendees: 89,
    },
  ];

  const forums = [
    {
      title: "General Discussion",
      threads: 124,
      posts: 567,
      icon: "fas fa-comments",
      color: "text-blue-500",
    },
    {
      title: "Road & Infrastructure",
      threads: 89,
      posts: 342,
      icon: "fas fa-road",
      color: "text-green-500",
    },
    {
      title: "Environment & Cleanliness",
      threads: 67,
      posts: 234,
      icon: "fas fa-leaf",
      color: "text-emerald-500",
    },
    {
      title: "Safety & Security",
      threads: 45,
      posts: 178,
      icon: "fas fa-shield-alt",
      color: "text-red-500",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Community Hub
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Connect with neighbors, share ideas, and work together to improve
            our community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Upcoming Events */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i className="fas fa-calendar-alt text-blue-500 mr-3"></i>
              Upcoming Events
            </h2>

            <div className="space-y-6">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
                      {event.attendees} attending
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-gray-600 mb-4">
                      <div className="flex items-center">
                        <i className="fas fa-calendar-day text-blue-500 mr-3 w-5"></i>
                        {event.date}
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-clock text-blue-500 mr-3 w-5"></i>
                        {event.time}
                      </div>
                      <div className="flex items-center">
                        <i className="fas fa-map-marker-alt text-blue-500 mr-3 w-5"></i>
                        {event.location}
                      </div>
                    </div>
                    <button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all">
                      RSVP Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Discussion Forums */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <i className="fas fa-comments text-green-500 mr-3"></i>
              Discussion Forums
            </h2>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="space-y-4">
                {forums.map((forum, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center">
                      <i
                        className={`${forum.icon} ${forum.color} text-2xl mr-4`}
                      ></i>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {forum.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {forum.threads} threads • {forum.posts} posts
                        </p>
                      </div>
                    </div>
                    <button className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors">
                      <i className="fas fa-arrow-right"></i>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
                <h4 className="font-semibold text-gray-900 mb-2">
                  Join the Conversation
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  Share your ideas and help solve community problems together.
                </p>
                <button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all">
                  Start New Discussion
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-gradient-to-r from-gray-900 to-blue-900 rounded-2xl p-10 text-white text-center">
          <h3 className="text-3xl font-bold mb-8">Community Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="text-5xl font-bold mb-2 text-blue-400">2,458</div>
              <div className="text-blue-200">Active Members</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-green-400">124</div>
              <div className="text-green-200">Events Hosted</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-amber-400">567</div>
              <div className="text-amber-200">Discussions</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2 text-purple-400">89%</div>
              <div className="text-purple-200">Active Participation</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Community;
