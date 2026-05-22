import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { api, getCached, invalidateCache } from '../../../utils/api';
import Navbar from '../../../shared/components/layout/Navbar';
import Footer from '../../../shared/components/layout/Footer';
import Skeleton from '../../../shared/components/layout/Skeleton';
import Pagination from '../../../shared/components/layout/Pagination';
import ReviewModal from '../../../shared/components/ui/ReviewModal';
import ImageModal from '../../../shared/components/ui/ImageModal';
import PaymentModal from '../../payment/components/PaymentModal';
import { useTranslation } from 'react-i18next';
import { toast } from '../../../shared/components/layout/ToastProvider';

// New sub-components
import BookingCard from '../components/BookingCard';
import BookingFilters from '../components/BookingFilters';
import BookingEmptyState from '../components/BookingEmptyState';

const MyBookings = () => {
    const { t, i18n } = useTranslation();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [bookings, setBookings] = useState([]);
    const [claims, setClaims] = useState({});
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState('all');
    const [serviceFilter, setServiceFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedBookingForPayment, setSelectedBookingForPayment] = useState(null);

    const [selectedImage, setSelectedImage] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    useEffect(() => {
        fetchData();
    }, [i18n.language]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [statusFilter, serviceFilter, timeFilter]);


    const fetchData = async () => {
        setLoading(true);
        try {
            const [bookingsData, claimsData] = await Promise.all([
                getCached('/booking/bookings/', { ttlMs: 30000 }),
                api.get('/insurance/claims/')
            ]);

            setBookings(bookingsData);

            const claimsMap = {};
            claimsData.forEach(claim => {
                claimsMap[String(claim.booking)] = claim;
            });
            setClaims(claimsMap);
        } catch (err) {
            console.error("Failed to fetch data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolution = async (bookingId, resolution) => {
        const claim = claims[String(bookingId)];
        if (!claim) {
            console.error("No claim found for booking", bookingId);
            return;
        }

        try {
            await api.post(`/insurance/claims/${claim.id}/choose-resolution/`, { resolution });
            invalidateCache('/booking/bookings/');
            if (resolution === 'refund') {
                toast.success(t('bookings.refund_processing_toast'));
            } else if (resolution === 'rework') {
                toast.success(t('bookings.rework_processing_toast'));
            }
            fetchData(); // Refresh
        } catch (err) {
            console.error("Failed to set resolution", err);
            toast.error(t('bookings.resolution_failed_toast'));
        }
    };

    const isEligibleForClaim = (booking) => {
        if (booking.status !== 'paid' || !booking.is_paid || !booking.paid_at) return false;

        try {
            const paymentTime = new Date(booking.paid_at).getTime();
            const currentTime = new Date().getTime();

            if (isNaN(paymentTime)) return false;

            const diffInMs = currentTime - paymentTime;
            const diffInHours = diffInMs / (1000 * 60 * 60);

            return diffInHours >= 0 && diffInHours <= 72;
        } catch (e) {
            return false;
        }
    };

    const uniqueServices = ['all', ...new Set(bookings.map(b => b.service_name_key))];

    const isToday = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const today = new Date();
        return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    };

    const isThisWeek = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const today = new Date();
        const firstDay = new Date(today);
        firstDay.setDate(today.getDate() - today.getDay());
        firstDay.setHours(0, 0, 0, 0);
        const lastDay = new Date(firstDay);
        lastDay.setDate(firstDay.getDate() + 6);
        lastDay.setHours(23, 59, 59, 999);
        return d >= firstDay && d <= lastDay;
    };

    const isThisMonth = (dateStr) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        const today = new Date();
        return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
    };

    const filteredBookings = bookings.filter(booking => {
        const matchStatus = statusFilter === 'all' || booking.status === statusFilter;
        const matchService = serviceFilter === 'all' || booking.service_name_key === serviceFilter;
        let matchTime = true;
        const compareDate = booking.scheduled_date || booking.created_at;
        if (timeFilter === 'today') matchTime = isToday(compareDate);
        else if (timeFilter === 'this_week') matchTime = isThisWeek(compareDate);
        else if (timeFilter === 'this_month') matchTime = isThisMonth(compareDate);

        return matchStatus && matchService && matchTime;
    });

    const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
    const paginatedBookings = filteredBookings.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const clearFilters = () => {
        setStatusFilter('all');
        setServiceFilter('all');
        setTimeFilter('all');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <div className="container mx-auto px-4 py-10 max-w-7xl">
                    <Skeleton className="w-48 h-10 mb-8" />
                    <div className="space-y-6">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-gray-100">
                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="w-40 h-7" />
                                        <Skeleton className="w-20 h-6 rounded-full" />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <Skeleton className="w-32 h-4" />
                                        <Skeleton className="w-48 h-4" />
                                        <Skeleton className="w-36 h-4" />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 w-full md:w-32">
                                    <Skeleton className="h-10 rounded-xl" />
                                    <Skeleton className="h-10 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="container mx-auto px-4 py-10 max-w-7xl">
                <h1 className="text-3xl font-bold text-primary mb-8">{t('bookings.title')}</h1>

                {bookings.length > 0 && (
                    <BookingFilters
                        statusFilter={statusFilter}
                        setStatusFilter={setStatusFilter}
                        serviceFilter={serviceFilter}
                        setServiceFilter={setServiceFilter}
                        timeFilter={timeFilter}
                        setTimeFilter={setTimeFilter}
                        uniqueServices={uniqueServices}
                    />
                )}

                <div className="space-y-6">
                    {paginatedBookings.map(booking => (
                        <BookingCard
                            key={booking.id}
                            booking={booking}
                            claims={claims}
                            isEligibleForClaim={isEligibleForClaim}
                            onViewImage={(url) => {
                                setSelectedImage(url);
                                setIsImageModalOpen(true);
                            }}
                            handleResolution={handleResolution}
                            onPayNow={(b) => {
                                setSelectedBookingForPayment(b);
                                setShowPaymentModal(true);
                            }}
                        />
                    ))}

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    )}

                    {filteredBookings.length === 0 && bookings.length > 0 && (
                        <BookingEmptyState type="no_match" onClearFilters={clearFilters} />
                    )}

                    {bookings.length === 0 && (
                        <BookingEmptyState type="no_bookings" />
                    )}
                </div>
            </div>

            <ReviewModal
                isOpen={showReviewModal}
                onClose={() => setShowReviewModal(false)}
                booking={selectedBookingForReview}
                onReviewSubmit={() => {
                    fetchData();
                    alert("Thank you for your feedback!");
                }}
            />

            <ImageModal
                isOpen={isImageModalOpen}
                onClose={() => setIsImageModalOpen(false)}
                imageUrl={selectedImage}
            />

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                booking={selectedBookingForPayment}
                onPaymentSuccess={(booking) => {
                    setSelectedBookingForReview(booking);
                    setShowReviewModal(true);
                    fetchData(); // Refetch bookings after payment success
                }}
            />

            <Footer />
        </div>
    );
};

export default MyBookings;
