import { useNotifications } from '../components/NotificationContext';
import { Bell, Check, Calendar, Clock, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/ui/Button';

const NotificationsPage = ({ isModal = false, onClose = null, forceCustomer = false }) => {
    const { t, i18n } = useTranslation();
    const { notifications, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
    const location = useLocation();
    const isProvider = !forceCustomer && location.pathname.startsWith('/provider');

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString(i18n.language === 'ne' ? 'ne-NP' : 'en-IN');
    };

    const renderNotificationContent = (notification) => {
        const { notification_type, extra_data = {} } = notification;
        const translatedData = { ...extra_data };

        if (translatedData.service_name_key) {
            translatedData.service_name_key = t(`service_names.${translatedData.service_name_key}`, {
                defaultValue: translatedData.service_name_key
            });
        }

        if (translatedData.category_name_key) {
            translatedData.category_name_key = t(`categories.${translatedData.category_name_key}`, {
                defaultValue: translatedData.category_name_key
            });
        }

        const fallbackMessage =
            translatedData.legacy_message ||
            translatedData.message ||
            t('notifications.default_message', 'You have a new update.');

        const title = t(`notifications.${notification_type}_title`, t('notifications.new_notification', "New Notification"));
        const message = t(`notifications.${notification_type}_message`, {
            ...translatedData,
            defaultValue: fallbackMessage,
        });

        return { title, message };
    };

    const content = (
        <div className={`${isProvider ? '' : isModal ? '' : 'min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8'}`}>
            <div className={`${isProvider ? '' : isModal ? '' : 'max-w-4xl mx-auto'}`}>
                {!isProvider && (
                    <div className="flex justify-between items-center mb-8">
                        {isModal ? (
                            <button
                                type="button"
                                onClick={onClose}
                                className="text-primary hover:underline text-sm font-bold inline-flex items-center gap-2"
                            >
                                <X size={16} /> {t('common.close', 'Close')}
                            </button>
                        ) : (
                            <Link to="/" className="text-primary hover:underline text-sm font-bold flex items-center gap-2">
                                <span>←</span> {t('landing.go_to_dashboard', 'Go to Dashboard')}
                            </Link>
                        )}
                    </div>
                )}

                <div className="bg-white rounded-3xl shadow-xl shadow-primary/5 overflow-hidden border border-gray-100">
                    <div className="p-8 border-b border-gray-100 flex justify-between items-center bg-primary text-white">
                        <div className="flex items-center space-x-4">
                            <div className="p-2 bg-white/10 rounded-lg">
                                <Bell className="w-6 h-6" />
                            </div>
                            <h1 className="text-2xl font-black uppercase tracking-tight">
                                {t('nav.notifications')}
                            </h1>
                        </div>

                        {notifications.length > 0 && (
                            <Button
                                onClick={markAllAsRead}
                                variant="secondary"
                                fullWidth={false}
                                rounded="full"
                                className="bg-white/10 hover:bg-white/20 border-white/20 text-white !py-2 !px-5 text-xs font-bold uppercase tracking-wider"
                            >
                                {t('notifications.mark_all_as_read', 'Mark all as read')}
                            </Button>
                        )}
                    </div>

                    <div className="divide-y divide-gray-100">
                        {notifications.length === 0 ? (
                            <div className="p-20 text-center">
                                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Bell className="w-12 h-12 text-gray-200" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    {t('notifications.no_notifications', 'No notifications yet!')}
                                </h3>
                                <p className="text-gray-400 text-sm max-w-xs mx-auto">
                                    {t(
                                        'notifications.no_notifications_desc',
                                        "We'll notify you when something important happens regarding your bookings."
                                    )}
                                </p>
                            </div>
                        ) : (
                            notifications.map((notification) => {
                                const { title, message } = renderNotificationContent(notification);

                                return (
                                    <div
                                        key={notification.id}
                                        className={`p-8 transition hover:bg-gray-50 flex items-start space-x-6 ${!notification.is_read ? 'bg-primary/5 border-l-4 border-primary' : ''
                                            }`}
                                    >
                                        <div
                                            className={`p-4 rounded-2xl shadow-sm ${!notification.is_read
                                                ? 'bg-white text-primary'
                                                : 'bg-gray-100 text-gray-400'
                                                }`}
                                        >
                                            <Bell size={24} />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3
                                                    className={`font-black text-xl leading-tight ${!notification.is_read ? 'text-primary' : 'text-gray-700'
                                                        }`}
                                                >
                                                    {title}
                                                </h3>

                                                <span className="text-xs font-bold text-gray-400 flex items-center bg-gray-50 px-2 py-1 rounded-md">
                                                    <Clock size={12} className="mr-1.5" />
                                                    {formatTime(notification.created_at)}
                                                </span>
                                            </div>

                                            <p className="text-gray-600 mt-2 text-base leading-relaxed">
                                                {message}
                                            </p>

                                            <div className="mt-6 flex items-center space-x-6">
                                                {!notification.is_read && (
                                                    <Button
                                                        onClick={() => markAsRead(notification.id)}
                                                        variant="ghost"
                                                        fullWidth={false}
                                                        className="!p-0 h-auto text-primary font-black text-sm uppercase tracking-tight flex items-center hover:bg-transparent hover:translate-x-1"
                                                    >
                                                        <Check size={18} className="mr-2" />
                                                        {t('notifications.mark_as_read', 'Mark as read')}
                                                    </Button>
                                                )}

                                                {notification.booking && (
                                                    <Link
                                                        to={isProvider ? `/provider/requests` : `/my-bookings`}
                                                        className="text-sm font-black text-gray-900 uppercase tracking-tight flex items-center hover:translate-x-1 transition-transform"
                                                    >
                                                        <Calendar size={18} className="mr-2 text-primary" />
                                                        {t('bookings.view_service', 'View Service')}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    if (!isModal) {
        return content;
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm p-4 sm:p-6" onClick={onClose}>
            <div
                className="w-full max-w-4xl mx-auto max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {content}
            </div>
        </div>
    );
};

export default NotificationsPage;