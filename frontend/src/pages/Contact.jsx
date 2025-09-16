import React, { useState } from "react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  };

  const contactMethods = [
    {
      icon: "fas fa-map-marker-alt",
      title: "Our Office",
      details: "cgc University, Mohali, ch-1234",
      color: "text-blue-500",
    },
    {
      icon: "fas fa-envelope",
      title: "Email Us",
      details: "support@communityfix.com",
      color: "text-green-500",
      link: "mailto:support@communityfix.com",
    },
    {
      icon: "fas fa-phone",
      title: "Call Us",
      details: "+1 (555) 123-4567",
      color: "text-purple-500",
      link: "tel:+15551234567",
    },
    {
      icon: "fas fa-clock",
      title: "Hours",
      details: "Mon-Fri: 9am-5pm | Sat: 10am-2pm | Sun: Closed",
      color: "text-amber-500",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have questions or suggestions? We'd love to hear from you. Reach out
            to us through any of these channels.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {contactMethods.map((method, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-white flex items-center justify-center ${method.color} text-xl mb-4`}
                  >
                    <i className={method.icon}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {method.title}
                  </h3>
                  {method.link ? (
                    <a
                      href={method.link}
                      className="text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      {method.details}
                    </a>
                  ) : (
                    <p className="text-gray-600">{method.details}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Map Placeholder */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                Visit Our Office
              </h3>
              <div className="bg-gray-200 rounded-xl h-48 flex items-center justify-center">
                <i className="fas fa-map-marked-alt text-3xl text-gray-400"></i>
                <span className="ml-3 text-gray-600">Interactive Map</span>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Send us a Message
            </h2>

            {isSubmitted && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                <i className="fas fa-check-circle mr-2"></i>
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  placeholder="Tell us how we can help..."
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:-translate-y-0.5"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
