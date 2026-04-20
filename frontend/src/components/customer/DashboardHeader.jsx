import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bell, MessageCircle, Menu, X, Loader2, User, LogOut, ChevronDown, Globe } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import logo from '../../assets/sewasathi_logo.png';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../common/LanguageToggle';

const DashboardHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user } = useAuth();
  const { unreadCount } = useNotifications();
  const { t, i18n } = useTranslation();
  const [profileImg, setProfileImg] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

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

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ne' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleHelpClick = () => {
    const adminWhatsApp = "9779865271261";
    const message = encodeURIComponent("Hello SewaSaathi Support, I need help with...");
    window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, '_blank');
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setIsProfileOpen(false);
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
            <Link to="/customer-dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
              <img src={logo} alt="SewaSaathi Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-[#1B3C53] tracking-tight">SewaSaathi</span>
            </Link>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/customer-dashboard" className="text-gray-700 hover:text-[#1B3C53] transition">{t('nav.home')}</Link>
            <Link to="/services-category" className="text-gray-700 hover:text-[#1B3C53] transition">{t('nav.services')}</Link>
            <Link to="/my-bookings" className="text-gray-700 hover:text-[#1B3C53] transition">{t('nav.my_bookings')}</Link>
            <Link to="/about-us" className="text-gray-700 hover:text-[#1B3C53] transition">{t('nav.about_us')}</Link>
            <Link to="/contact" className="text-gray-700 hover:text-[#1B3C53] transition">{t('nav.contact')}</Link>
          </nav>

          <div className="hidden md:flex items-center space-x-6">
            {/* Notification Icon */}
            <Link
              to="/notifications"
              className="p-2 rounded-full hover:bg-gray-100 transition relative group"
              aria-label="Notifications"
            >
              <Bell className="w-6 h-6 text-[#1B3C53] group-hover:scale-110 transition-transform" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold leading-none text-white transform bg-red-600 rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </Link>

            {/* Language Toggle */}
            <LanguageToggle />

            {/* Help Button */}
            <button 
              onClick={handleHelpClick}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition group" 
              aria-label="Help"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm">{t('common.help')}</span>
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 p-1 pr-3 rounded-full hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
                aria-label="Profile Menu"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#1B3C53]/10 shadow-sm">
                  <img 
                    src={profileImg || `https://ui-avatars.com/api/?name=${user?.first_name || "U"}&background=E5E7EB&color=1B3C53&bold=true`} 
                    alt="Profile" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>

              {isProfileOpen && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  
                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-sm font-semibold text-[#1B3C53] truncate">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{t('common.view_profile')}</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      {isLoggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      <span>{isLoggingOut ? t('common.logging_out') : t('common.logout')}</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
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

        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <Link to="/" className="block text-gray-700 hover:text-[#1B3C53]">{t('nav.home')}</Link>
            <Link to="/services" className="block text-gray-700 hover:text-[#1B3C53]">{t('nav.services')}</Link>
            <Link to="/about" className="block text-gray-700 hover:text-[#1B3C53]">{t('nav.about_us')}</Link>
            <Link to="/contact" className="block text-gray-700 hover:text-[#1B3C53]">{t('nav.contact')}</Link>
            <Link to="/notifications" className="flex items-center justify-between text-gray-700 hover:text-[#1B3C53]">
              <span>{t('nav.notifications')}</span>
              {unreadCount > 0 && (
                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="flex flex-col space-y-2 pt-2">
              <Link to="/profile" className="w-full px-6 py-2 border border-gray-300 rounded-full text-center text-[#1B3C53]">
                {t('common.view_profile')}
              </Link>

              <div className="flex items-center justify-between px-2 pt-2 pb-2">
                {/* Help button for mobile */}
                <button 
                  onClick={handleHelpClick}
                  className="flex items-center space-x-2 text-red-600 font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('common.help')}</span>
                </button>

                {/* Language switcher for mobile */}
                <LanguageToggle />
              </div>

              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`w-full px-6 py-2 rounded-full flex justify-center items-center transition ${isLoggingOut ? 'bg-[#1B3C53]/70 text-white cursor-not-allowed' : 'bg-[#1B3C53] text-white hover:bg-[#1a3248]'}`}
              >
                {isLoggingOut ? (
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                ) : null}
                {isLoggingOut ? t('common.logging_out') : t('common.logout')}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
