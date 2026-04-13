import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { api } from '../../utils/api';
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
  LogOut,
  Clock,
  Bell,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';


const ProviderSidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [counts, setCounts] = useState({ pending: 0, active: 0 });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const stats = await api.get('/booking/bookings/stats/');
        setCounts({ 
          pending: stats.pending, 
          active: stats.active 
        });
      } catch (err) {
        console.error("Failed to fetch counts in sidebar", err);
      }
    };

    fetchCounts();
    // Refresh counts every 30 seconds for real-time feel
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    { to: '/provider/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/provider/requests', icon: ClipboardList, label: 'Job Requests' },
    { to: '/provider/active', icon: PlayCircle, label: 'Active Jobs' },
    { to: '/provider/history', icon: Clock, label: 'Booking History' },
    { to: '/provider/services', icon: Wrench, label: 'My Services' },
    { to: '/provider/earnings', icon: Wallet, label: 'Earnings' },
    { to: '/provider/reviews', icon: Star, label: 'Reviews' },
    { to: '/provider/profile', icon: UserCircle, label: 'Profile' },
    { to: '/provider/notifications', icon: Bell, label: 'Notifications' },
  ];

  const handleLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      logout();
      window.location.href = '/login';
    }, 1500);
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
        <div className="flex items-center justify-between p-4 border-b border-white/10">
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
                flex items-center justify-between px-4 py-3 rounded-lg transition-colors w-full
                ${isActive ? 'bg-white/10 text-white shadow-md' : 'text-gray-300 hover:bg-white/5 hover:text-white'}
              `}
            >
              <div className="flex items-center space-x-3">
                <item.icon size={20} />
                <span>{item.label}</span>
              </div>
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {unreadCount}
                </span>
              )}
              {item.label === 'Job Requests' && counts.pending > 0 && (
                <span className="bg-green-400 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {counts.pending}
                </span>
              )}
              {item.label === 'Active Jobs' && counts.active > 0 && (
                <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                  {counts.active}
                </span>
              )}
            </NavLink>
          ))}

          <div className="pt-8 mt-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`flex items-center space-x-3 px-4 py-3 w-full text-left rounded-lg transition-colors ${isLoggingOut ? 'text-red-300/50 cursor-not-allowed' : 'text-red-300 hover:bg-red-900/30'}`}
            >
              {isLoggingOut ? (
                <Loader2 className="animate-spin h-5 w-5 text-red-300" />
              ) : (
                <LogOut size={20} />
              )}
              <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default ProviderSidebar;
