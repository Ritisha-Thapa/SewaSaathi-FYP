import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-[#F9F5F0] border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-[#1B3C53] hover:opacity-80 transition">
              SewaSaathi
            </Link>
          </div>

          {/* Desktop CTA & Voice (no navigation links) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/signup/customer" className="inline-block px-6 py-2 bg-[#1B3C53] text-white rounded-full hover:bg-[#1a3248] transition">
              Book a Service
            </Link>
            <Link to="/signup/provider" className="inline-block px-6 py-2 border-2 border-[#1B3C53] text-[#1B3C53] rounded-full hover:bg-[#1B3C53] hover:text-white transition">
              Become a Provider
            </Link>
            <button className="p-2 rounded-full hover:bg-gray-200 transition" aria-label="Voice Support">
              <svg className="w-6 h-6 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            <svg className="w-6 h-6 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu (CTA only, no navigation links) */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/signup/customer" className="w-full px-6 py-2 bg-[#1B3C53] text-white rounded-full text-center">
                Book a Service
              </Link>
              <Link to="/signup/provider" className="w-full px-6 py-2 border-2 border-[#1B3C53] text-[#1B3C53] rounded-full text-center">
                Become a Provider
              </Link>
              <button className="flex items-center justify-center space-x-2 p-2 text-[#1B3C53]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>Voice Support</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
