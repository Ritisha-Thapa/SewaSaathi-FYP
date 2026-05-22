import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/ui/Button';

const BookingEmptyState = ({ type, onClearFilters }) => {
    const { t } = useTranslation();

    if (type === 'no_match') {
        return (
            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                <p className="text-gray-500 text-lg">{t('bookings.no_bookings_match')}</p>
                <Button
                    onClick={onClearFilters}
                    variant="ghost"
                    fullWidth={false}
                    className="!text-[#1B3C53] font-bold mt-4 inline-block underline !p-0 h-auto"
                >
                    {t('bookings.clear_filters')}
                </Button>
            </div>
        );
    }

    return (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-500 text-lg">{t('bookings.no_bookings_found')}</p>
            <Button
                to="/services-category"
                variant="secondary"
                size="sm"
                fullWidth={false}
                className="mt-4"
            >
                {t('bookings.browse_services')}
            </Button>
        </div>
    );
};

export default BookingEmptyState;
