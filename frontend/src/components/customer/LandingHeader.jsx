import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic, Menu, X } from 'lucide-react';
import logo from '../../assets/sewasathi_logo.png';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const dashboardPath = user?.role === 'provider' ? '/provider/dashboard' : '/customer-dashboard';

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? dashboardPath : "/"} className="flex items-center gap-2 hover:opacity-80 transition">
              <img src={logo} alt="SewaSaathi Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-[#1B3C53] tracking-tight">SewaSaathi</span>
            </Link>
          </div>

          {/* Desktop CTA & Voice (no navigation links) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <Link to={dashboardPath} className="inline-block px-6 py-2 bg-[#1B3C53] text-white rounded-full hover:bg-[#1a3248] transition">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="inline-block px-6 py-2 border-2 border-[#1B3C53] text-[#1B3C53] rounded-full hover:bg-[#1B3C53] hover:text-white transition">
                  Login
                </Link>
                <Link to="/signup/customer" className="inline-block px-6 py-2 bg-[#1B3C53] text-white rounded-full hover:bg-[#1a3248] transition">
                  Book a Service
                </Link>
              </>
            )}
            <button className="p-2 rounded-full hover:bg-gray-200 transition" aria-label="Voice Support">
              <Mic className="w-6 h-6 text-[#1B3C53]" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-[#1B3C53]" />
            ) : (
              <Menu className="w-6 h-6 text-[#1B3C53]" />
            )}
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
                <Mic className="w-5 h-5" />
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
