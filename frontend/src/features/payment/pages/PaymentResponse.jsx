import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { api } from '../../../utils/api';
import { toast } from '../../../shared/components/layout/ToastProvider';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Navbar from '../../../shared/components/layout/Navbar';
import Footer from '../../../shared/components/layout/Footer';
import ReviewModal from '../../../shared/components/ui/ReviewModal';
import Button from '../../../shared/components/ui/Button';

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
        <div className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-primary/10 max-w-md w-full text-center border border-gray-100 animate-fade-in">

                    {status === 'loading' && (
                        <div className="space-y-6">
                            <div className="relative w-20 h-20 mx-auto">
                                <Loader2 className="w-20 h-20 text-primary animate-spin" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-primary uppercase tracking-tight">Verifying</h2>
                            <p className="text-gray-500 font-medium">{message}</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="space-y-6">
                            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <CheckCircle className="w-12 h-12 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-primary uppercase tracking-tight">Success!</h2>
                                <p className="text-gray-600 font-bold">{message}</p>
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed px-4">Your service is now confirmed. Thank you for choosing SewaSaathi!</p>

                            <Button
                                onClick={() => navigate('/my-bookings')}
                                variant="primary"
                                size="lg"
                                className="mt-4"
                            >
                                Back to My Bookings
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-6">
                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                <XCircle className="w-12 h-12 text-red-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-3xl font-black text-primary uppercase tracking-tight">Payment Failed</h2>
                                <p className="text-gray-600 font-bold">{message}</p>
                            </div>
                            <div className="flex flex-col gap-3 mt-6">
                                <Button
                                    onClick={() => navigate('/my-bookings')}
                                    variant="primary"
                                    size="lg"
                                >
                                    Try Again
                                </Button>
                                <Button
                                    onClick={() => navigate('/')}
                                    variant="secondary"
                                    size="md"
                                >
                                    Back to Home
                                </Button>
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
