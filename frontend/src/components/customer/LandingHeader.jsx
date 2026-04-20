import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Menu, X, Globe } from 'lucide-react';
import logo from '../../assets/sewasathi_logo.png';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../common/LanguageToggle';

const LandingHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { t, i18n } = useTranslation();
  const dashboardPath = user?.role === 'provider' ? '/provider/dashboard' : '/customer-dashboard';

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ne' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleHelpClick = () => {
    const adminWhatsApp = "9779865271261";
    const message = encodeURIComponent("Hello SewaSaathi Support, I need help with...");
    window.open(`https://wa.me/${adminWhatsApp}?text=${message}`, '_blank');
  };

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

          {/* Desktop CTA & Help & Language */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <LanguageToggle />

            {isAuthenticated ? (
              <Link to={dashboardPath} className="inline-block px-6 py-2 bg-[#1B3C53] text-white rounded-full hover:bg-[#1a3248] transition">
                {t('landing.go_to_dashboard')}
              </Link>
            ) : (
              <>
                <Link to="/login" className="inline-block px-6 py-2 border-2 border-[#1B3C53] text-[#1B3C53] rounded-full hover:bg-[#1B3C53] hover:text-white transition">
                  {t('landing.login')}
                </Link>
                <Link to="/signup/customer" className="inline-block px-6 py-2 bg-[#1B3C53] text-white rounded-full hover:bg-[#1a3248] transition">
                  {t('landing.book_service')}
                </Link>
              </>
            )}
            
            {/* Help Button */}
            <button 
              onClick={handleHelpClick}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition group" 
              aria-label="Help"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium">{t('common.help')}</span>
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-4">
            <div className="flex flex-col space-y-3 pt-2">
              <Link to="/signup/customer" className="w-full px-6 py-2 bg-[#1B3C53] text-white rounded-full text-center">
                {t('landing.book_service')}
              </Link>
              <Link to="/signup/provider" className="w-full px-6 py-2 border-2 border-[#1B3C53] text-[#1B3C53] rounded-full text-center">
                {t('landing.become_provider')}
              </Link>
              
              <div className="flex items-center justify-between px-2 pt-2">
                <button 
                  onClick={handleHelpClick}
                  className="flex items-center space-x-2 text-red-600 font-medium"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>{t('common.help')}</span>
                </button>

                <LanguageToggle />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default LandingHeader;
