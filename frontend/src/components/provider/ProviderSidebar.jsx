import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardList,
  Briefcase,
  PlayCircle,
  Wrench,
  Wallet,
  Star,
  Calendar,
  UserCircle,
  X,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProviderSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();

  const navItems = [
    { to: '/provider/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/provider/requests', icon: ClipboardList, label: 'Job Requests' },
    { to: '/provider/assigned', icon: Briefcase, label: 'Assigned Jobs' },
    { to: '/provider/active', icon: PlayCircle, label: 'Active Jobs' },
    { to: '/provider/services', icon: Wrench, label: 'My Services' },
    { to: '/provider/earnings', icon: Wallet, label: 'Earnings' },
    { to: '/provider/schedule', icon: Calendar, label: 'Schedule' },
    { to: '/provider/reviews', icon: Star, label: 'Reviews' },
    { to: '/provider/profile', icon: UserCircle, label: 'Profile' },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed top-0 left-0 h-full bg-[#1B3C53] text-white z-30 transition-transform duration-300 ease-in-out w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a4d69]">
          <h2 className="text-xl font-bold">Provider Panel</h2>
          <button onClick={toggleSidebar} className="lg:hidden">
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-80px)]">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => window.innerWidth < 1024 && toggleSidebar()} // Close on mobile click
              className={({ isActive }) => `
                flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                ${isActive ? 'bg-[#2a4d69] text-white shadow-md' : 'text-gray-300 hover:bg-[#2a4d69] hover:text-white'}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-8 mt-4 border-t border-[#2a4d69]">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-3 px-4 py-3 w-full text-left text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default ProviderSidebar;
