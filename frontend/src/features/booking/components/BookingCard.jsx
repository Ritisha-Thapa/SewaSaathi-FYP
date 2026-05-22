import React from 'react';
import { Calendar, MapPin, CheckCircle, User, Phone, Banknote, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/ui/Button';

const BookingCard = ({
    booking,
    claims,
    isEligibleForClaim,
    onViewImage,
    handleResolution,
    onPayNow
}) => {
    const { t } = useTranslation();

    const getStatusStyles = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-700';
            case 'paid': return 'bg-emerald-100 text-emerald-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'accepted': return 'bg-blue-100 text-blue-700';
            case 'in_progress': return 'bg-orange-100 text-orange-700';
            case 'refunded': return 'bg-purple-100 text-purple-700';
            case 'not_accepted': return 'bg-red-100 text-red-700';
            case 'cancelled': return 'bg-gray-100 text-gray-600';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const claim = claims[booking.id];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
                <div className="flex flex-wrap items-center justify-start gap-x-2 gap-y-1 text-left mb-2">
                    <h3 className="mb-0 text-xl font-bold text-[#1B3C53]">{t(`service_names.${booking.service_name_key}`)}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getStatusStyles(booking.status)}`}>
                        {booking.status === 'refunded' ? t('bookings.refunded') :
                            booking.is_rework && booking.status === 'completed' ? t('bookings.rework_completed') :
                                booking.is_rework && booking.status === 'in_progress' ? t('bookings.rework_in_progress') :
                                    t(`status.${booking.status}`, { defaultValue: booking.status.replace('_', ' ') })}
                    </span>
                    {booking.status === 'paid' && (
                        <span className="ml-2 px-2 py-1 rounded-full text-xs font-semibold uppercase bg-blue-600 text-white">
                            {booking.payment_method === 'cash' ? 'Cash' : 'Online'}
                        </span>
                    )}
                    {claim && (
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${claim.status === 'approved' ? 'bg-green-600 text-white' :
                            claim.status === 'rejected' ? 'bg-red-600 text-white' : 'bg-orange-400 text-white'
                            }`}>
                            Claim {claim.status}
                        </span>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-600 text-sm">
                    <div className="flex items-center gap-2">
                        <Calendar size={16} />
                        <span>{booking.scheduled_date} at {booking.scheduled_time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <MapPin size={16} />
                        <span className="truncate">{booking.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <CheckCircle size={16} className={booking.is_paid ? "text-green-500" : "text-red-500"} />
                        <span>
                            {booking.is_paid ? t('bookings.paid') : t('bookings.unpaid')} - Rs. {booking.total_price}
                            {booking.is_paid && booking.paid_at && (
                                <span className="ml-2 text-xs font-normal text-gray-500">
                                    (Original payment at {new Date(booking.paid_at).toLocaleString()})
                                </span>
                            )}
                        </span>
                    </div>

                    {booking.provider && (
                        <div className="flex items-center gap-2 col-span-1 sm:col-span-2 text-gray-700 bg-blue-50 p-3 rounded-lg mt-2">
                            <div className="flex items-center gap-4 w-full">
                                <div className="flex items-center gap-1.5 font-medium">
                                    <User size={16} className="text-blue-600" />
                                    <span>{booking.provider_name}</span>
                                </div>
                                <div className="flex items-center gap-1.5 border-l border-blue-200 pl-4 font-medium">
                                    <Phone size={16} className="text-blue-600" />
                                    <span>{booking.provider_phone || "No phone given"}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {booking.issue_images && (
                        <div className="col-span-1 sm:col-span-2 mt-2">
                            <Button
                                onClick={() => onViewImage(booking.issue_images)}
                                variant="secondary"
                                size="sm"
                                fullWidth={false}
                            >
                                <ImageIcon size={16} className="shrink-0" />
                                {t('bookings.view_attached_image')}
                            </Button>
                        </div>
                    )}

                    {claim && claim.status === 'approved' && claim.resolution === 'none' && (
                        <div className="col-span-1 sm:col-span-2 mt-4 p-4 bg-green-50 rounded-xl border border-green-200">
                            <p className="font-bold text-green-800 mb-2">{t('bookings.claim_approved')}</p>
                            <div className="flex flex-wrap gap-3">
                                <Button
                                    onClick={() => handleResolution(booking.id, 'refund')}
                                    variant="pay"
                                    size="sm"
                                    fullWidth={false}
                                >
                                    {t('bookings.refund_80')}
                                </Button>
                                <Button
                                    onClick={() => handleResolution(booking.id, 'rework')}
                                    variant="primary"
                                    size="sm"
                                    fullWidth={false}
                                >
                                    {t('bookings.request_rework')}
                                </Button>
                            </div>
                        </div>
                    )}

                    {claim && claim.resolution !== 'none' && (
                        <div className="col-span-1 sm:col-span-2 mt-4 p-3 bg-gray-100 rounded-xl border border-gray-200">
                            <p className="font-bold text-gray-800">{t('bookings.resolution')}: <span className="capitalize">{claim.resolution}</span></p>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-col gap-2 w-full md:w-auto min-w-[160px]">
                {booking.status === 'completed' && !booking.is_paid && (
                    <Button
                        onClick={() => onPayNow(booking)}
                        variant="pay"
                        size="sm"
                    >
                        <Banknote size={18} className="shrink-0" />
                        {t('bookings.pay_now')}
                    </Button>
                )}

                {isEligibleForClaim(booking) && !claim && (
                    <Button
                        to={`/claim-insurance/${booking.id}`}
                        variant="insurance"
                        size="sm"
                    >
                        <AlertCircle size={18} className="shrink-0" />
                        {t('bookings.claim_insurance')}
                    </Button>
                )}
                <Button
                    to={`/services/${booking.service_category_slug || booking.service_category_name}/${booking.service}`}
                    variant="secondary"
                    size="sm"
                >
                    {t('bookings.view_service')}
                </Button>
            </div>
        </div>
    );
};

export default BookingCard;
