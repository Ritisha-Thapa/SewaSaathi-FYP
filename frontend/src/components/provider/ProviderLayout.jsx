import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import ProviderSidebar from './ProviderSidebar';
import { Menu, Bell, MessageCircle, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageToggle from '../common/LanguageToggle';

const ProviderLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

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
    <div className="min-h-screen bg-[#F9F5F0] flex">
      {/* Sidebar */}
      <ProviderSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">

        {/* Top Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 lg:px-8 z-10 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="lg:hidden text-gray-600 hover:text-[#1B3C53]">
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-semibold text-[#1B3C53] hidden sm:block">
              SewaSaathi {t('nav.dashboard')}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* Language Toggle */}
            <LanguageToggle />

            {/* Help Button */}
            <button 
              onClick={handleHelpClick}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition group" 
              aria-label="Help"
            >
              <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium text-sm hidden xs:inline">{t('common.help')}</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default ProviderLayout;
