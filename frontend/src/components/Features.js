import React from "react";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const handleFeatureClick = (feature) => {
    const targetSection =
      feature === "report"
        ? "/report"
        : feature === "track"
        ? "/issues"
        : feature === "community"
        ? "/community"
        : "/";
    navigate(targetSection);
  };

  const features = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Report Issues",
      description:
        "Easily report road damage, garbage accumulation, water leaks, and other local problems with just a few clicks.",
      stats: { number: "1,245+", label: "Reports" },
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50",
      onClick: () => handleFeatureClick("report"),
    },
    {
      icon: "fas fa-binoculars",
      title: "Track Progress",
      description:
        "Monitor the status of your reported issues in real-time as they move from reported to resolved.",
      stats: { number: "876", label: "Resolved" },
      color: "from-green-500 to-teal-500",
      bgColor: "from-green-50 to-teal-50",
      onClick: () => handleFeatureClick("track"),
    },
    {
      icon: "fas fa-users",
      title: "Community Engagement",
      description:
        "Connect with neighbors, discuss local problems, and collaborate on community solutions.",
      stats: { number: "542", label: "Members" },
      color: "from-purple-500 to-pink-500",
      bgColor: "from-purple-50 to-pink-50",
      onClick: () => handleFeatureClick("community"),
    },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose CommunityFix?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform makes civic engagement simple, effective, and rewarding
            for everyone involved.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${feature.bgColor} rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer`}
              onClick={feature.onClick}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${feature.color} flex items-center justify-center text-white text-2xl mb-6`}
              >
                <i className={feature.icon}></i>
              </div>

              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-6">{feature.description}</p>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    {feature.stats.number}
                  </span>
                  <span className="block text-sm text-gray-500">
                    {feature.stats.label}
                  </span>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                  <i className="fas fa-arrow-right text-lg"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
