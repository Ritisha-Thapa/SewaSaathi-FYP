import React from 'react';
import { Filter } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const BookingFilters = ({
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    timeFilter,
    setTimeFilter,
    uniqueServices
}) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex items-center gap-2 text-[#1B3C53] font-bold w-full md:w-auto text-lg mb-2 md:mb-0 border-b md:border-b-0 pb-2 md:pb-0">
                <Filter size={24} />
                <span>{t('bookings.filter_by')} </span>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B3C53] bg-gray-50 text-gray-700"
                >
                    <option value="all">{t('bookings.all_statuses')}</option>
                    <option value="pending">{t('status.pending')}</option>
                    <option value="accepted">{t('status.accepted', 'Accepted')}</option>
                    <option value="in_progress">{t('status.in_progress')}</option>
                    <option value="completed">{t('status.completed')}</option>
                    <option value="paid">{t('bookings.paid')}</option>
                    <option value="not_accepted">{t('status.not_accepted', 'Not Accepted')}</option>
                    <option value="cancelled">{t('status.cancelled', 'Cancelled')}</option>
                </select>
                <select
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B3C53] bg-gray-50 text-gray-700"
                >
                    {uniqueServices.map(service => (
                        <option key={service} value={service}>
                            {service === 'all' ? t('bookings.all_services') : t(`service_names.${service}`)}
                        </option>
                    ))}
                </select>
                <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#1B3C53] bg-gray-50 text-gray-700"
                >
                    <option value="all">{t('bookings.any_time')}</option>
                    <option value="today">{t('bookings.today')}</option>
                    <option value="this_week">{t('bookings.this_week')}</option>
                    <option value="this_month">{t('bookings.this_month')}</option>
                </select>
            </div>
        </div>
    );
};

export default BookingFilters;
