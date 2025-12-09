import React, { useState } from "react";
import DashboardHeader from "../components/DashboardHeader";
import Footer from "../components/Footer";
import plumbing from "../assets/images/services/plumbing.png";
import cleaning from "../assets/images/services/cleaning.png";
import electrical from "../assets/images/services/electrical.png";
import gardening from "../assets/images/services/gardening.png";
import painting from "../assets/images/services/painting.png";
import servicesBg from '../assets/images/services/electrical.png';


const Services = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const services = [
    {
      id: 1,
      name: "Plumbing",
      category: "home-repair",
      imageUrl: plumbing,
      description:
        "Professional plumbing services including repairs, installations, and maintenance. Our verified plumbers handle everything from leaky faucets to complete bathroom renovations.",
      features: [
        "Leak Repairs",
        "Pipe Installation",
        "Drain Cleaning",
        "Water Heater Service",
      ],
      icon: (
        <svg
          className="w-16 h-16 text-blue-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 7h2a3 3 0 0 1 0 6h-1m-6 0H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2m8 0V3a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v2m8 0h-2" />
        </svg>
      ),
      color: "bg-blue-100",
    },
    {
      id: 2,
      name: "Cleaning",
      category: "home-maintenance",
      imageUrl: cleaning,
      description:
        "Comprehensive cleaning services for homes and offices. From deep cleaning to regular maintenance, our professional cleaners ensure a spotless environment.",
      features: [
        "Deep Cleaning",
        "Regular Maintenance",
        "Office Cleaning",
        "Post-Construction",
      ],
      icon: (
        <svg
          className="w-16 h-16 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 2v4m0 12v4M2 12h4m12 0h4" />
          <path d="M6.34 6.34l2.83 2.83m7.66 7.66l2.83 2.83M17.66 6.34l-2.83 2.83M6.34 17.66l-2.83-2.83" />
        </svg>
      ),
      color: "bg-green-100",
    },
    {
      id: 3,
      name: "Electrical",
      category: "home-repair",
      imageUrl: electrical,
      description:
        "Safe and reliable electrical services by certified electricians. We handle wiring, installations, repairs, and electrical safety inspections.",
      features: [
        "Wiring & Installation",
        "Repairs & Troubleshooting",
        "Safety Inspections",
        "Smart Home Setup",
      ],
      icon: (
        <svg
          className="w-16 h-16 text-yellow-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
        </svg>
      ),
      color: "bg-yellow-100",
    },
    {
      id: 4,
      name: "Gardening",
      category: "outdoor",
      imageUrl: gardening,
      description:
        "Expert gardening and landscaping services to transform your outdoor spaces. From lawn care to garden design, we help create beautiful green spaces.",
      features: [
        "Lawn Care",
        "Garden Design",
        "Tree & Shrub Care",
        "Landscaping",
      ],
      icon: (
        <svg
          className="w-16 h-16 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
          <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
        </svg>
      ),
      color: "bg-emerald-100",
    },
    {
      id: 5,
      name: "Painting",
      category: "home-improvement",
      imageUrl: painting,
      description:
        "Professional painting services for interior and exterior spaces. Quality finishes and attention to detail for homes and commercial properties.",
      features: [
        "Interior Painting",
        "Exterior Painting",
        "Wallpaper Installation",
        "Color Consultation",
      ],
      icon: (
        <svg
          className="w-16 h-16 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9.06 2.06l-5 5a1.5 1.5 0 0 0 0 2.12l8.84 8.84a1.5 1.5 0 0 0 2.12 0l5-5a1.5 1.5 0 0 0 0-2.12L11.18 2.06a1.5 1.5 0 0 0-2.12 0z" />
        </svg>
      ),
      color: "bg-purple-100",
    },
  ];

  const categories = [
    { value: "all", label: "All Services" },
    { value: "home-repair", label: "Home Repair" },
    { value: "home-maintenance", label: "Maintenance" },
    { value: "home-improvement", label: "Home Improvement" },
    { value: "outdoor", label: "Outdoor" },
  ];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[#F9F5F0]">
      <DashboardHeader />

      {/* ---------------- HERO SECTION WITH BACKGROUND IMAGE ---------------- */}
      <section
        className="relative py-24 md:py-32 flex items-center"
        style={{
          backgroundImage: `url(${servicesBg})`, // <-- replace with your Services BG image
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* overlay */}
        <div className="absolute inset-0 bg-[#1B3C53] opacity-70"></div>

        <div className="relative container mx-auto px-4 max-w-7xl text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Explore a wide range of trusted and professional services available
            near you.
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="w-full md:w-1/2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-full focus:outline-none focus:border-[#1B3C53] transition"
                />
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-auto">
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`px-4 py-2 rounded-full transition ${
                      selectedCategory === category.value
                        ? "bg-[#1B3C53] text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          {filteredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">
                No services found matching your criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl p-6 hover:shadow-xl transition shadow-lg"
                >
                  <div
                    className={`${service.color} rounded-full w-24 h-24 mx-auto mb-4 flex items-center justify-center overflow-hidden`}
                  >
                    {service.imageUrl ? (
                      <img
                        src={service.imageUrl}
                        alt={service.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : null}
                    <div
                      style={{ display: service.imageUrl ? "none" : "flex" }}
                      className="w-full h-full items-center justify-center"
                    >
                      {service.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-[#1B3C53] text-center mb-3">
                    {service.name}
                  </h3>

                  <p className="text-gray-600 text-center mb-4 min-h-[60px]">
                    {service.description}
                  </p>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-semibold text-[#1B3C53] mb-2">
                      Key Features:
                    </h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-center"
                        >
                          <svg
                            className="w-4 h-4 text-green-500 mr-2"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-6 text-center">
                    <button className="px-6 py-2 bg-[#1B3C53] text-white rounded-full hover:bg-[#1a3248] transition">
                      Book Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Services;
