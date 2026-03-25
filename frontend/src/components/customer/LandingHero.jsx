import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Zap, Sparkles, Leaf } from 'lucide-react';

const LandingHero = () => {

  return (
    <section id="home" className="bg-white py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row items-center gap-12">

          {/* Left Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1B3C53] mb-6 leading-tight">
              Find Trusted Service Providers For Your Home Needs
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              Book reliable electricians, plumbers, cleaners, and more — all verified and insured.
            </p>

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
              <div className="bg-[#F9F5F0] rounded-xl p-6 shadow-lg text-center transition hover:scale-105">
                <div className="w-20 h-20 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {/* Replace with actual image: <img src="/images/hero/plumber.jpg" alt="Plumber" className="w-full h-full object-cover" /> */}
                  <Wrench className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Plumber</h3>
              </div>

              {/* Electrician */}
              <div className="bg-[#F9F5F0] rounded-xl p-6 shadow-lg text-center transition hover:scale-105">
                <div className="w-20 h-20 bg-yellow-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {/* Replace with actual image: <img src="/images/hero/electrician.jpg" alt="Electrician" className="w-full h-full object-cover" /> */}
                  <Zap className="w-10 h-10 text-yellow-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Electrician</h3>
              </div>

              {/* Cleaner */}
              <div className="bg-[#F9F5F0] rounded-xl p-6 shadow-lg text-center transition hover:scale-105">
                <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {/* Replace with actual image: <img src="/images/hero/cleaner.jpg" alt="Cleaner" className="w-full h-full object-cover" /> */}
                  <Sparkles className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Cleaner</h3>
              </div>

              {/* Gardener */}
              <div className="bg-[#F9F5F0] rounded-xl p-6 shadow-lg text-center transition hover:scale-105">
                <div className="w-20 h-20 bg-emerald-100 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {/* Replace with actual image: <img src="/images/hero/gardener.jpg" alt="Gardener" className="w-full h-full object-cover" /> */}
                  <Leaf className="w-10 h-10 text-emerald-600" />
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

export default LandingHero;

