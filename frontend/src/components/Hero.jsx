import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('Kathmandu');

  return (
    <section id="home" className="bg-[#F9F5F0] py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B3C53] mb-6 leading-tight">
              Find Trusted Service Providers Near You
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Book reliable electricians, plumbers, cleaners, and more — all verified and insured.
            </p>

            {/* Search Bar */}
            {/* <div className="bg-white rounded-lg p-4 shadow-md mb-8">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service type</label>
                  <input
                    type="text"
                    placeholder="e.g., Plumber, Electrician..."
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    placeholder="Kathmandu"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]"
                  />
                </div>
              </div>
            </div> */}

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link to="/signup/customer" className="px-8 py-4 bg-[#1B3C53] text-white rounded-full font-semibold hover:bg-[#1a3248] transition shadow-lg text-center">
                Book a Service
              </Link>
              <Link to="/signup/provider" className="px-8 py-4 border-2 border-[#1B3C53] text-[#1B3C53] rounded-full font-semibold hover:bg-[#1B3C53] hover:text-white transition text-center">
                Become a Provider
              </Link>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 flex justify-center items-center">
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {/* Plumber */}
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {/* Replace with actual image: <img src="/images/hero/plumber.jpg" alt="Plumber" className="w-full h-full object-cover" /> */}
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Plumber</h3>
              </div>

              {/* Electrician */}
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {/* Replace with actual image: <img src="/images/hero/electrician.jpg" alt="Electrician" className="w-full h-full object-cover" /> */}
                  <svg className="w-10 h-10 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Electrician</h3>
              </div>

              {/* Cleaner */}
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {/* Replace with actual image: <img src="/images/hero/cleaner.jpg" alt="Cleaner" className="w-full h-full object-cover" /> */}
                  <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Cleaner</h3>
              </div>

              {/* Gardener */}
              <div className="bg-white rounded-xl p-6 shadow-lg text-center">
                <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {/* Replace with actual image: <img src="/images/hero/gardener.jpg" alt="Gardener" className="w-full h-full object-cover" /> */}
                  <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800">Gardener</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

