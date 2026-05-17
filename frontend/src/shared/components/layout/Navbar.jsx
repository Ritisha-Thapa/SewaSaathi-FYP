import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, Menu, X, Loader2, User, LogOut, ChevronDown, Globe } from 'lucide-react';
import { useAuth } from '../../../features/authentication/components/auths/AuthContext';
import { useNotifications } from '../../../features/notifications/components/NotificationContext';
import NotificationsPage from '../../../features/notifications/pages/NotificationsPage';
import { useTranslation } from 'react-i18next';
import logo from '../../../assets/sewasathi_logo.png';
import LanguageToggle from '../ui/LanguageToggle';

/**
 * Unified Navbar component for SewaSaathi
 * Handles landing page (guest/auth) and dashboard views
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuth();
  const { unreadCount } = useNotifications() || { unreadCount: 0 };
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const dashboardPath = user?.role === 'provider' ? '/provider/dashboard' : '/customer-dashboard';
  const isLandingPage = location.pathname === '/';

  // Fetch profile image for authenticated users
  useEffect(() => {
    const fetchProfile = async () => {
      if (!isAuthenticated) return;
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
  }, [isAuthenticated]);

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
      navigate('/login');
    }, 1500);
  };

  const navLinks = [
    { name: t('nav.home'), path: isAuthenticated ? dashboardPath : '/' },
    { name: t('nav.services'), path: '/services-category' },
    { name: t('nav.about_us'), path: '/about-us' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  // Add "My Bookings" for logged in customers
  if (isAuthenticated && user?.role === 'customer') {
    navLinks.splice(2, 0, { name: t('nav.my_bookings'), path: '/my-bookings' });
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3 max-w-7xl">
        <div className="flex items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center">
            <Link to={isAuthenticated ? dashboardPath : "/"} className="flex items-center gap-2 hover:opacity-80 transition">
              <img src={logo} alt="SewaSaathi Logo" className="h-10 w-auto" />
              <span className="text-2xl font-bold text-[#1B3C53] tracking-tight">SewaSaathi</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-[#1B3C53] ${location.pathname === link.path ? 'text-[#1B3C53]' : 'text-gray-600'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <LanguageToggle />

            {isAuthenticated ? (
              /* Authenticated View */
              <div className="flex items-center space-x-4">
                {/* Notifications */}
                {user?.role === 'customer' ? (
                  <button
                    type="button"
                    onClick={() => setIsNotificationsModalOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition relative group"
                  >
                    <Bell className="w-5 h-5 text-[#1B3C53] group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ) : (
                  <Link
                    to="/provider/notifications"
                    className="p-2 rounded-full hover:bg-gray-100 transition relative group"
                  >
                    <Bell className="w-5 h-5 text-[#1B3C53] group-hover:scale-110 transition-transform" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 inline-flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-600 rounded-full border-2 border-white">
                        {unreadCount}
                      </span>
                    )}
                  </Link>
                )}

                {/* Help Button */}
                <button
                  onClick={handleHelpClick}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition group"
                >
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="font-medium text-xs">{t('common.help')}</span>
                </button>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-1 pr-2 rounded-full hover:bg-gray-100 transition border border-transparent hover:border-gray-200"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-[#1B3C53]/10">
                      <img
                        src={profileImg || `https://ui-avatars.com/api/?name=${user?.first_name || "U"}&background=E5E7EB&color=1B3C53&bold=true`}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in duration-200 origin-top-right">
                        <div className="px-4 py-2 border-b border-gray-50 mb-1">
                          <p className="text-xs font-bold text-[#1B3C53] truncate">{user?.first_name} {user?.last_name}</p>
                          <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
                        </div>
                        <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <User className="w-4 h-4 text-gray-400" />
                          <span>{t('common.view_profile')}</span>
                        </Link>
                        <button onClick={handleLogout} disabled={isLoggingOut} className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                          {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
                          <span>{isLoggingOut ? t('common.logging_out') : t('common.logout')}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              /* Guest View */
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-5 py-2 text-sm font-semibold text-[#1B3C53] border border-[#1B3C53] rounded-full hover:bg-[#1B3C53] hover:text-white transition">
                  {t('landing.login')}
                </Link>
                <Link to="/signup/customer" className="px-5 py-2 text-sm font-semibold text-white bg-[#1B3C53] rounded-full hover:bg-[#1a3248] transition shadow-md">
                  {t('landing.book_service')}
                </Link>
                <button
                  onClick={handleHelpClick}
                  className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                  title={t('common.help')}
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 text-[#1B3C53]" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-gray-100 mt-3 space-y-3 animate-in slide-in-from-top duration-300">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className="block py-2 text-base font-medium text-gray-700 hover:text-[#1B3C53]"
              >
                {link.name}
              </Link>
            ))}

            <div className="pt-4 space-y-3 border-t border-gray-100">
              {isAuthenticated ? (
                <>
                  {user?.role === 'customer' ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsMenuOpen(false);
                        setIsNotificationsModalOpen(true);
                      }}
                      className="w-full flex items-center justify-between py-2 text-gray-700"
                    >
                      <span>{t('nav.notifications')}</span>
                      {unreadCount > 0 && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount}</span>}
                    </button>
                  ) : (
                    <Link to="/provider/notifications" className="flex items-center justify-between py-2 text-gray-700">
                      <span>{t('nav.notifications')}</span>
                      {unreadCount > 0 && <span className="bg-red-600 text-white text-[10px] px-2 py-0.5 rounded-full">{unreadCount}</span>}
                    </Link>
                  )}
                  <Link to="/profile" className="block py-2 text-gray-700">{t('common.view_profile')}</Link>
                  <button onClick={handleLogout} className="w-full py-3 bg-[#1B3C53] text-white rounded-xl text-center font-bold">
                    {isLoggingOut ? t('common.logging_out') : t('common.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="block w-full py-3 border border-[#1B3C53] text-[#1B3C53] rounded-xl text-center font-bold">
                    {t('landing.login')}
                  </Link>
                  <Link to="/signup/customer" className="block w-full py-3 bg-[#1B3C53] text-white rounded-xl text-center font-bold">
                    {t('landing.book_service')}
                  </Link>
                </>
              )}

              <div className="flex items-center justify-between pt-2">
                <button onClick={handleHelpClick} className="flex items-center space-x-2 text-red-600 font-medium">
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('common.help')}</span>
                </button>
                <LanguageToggle />
              </div>
            </div>
          </div>
        )}
      </div>

      {isNotificationsModalOpen && user?.role === 'customer' && (
        <NotificationsPage
          isModal
          forceCustomer
          onClose={() => setIsNotificationsModalOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;
