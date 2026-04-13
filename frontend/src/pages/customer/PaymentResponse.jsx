import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../utils/api';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import DashboardHeader from '../../components/customer/DashboardHeader';
import Footer from '../../components/customer/Footer';
import ReviewModal from '../../components/customer/ReviewModal';

const PaymentResponse = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('Verifying your payment...');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [bookingData, setBookingData] = useState(null);
    const verificationAttempted = useRef(false);

    useEffect(() => {
        const pidx = searchParams.get('pidx');
        const purchase_order_id = searchParams.get('purchase_order_id');
        const status_param = searchParams.get('status');

        if (status_param === 'Completed' && pidx && purchase_order_id) {
            if (!verificationAttempted.current) {
                verificationAttempted.current = true;
                const actualBookingId = purchase_order_id.replace('booking-', '');
                verifyPayment(pidx, actualBookingId);
            }
        } else if (status_param === 'User canceled') {
            setStatus('error');
            setMessage('Payment was cancelled by the user.');
            toast.error('Payment cancelled.');
        } else {
            setStatus('error');
            setMessage('Payment failed or was incomplete.');
            toast.error('Payment failed.');
        }
    }, [searchParams]);

    const verifyPayment = async (pidx, bookingId) => {
        try {
            const response = await api.post(`/booking/bookings/${bookingId}/verify-payment/`, { pidx });

            setStatus('success');
            setMessage('Payment verified successfully!');
            toast.success('Payment completed successfully!');

            // ✅ Store booking data
            setBookingData(response.booking);

            // ✅ OPEN MODAL IMMEDIATELY (no delay)
            setShowReviewModal(true);

        } catch (err) {
            console.error("Verification error:", err);
            setStatus('error');
            setMessage('Failed to verify payment with our servers.');
            toast.error('Verification failed.');
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F5F0] flex flex-col">
            <DashboardHeader />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">

                    {status === 'loading' && (
                        <div className="space-y-4">
                            <Loader2 className="w-16 h-16 text-[#5C2D91] animate-spin mx-auto" />
                            <h2 className="text-2xl font-bold text-[#1B3C53]">Verifying Payment</h2>
                            <p className="text-gray-600">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-4">
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
                            <h2 className="text-2xl font-bold text-[#1B3C53]">Payment Successful!</h2>
                            <p className="text-gray-600 font-medium">{message}</p>
                            <p className="text-sm text-gray-400">Thank you for your payment.</p>
                            <button 
                                onClick={() => navigate('/my-bookings')}
                                className="mt-6 px-8 py-3 bg-[#1B3C53] text-white rounded-xl font-bold hover:bg-[#1a3248] transition w-full"
                            >
                                Back to My Bookings
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-4">
                            <XCircle className="w-16 h-16 text-red-500 mx-auto" />
                            <h2 className="text-2xl font-bold text-[#1B3C53]">Payment Failed</h2>
                            <p className="text-gray-600 font-medium">{message}</p>
                            <div className="flex flex-col gap-3 mt-6">
                                <button 
                                    onClick={() => navigate('/my-bookings')}
                                    className="px-8 py-3 bg-[#1B3C53] text-white rounded-xl font-bold hover:bg-[#1a3248] transition w-full"
                                >
                                    Try Again from Bookings
                                </button>
                                <button 
                                    onClick={() => navigate('/')}
                                    className="px-8 py-3 border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition w-full"
                                >
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />


            {showReviewModal && (
                <ReviewModal
                    isOpen={showReviewModal}
                    booking={bookingData}
                    onClose={() => {
                        setShowReviewModal(false);
                        navigate('/my-bookings');
                    }}
                    onReviewSubmit={() => {
                        setShowReviewModal(false);
                        toast.success('Thank you for your feedback!');
                        navigate('/my-bookings');
                    }}
                />
            )}
        </div>
    );
};

export default PaymentResponse;