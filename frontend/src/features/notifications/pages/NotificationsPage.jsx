import { useNotifications } from '../components/NotificationContext';
import { Bell, Check, Calendar, Clock, X, CheckCircle2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/ui/Button';

const PAGE_SIZE = 20;

const NotificationsPage = ({ isModal = false, onClose = null, forceCustomer = false }) => {
    const { t, i18n } = useTranslation();
    const { notifications, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
    const location = useLocation();
    const isProvider = !forceCustomer && location.pathname.startsWith('/provider');
    const isCustomerView = forceCustomer || !isProvider;
    const [displayCount, setDisplayCount] = useState(PAGE_SIZE);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    useEffect(() => {
        if (isCustomerView) {
            setDisplayCount(PAGE_SIZE);
        }
    }, [isCustomerView, isModal, location.pathname]);

    const displayedNotifications = isCustomerView
        ? notifications.slice(0, displayCount)
        : notifications;
    const hasMore = isCustomerView && displayCount < notifications.length;

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

    const innerContent = (
        <div className={`flex flex-col bg-white overflow-hidden ${isModal ? 'w-full h-full' : 'max-w-3xl mx-auto rounded-2xl shadow-sm border border-gray-100'}`}>
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 bg-primary/10 text-primary rounded-xl shrink-0">
                        <Bell className="w-5 h-5" />
                    </div>
                    <h1 className="text-lg sm:text-xl font-bold text-gray-900 leading-none mb-0.5">
                        {t('nav.notifications')}
                    </h1>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                    {notifications.length > 0 && (
                        <Button
                            type="button"
                            onClick={markAllAsRead}
                            variant="ghost"
                            size="sm"
                            fullWidth={false}
                            className="bg-primary/10 hover:bg-primary/20"
                        >
                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                            <span className="hidden sm:inline">{t('notifications.mark_all_as_read', 'Mark all as read')}</span>
                        </Button>
                    )}
                    {isModal && (
                        <>
                            {notifications.length > 0 && <div className="w-px h-6 bg-gray-200 hidden sm:block"></div>}
                            <Button
                                type="button"
                                onClick={onClose}
                                variant="icon"
                                fullWidth={false}
                                aria-label={t('common.close', 'Close')}
                            >
                                <X size={20} />
                            </Button>
                        </>
                    )}
                </div>
            </div>

            {/* List */}
            <div className="divide-y divide-gray-100 overflow-y-auto flex-1">
                {notifications.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                            <Bell className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {t('notifications.no_notifications', 'No notifications yet!')}
                        </h3>
                        <p className="text-gray-500 text-sm max-w-sm">
                            {t(
                                'notifications.no_notifications_desc',
                                "We'll notify you when something important happens regarding your bookings."
                            )}
                        </p>
                    </div>
                ) : (
                    <>
                    {displayedNotifications.map((notification) => {
                        const { title, message } = renderNotificationContent(notification);

                        return (
                            <div
                                key={notification.id}
                                className={`p-4 sm:p-5 transition-colors hover:bg-gray-50 group flex items-start gap-4 ${!notification.is_read ? 'bg-blue-50/30' : ''}`}
                            >
                                {/* Icon */}
                                <div className="relative shrink-0 mt-0.5">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full ${!notification.is_read ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                        <Bell size={18} />
                                    </div>
                                    {!notification.is_read && (
                                        <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-blue-500 border-2 border-white rounded-full"></span>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4">
                                        <h3 className={`text-sm sm:text-base font-semibold truncate leading-tight mt-0.5 ${!notification.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                                            {title}
                                        </h3>
                                        <span className="shrink-0 text-xs text-gray-400 flex items-center mt-1 sm:mt-0.5">
                                            <Clock size={12} className="mr-1" />
                                            {formatTime(notification.created_at)}
                                        </span>
                                    </div>

                                    <p className={`mt-1 text-sm line-clamp-2 ${!notification.is_read ? 'text-gray-700' : 'text-gray-500'}`}>
                                        {message}
                                    </p>

                                    <div className="mt-3 flex items-center gap-4">
                                        {notification.booking && (
                                            <Button
                                                to={isProvider ? `/provider/requests` : `/my-bookings`}
                                                variant="secondary"
                                                size="sm"
                                                fullWidth={false}
                                            >
                                                <Calendar size={14} className="shrink-0" />
                                                {t('bookings.view_service', 'View Service')}
                                            </Button>
                                        )}

                                        {!notification.is_read && (
                                            <Button
                                                type="button"
                                                onClick={() => markAsRead(notification.id)}
                                                variant="ghost"
                                                size="sm"
                                                fullWidth={false}
                                                className="!px-0"
                                            >
                                                <Check size={14} className="shrink-0" />
                                                {t('notifications.mark_as_read', 'Mark as read')}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {hasMore && (
                        <div className="p-4 sm:p-5 border-t border-gray-100 flex justify-center shrink-0">
                            <Button
                                type="button"
                                onClick={() => setDisplayCount((prev) => prev + PAGE_SIZE)}
                                variant="secondary"
                                size="sm"
                                fullWidth={false}
                            >
                                {t('notifications.load_more', 'Load more')}
                            </Button>
                        </div>
                    )}
                    </>
                )}
            </div>
        </div>
    );

    if (!isModal) {
        return (
            <div className={`${isProvider ? '' : 'min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8'}`}>
                {!isProvider && (
                    <div className="max-w-3xl mx-auto mb-6">
                        <Link to="/" className="text-gray-500 hover:text-primary text-sm font-medium flex items-center gap-2 transition-colors inline-flex">
                            <span>←</span> {t('landing.go_to_dashboard', 'Go to Dashboard')}
                        </Link>
                    </div>
                )}
                {innerContent}
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm p-4 sm:p-6 flex items-center justify-center animate-in fade-in duration-200" onClick={onClose}>
            <div
                className="w-full max-w-2xl max-h-[85vh] bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {innerContent}
            </div>
        </div>
    );
};

export default NotificationsPage;