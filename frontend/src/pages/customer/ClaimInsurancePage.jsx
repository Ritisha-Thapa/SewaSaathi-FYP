import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { api } from "../../utils/api";
import DashboardHeader from "../../components/customer/DashboardHeader";
import Footer from "../../components/customer/Footer";
import { ArrowLeft, Upload, CheckCircle, AlertTriangle } from "lucide-react";

const ClaimInsurancePage = () => {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [description, setDescription] = useState("");
    const [evidence, setEvidence] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const data = await api.get(`/booking/bookings/${bookingId}/`);
                setBooking(data);
            } catch (err) {
                console.error("Failed to fetch booking", err);
                setError("Could not load booking details.");
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [bookingId]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setEvidence(e.target.files[0]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description) {
            setError("Please provide a description of the issue.");
            return;
        }

        setSubmitting(true);
        setError("");

        const formData = new FormData();
        formData.append("booking", bookingId);
        formData.append("description", description);
        if (evidence) formData.append("evidence", evidence);

        try {
            await api.post("/insurance/claims/", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            setSuccess(true);
            setTimeout(() => navigate("/my-bookings"), 3000);
        } catch (err) {
            console.error("Failed to submit claim", err);
            setError(err.response?.data?.[0] || "Failed to submit claim. You may have already filed a claim for this booking.");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    if (success) {
        return (
            <div className="min-h-screen bg-[#F9F5F0]">
                <DashboardHeader />
                <div className="container mx-auto px-4 py-20 max-w-2xl text-center">
                    <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 flex flex-col items-center">
                        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                            <CheckCircle size={48} />
                        </div>
                        <h1 className="text-3xl font-bold text-[#1B3C53] mb-4">Claim Submitted!</h1>
                        <p className="text-gray-600 mb-8">Your insurance claim has been successfully submitted and is under review.</p>
                        <Link to="/my-bookings" className="px-8 py-3 bg-[#1B3C53] text-white rounded-xl font-bold hover:bg-[#1a3248] transition">
                            Back to Bookings
                        </Link>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F5F0]">
            <DashboardHeader />
            <div className="container mx-auto px-4 py-10 max-w-4xl">
                <Link to="/my-bookings" className="text-gray-500 hover:text-[#1B3C53] flex items-center gap-2 mb-6 transition">
                    <ArrowLeft size={18} />
                    Back to Bookings
                </Link>

                <h1 className="text-3xl font-bold text-[#1B3C53] mb-2">Claim Insurance</h1>
                <p className="text-gray-600 mb-8">Please provide details and evidence of the issue with your service.</p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100 space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Issue Description *</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Describe the damage or issue in detail..."
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition h-40 resize-none"
                                    required
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Evidence (Photo/Video)</label>
                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 text-gray-400 mb-2" />
                                            <p className="text-sm text-gray-500 font-medium">
                                                {evidence ? evidence.name : "Click to upload evidence"}
                                            </p>
                                        </div>
                                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*,video/*" />
                                    </label>
                                </div>
                            </div>

                            {error && (
                                <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 flex items-start gap-3">
                                    <AlertTriangle className="flex-shrink-0" size={20} />
                                    <span className="text-sm">{error}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-orange-500 text-white rounded-xl font-bold text-lg shadow-lg hover:bg-orange-600 transition disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {submitting ? "Submitting Claim..." : "Submit Claim"}
                            </button>
                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-[#1B3C53] text-white rounded-2xl p-6 shadow-lg sticky top-8">
                            <h3 className="font-bold text-xl mb-4 border-b border-white/20 pb-3">Booking Details</h3>
                            {booking && (
                                <div className="space-y-4 text-sm text-gray-200">
                                    <div>
                                        <p className="text-white/60 font-medium uppercase tracking-wider text-xs">Service</p>
                                        <p className="text-lg font-bold text-white">{booking.service_name}</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-white/60 font-medium uppercase tracking-wider text-xs">Date</p>
                                            <p className="font-semibold text-white">{booking.scheduled_date}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-white/60 font-medium uppercase tracking-wider text-xs">Time</p>
                                            <p className="font-semibold text-white">{booking.scheduled_time}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-white/60 font-medium uppercase tracking-wider text-xs">Booking ID</p>
                                        <p className="font-mono text-white">#{booking.id}</p>
                                    </div>
                                    <div className="pt-3 mt-3 border-t border-white/20">
                                        <p className="text-white/60 font-medium uppercase tracking-wider text-xs">Price Paid</p>
                                        <p className="text-2xl font-bold text-white">Rs. {booking.total_price}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ClaimInsurancePage;
