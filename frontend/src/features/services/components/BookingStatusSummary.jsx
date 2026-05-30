import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, User, Phone, Image as ImageIcon, Banknote, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/ui/Button';

const BookingStatusSummary = ({
    bookingDetails,
    item,
    currentStatusMsg,
    onViewImage,
    onShowPayment,
    handleResolution,
    onCancelBooking
}) => {
    const { t, i18n } = useTranslation();
    const [showCancelDialog, setShowCancelDialog] = useState(false);
    const [cancelLoading, setCancelLoading] = useState(false);
    const [resolutionLoading, setResolutionLoading] = useState(null);

    const handleResolutionClick = async (type) => {
        setResolutionLoading(type);
        try {
            await handleResolution(type);
        } finally {
            setResolutionLoading(null);
        }
    };

    const handleConfirmCancel = async () => {
        setCancelLoading(true);
        try {
            await onCancelBooking(bookingDetails.id);
        } finally {
            setCancelLoading(false);
            setShowCancelDialog(false);
        }
    };
    const formatPrice = (n) => {
        const locale = i18n.language === "ne" ? "ne-NP" : "en-IN";
        return `${t("common.currency_prefix", "Rs.")} ${new Intl.NumberFormat(locale).format(Number(n || 0))}`;
    };

    return (
        <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                <Clock size={32} />
            </div>
            <div>
                <h4 className="text-xl font-bold text-gray-800">{currentStatusMsg.title}</h4>
                <p className="text-gray-500 text-sm mt-1">ID: #{bookingDetails.id}</p>
                <p className="text-gray-600 text-xs mt-2">{currentStatusMsg.message}</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl text-left text-sm space-y-2">
                <div className="flex justify-between">
                    <span className="text-gray-500">Service:</span>
                    <span className="font-medium">{item.name}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Date:</span>
                    <span className="font-medium">{bookingDetails.scheduled_date}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Time:</span>
                    <span className="font-medium">{bookingDetails.scheduled_time}</span>
                </div>

                {bookingDetails.provider && (
                    <div className="border border-blue-100 bg-blue-50/50 rounded-lg p-2 mt-2">
                        <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-500 flex items-center gap-1"><User size={12} /> Provider:</span>
                            <span className="font-medium text-blue-900">{bookingDetails.provider_name}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-gray-500 flex items-center gap-1"><Phone size={12} /> Contact:</span>
                            <span className="font-medium text-blue-900">{bookingDetails.provider_phone || "Not provided"}</span>
                        </div>
                    </div>
                )}

                <div className="border-t pt-2 mt-2 space-y-1">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Service Price:</span>
                        <span className="text-gray-700">{formatPrice(bookingDetails.service_price)}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">Insurance Fee (1%):</span>
                        <span className="text-gray-700">{formatPrice(bookingDetails.insurance_fee)}</span>
                    </div>
                    <div className="flex justify-between pt-1 border-t">
                        <span className="text-gray-700 font-bold">Total Bill:</span>
                        <span className="font-bold text-[#1B3C53]">{formatPrice(bookingDetails.total_price)}</span>
                    </div>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded border">
                    <span className="text-gray-500">Status:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${bookingDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        bookingDetails.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                            bookingDetails.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                                bookingDetails.status === 'completed' ? 'bg-green-100 text-green-700' :
                                    bookingDetails.status === 'not_accepted' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'
                        }`}>
                        {t(`status.${bookingDetails.status}`, { defaultValue: bookingDetails.status.replace('_', ' ') })}
                    </span>
                </div>
                <div className="flex justify-between items-center bg-white p-2 rounded border">
                    <span className="text-gray-500">Payment:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${bookingDetails.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {bookingDetails.is_paid ? "PAID" : "UNPAID"}
                    </span>
                </div>

                {bookingDetails.issue_images && (
                    <div className="flex justify-center mt-2">
                        <Button
                            onClick={onViewImage}
                            variant="secondary"
                            size="sm"
                            fullWidth={false}
                        >
                            <ImageIcon size={16} className="shrink-0" />
                            View Attached Image
                        </Button>
                    </div>
                )}

                {bookingDetails.latest_claim_status && (
                    <div className="flex justify-between items-center bg-white p-2 rounded border">
                        <span className="text-gray-500">Claim:</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${bookingDetails.latest_claim_status === 'approved' ? 'bg-green-100 text-green-700' :
                            bookingDetails.latest_claim_status === 'rejected' ? 'bg-red-100 text-red-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                            {bookingDetails.latest_claim_status}
                        </span>
                    </div>
                )}
            </div>

            {bookingDetails.status === 'completed' && !bookingDetails.is_paid && (
                <Button
                    onClick={onShowPayment}
                    variant="pay"
                    size="md"
                >
                    <Banknote size={20} className="shrink-0" />
                    Pay Now
                </Button>
            )}

            {bookingDetails.latest_claim_status === 'approved' && bookingDetails.latest_claim_resolution === 'none' && (
                <div className="space-y-3">
                    <Button
                        onClick={() => handleResolutionClick('refund')}
                        variant="pay"
                        size="md"
                        isLoading={resolutionLoading === 'refund'}
                        loadingText="Processing..."
                        disabled={resolutionLoading !== null}
                    >
                        <CheckCircle size={18} className="shrink-0" />
                        80% Refund
                    </Button>
                    <Button
                        onClick={() => handleResolutionClick('rework')}
                        variant="primary"
                        size="md"
                        isLoading={resolutionLoading === 'rework'}
                        loadingText="Processing..."
                        disabled={resolutionLoading !== null}
                    >
                        Request Rework
                    </Button>
                    <p className="text-[10px] text-gray-500 text-center italic">
                        Choosing refund will process your money back within 3 days.
                    </p>
                </div>
            )}

            {bookingDetails.status === 'completed' && !bookingDetails.is_paid && (
                <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100 text-left">
                    <p className="font-semibold mb-1">Next Steps:</p>
                    <p>1. Provider has completed the work</p>
                    <p>2. Please make payment to finish</p>
                    <p>3. Insurance claim available after payment</p>
                </div>
            )}

            {bookingDetails.status === 'pending' && (
                <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100 text-left">
                    <p className="font-semibold mb-1">Next Steps:</p>
                    <p>1. Provider will review your request</p>
                    <p>2. You'll be notified when accepted</p>
                    <p>3. Payment available after completion</p>
                </div>
            )}

            {bookingDetails.status === 'pending' && onCancelBooking && (
                <Button
                    onClick={() => setShowCancelDialog(true)}
                    variant="danger-outline"
                    size="md"
                >
                    {t('bookings.cancel_booking', 'Cancel Booking')}
                </Button>
            )}

            <div className="pt-2">
                <Link to="/customer-dashboard" className="text-[#1B3C53] underline text-sm hover:text-blue-700">Go to Dashboard</Link>
            </div>

            {showCancelDialog && (
                <div className="fixed inset-0 bg-[#F9F5F0]/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-[#1B3C53]">{t('bookings.cancel_booking', 'Cancel Booking')}</h3>
                            <Button type="button" onClick={() => !cancelLoading && setShowCancelDialog(false)} variant="icon" fullWidth={false} disabled={cancelLoading}>
                                <X size={24} />
                            </Button>
                        </div>
                        <div className="flex flex-col items-center p-6 rounded-xl bg-red-50 border border-red-200 mb-6">
                            <AlertCircle size={48} className="text-red-500" />
                            <p className="text-center text-gray-700 mt-4">
                                {t('bookings.cancel_confirm_message', 'Are you sure you want to cancel this booking?')}
                            </p>
                        </div>
                        <div className="flex gap-3">
                            <Button type="button" onClick={() => !cancelLoading && setShowCancelDialog(false)} variant="secondary" size="md" disabled={cancelLoading} className="flex-1">
                                {t('common.dismiss', 'Dismiss')}
                            </Button>
                            <Button type="button" onClick={handleConfirmCancel} variant="danger" size="md" isLoading={cancelLoading} loadingText={t('common.processing', 'Processing...')} className="flex-1">
                                {t('bookings.confirm_cancel', 'Yes, Cancel')}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookingStatusSummary;
