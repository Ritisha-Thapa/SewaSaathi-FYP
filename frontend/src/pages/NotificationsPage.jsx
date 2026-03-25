import { useNotifications } from '../context/NotificationContext';
import { Bell, Check, Trash2, Calendar, Clock, CheckCircle } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

const NotificationsPage = () => {
    const { notifications, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
    const location = useLocation();
    const isProvider = location.pathname.startsWith('/provider');

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className={`${isProvider ? '' : 'min-h-screen bg-[#F9F5F0] py-12 px-4 sm:px-6 lg:px-8'}`}>
            <div className={`${isProvider ? '' : 'max-w-4xl mx-auto'}`}>
                {!isProvider && (
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-3">
                            <Link to="/" className="text-[#1B3C53] hover:underline text-sm mb-2 block">← Back to Dashboard</Link>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-[#1B3C53] text-white">
                        <div className="flex items-center space-x-3">
                            <Bell className="w-6 h-6" />
                            <h1 className="text-xl font-bold">Notifications</h1>
                        </div>
                        {notifications.length > 0 && (
                            <button 
                                onClick={markAllAsRead}
                                className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full transition"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                            <div className="p-12 text-center">
                                <Bell className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg">No notifications yet!</p>
                                <p className="text-gray-400 text-sm">We'll notify you when something important happens.</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div 
                                    key={notification.id}
                                    className={`p-6 transition hover:bg-gray-50 flex items-start space-x-4 ${!notification.is_read ? 'bg-blue-50/50 border-l-4 border-blue-500' : ''}`}
                                >
                                    <div className={`p-3 rounded-full ${!notification.is_read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                                        <Bell size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h3 className={`font-bold text-lg ${!notification.is_read ? 'text-[#1B3C53]' : 'text-gray-700'}`}>
                                                {notification.title}
                                            </h3>
                                            <span className="text-xs text-gray-400 flex items-center">
                                                <Clock size={12} className="mr-1" />
                                                {formatTime(notification.created_at)}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 mt-1">{notification.message}</p>
                                        
                                        <div className="mt-4 flex items-center space-x-4">
                                            {!notification.is_read && (
                                                <button 
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center"
                                                >
                                                    <Check size={16} className="mr-1" />
                                                    Mark as read
                                                </button>
                                            )}
                                            {notification.booking && (
                                                <Link 
                                                    to={isProvider ? `/provider/requests` : `/my-bookings`} 
                                                    className="text-sm font-medium text-[#1B3C53] hover:underline flex items-center"
                                                >
                                                    <Calendar size={16} className="mr-1" />
                                                    View Booking
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
