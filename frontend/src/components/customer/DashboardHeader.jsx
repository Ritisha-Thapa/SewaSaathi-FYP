import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell } from 'lucide-react';

const DashboardHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const [profileImg, setProfileImg] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) return;
        const response = await fetch("http://127.0.0.1:8000/accounts/profile/", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.profile_image) {
            setProfileImg(data.profile_image.startsWith('http') ? data.profile_image : `http://127.0.0.1:8000${data.profile_image}`);
          }
        }
      } catch (error) {
        console.error("Error fetching profile for header:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      window.location.href = '/login';
    }, 1500);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 max-w-7xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/customer-dashboard" className="text-2xl font-bold text-[#1B3C53] hover:opacity-80 transition">
              SewaSaathi
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/customer-dashboard" className="text-gray-700 hover:text-[#1B3C53] transition">Home</Link>
            <Link to="/services-category" className="text-gray-700 hover:text-[#1B3C53] transition">Services</Link>
            <Link to="/my-bookings" className="text-gray-700 hover:text-[#1B3C53] transition">My Bookings</Link>
            <Link to="/about-us" className="text-gray-700 hover:text-[#1B3C53] transition">About Us</Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#1B3C53] transition">Contact</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-4">

            {/* Notification Icon */}
            <Link
              to="/notifications"
              className="p-2 rounded-full hover:bg-gray-200 transition"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6 text-[#1B3C53]" />
            </Link>

            <Link to="/profile" className="p-1 rounded-full hover:bg-gray-200 transition" aria-label="Profile">
              <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300">
                <img src={profileImg || `https://ui-avatars.com/api/?name=${user?.first_name || "U"}&background=E5E7EB`} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </Link>

            {/* Voice Support */}
            <button className="p-2 rounded-full hover:bg-gray-200 transition" aria-label="Voice Support">
              <svg className="w-6 h-6 text-[#1B3C53]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`inline-flex items-center justify-center px-6 py-2 rounded-full transition ${isLoggingOut ? 'bg-[#1B3C53]/70 text-white cursor-not-allowed' : 'bg-[#1B3C53] text-white hover:bg-[#1a3248]'}`}
            >
              {isLoggingOut ? (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : null}
              {isLoggingOut ? 'Logging Out...' : 'Log Out'}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
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

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link to="/" className="block text-gray-700 hover:text-[#1B3C53]">Home</Link>
            <Link to="/services" className="block text-gray-700 hover:text-[#1B3C53]">Services</Link>
            <Link to="/about" className="block text-gray-700 hover:text-[#1B3C53]">About Us</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-[#1B3C53]">Contact</Link>

            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/profile" className="w-full px-6 py-2 border border-gray-300 rounded-full text-center text-[#1B3C53]">
                Profile
              </Link>

              {/* Voice Support */}
              <button className="flex items-center justify-center space-x-2 p-2 text-[#1B3C53]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <span>Voice Support</span>
              </button>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full px-6 py-2 rounded-full flex justify-center items-center transition ${isLoggingOut ? 'bg-[#1B3C53]/70 text-white cursor-not-allowed' : 'bg-[#1B3C53] text-white hover:bg-[#1a3248]'}`}
              >
                {isLoggingOut ? (
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                ) : null}
                {isLoggingOut ? 'Logging Out...' : 'Log Out'}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
