import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import serviceImage from '../assets/images/services/painting.png';
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

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/services"
                className="px-8 py-4 bg-[#1B3C53] text-white rounded-full font-semibold hover:bg-[#1a3248] transition shadow-lg text-center"
              >
                Book a Service
              </Link>

              <Link
                to="/contact"
                className="px-8 py-4 border-2 border-[#1B3C53] text-[#1B3C53] rounded-full font-semibold hover:bg-[#1B3C53] hover:text-white transition text-center"
              >
                Contact Us
              </Link>
            </div>
          </div>

          {/* Right Side Image */}
          <div className="flex-1 flex justify-center md:justify-end">
            <img
              src={serviceImage}   
              alt="Service Provider"
              className="w-full max-w-md rounded-2xl shadow-lg object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
