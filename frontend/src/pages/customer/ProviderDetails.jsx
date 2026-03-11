import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import DashboardHeader from "../../components/customer/DashboardHeader";
import Skeleton from "../../components/Skeleton";
import Footer from "../../components/customer/Footer";
import { Calendar, Clock, MapPin, Phone, CreditCard, Image as ImageIcon, AlertCircle, CheckCircle } from "lucide-react";
import { api } from "../../utils/api";

/**
 * Helper to get today's date in YYYY-MM-DD format
 * so we can disable past dates in the date picker.
 */
const getTodayDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const ProviderDetails = () => {
    const { providerId } = useParams();
    const [provider, setProvider] = useState(null);
    const [loading, setLoading] = useState(true);

    // Booking Form State
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [issueDescription, setIssueDescription] = useState("");
    const [issueImage, setIssueImage] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");

    // Booking Layout State
    const [orderingStatus, setOrderingStatus] = useState(""); // '', 'submitting', 'success'
    const [bookingDetails, setBookingDetails] = useState(null);

    // Fetch provider details
    useEffect(() => {
        const fetchProvider = async () => {
            try {
                const data = await api.get(`/accounts/providers/${providerId}/`);
                setProvider(data);
                // Pre-select first service if available
                if (data.provider_services && data.provider_services.length > 0) {
                    setSelectedServiceId(data.provider_services[0].service.id);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProvider();
    }, [providerId]);

    // Check for existing booking when service changes
    useEffect(() => {
        const fetchBookings = async () => {
            if (!selectedServiceId) return;
            const token = localStorage.getItem("access");
            if (!token) return;
            try {
                const bookings = await api.get("/booking/bookings/");
                const activeBooking = bookings.find(b =>
                    !['cancelled', 'rejected'].includes(b.status) &&
                    b.provider === Number(providerId) &&
                    b.service === Number(selectedServiceId)
                );
                if (activeBooking) {
                    setBookingDetails(activeBooking);
                    setOrderingStatus("success");
                } else {
                    setBookingDetails(null);
                    setOrderingStatus("");
                }
            } catch (err) {
                console.error("Error fetching existing bookings:", err);
            }
        };
        fetchBookings();
    }, [selectedServiceId, providerId]);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setIssueImage(e.target.files[0]);
        }
    };

    const handleBookProvider = async (e) => {
        e.preventDefault();

        if (!selectedServiceId || !date || !time || !address || !phone) {
            alert("Please fill in all required fields (Service, Date, Time, Address, Phone).");
            return;
        }

        setOrderingStatus("submitting");

        try {
            const token = localStorage.getItem("access");
            if (!token) {
                alert("You must be logged in to book.");
                setOrderingStatus("");
                return;
            }

            // Prepare payload
            const formData = new FormData();
            formData.append("service", selectedServiceId); // Service ID
            formData.append("provider", providerId);       // Provider ID
            formData.append("scheduled_date", date);
            formData.append("scheduled_time", time);
            formData.append("address", address);
            formData.append("phone", phone);
            formData.append("payment_method", paymentMethod);
            if (issueDescription) formData.append("issue_description", issueDescription);
            if (issueImage) formData.append("issue_images", issueImage);

            const data = await api.post("/booking/bookings/", formData);
            setBookingDetails(data);
            setOrderingStatus("success");
        } catch (err) {
            console.error(err);
            alert("Something went wrong. Please try again.");
            setOrderingStatus("");
        }
    };

    const handleMockPay = async () => {
        if (!bookingDetails) return;
        try {
            await api.post(`/booking/bookings/${bookingDetails.id}/pay/`);

            // Update local state to show 'Paid'
            setBookingDetails({ ...bookingDetails, is_paid: true, payment_method: 'online', status: 'paid' });
            alert("Payment Successful! (Mock)");

        } catch (err) {
            console.error(err);
            alert("Payment failed.");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F5F0]">
                <DashboardHeader />
                <main className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start">
                            <Skeleton className="w-32 h-32 md:w-40 md:h-40 rounded-full flex-shrink-0" />
                            <div className="flex-1 space-y-4">
                                <div className="flex gap-3">
                                    <Skeleton className="w-20 h-6 rounded-full" />
                                    <Skeleton className="w-16 h-6 rounded-full" />
                                </div>
                                <Skeleton className="w-1/2 h-10" />
                                <Skeleton className="w-3/4 h-6" />
                            </div>
                        </div>
                        <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6">
                            <Skeleton className="w-48 h-8" />
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="w-full h-24 rounded-xl" />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-xl space-y-6">
                            <Skeleton className="w-full h-[400px] rounded-2xl" />
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }
    if (!provider) return <div className="p-10 text-center">Provider not found.</div>;

    return (
        <div className="min-h-screen bg-[#F9F5F0]">
            <DashboardHeader />

            <main className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* Left Column: Provider Info */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl p-8 shadow-sm flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden bg-gray-200 shrink-0">
                            {provider.profile_image ? (
                                <img src={provider.profile_image} alt={provider.first_name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">No Img</div>
                            )}
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-blue-100 text-[#1B3C53] px-3 py-1 rounded-full text-xs font-semibold capitalize">
                                    {provider.skills}
                                </span>
                                <div className="flex items-center gap-1 text-yellow-500 font-bold text-sm">
                                    ★ {provider.average_rating || "N/A"}
                                </div>
                            </div>
                            <h1 className="text-3xl font-bold text-[#1B3C53] mb-2 capitalize">
                                {provider.first_name} {provider.last_name}
                            </h1>
                            <p className="text-gray-600 mb-4 flex items-center gap-2">
                                <MapPin size={16} /> {provider.city} • {provider.experience_years} Years Experience
                            </p>
                        </div>
                    </div>

                    {/* Services Offered */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-xl font-bold text-[#1B3C53] mb-6">Services Offered</h2>
                        {provider.provider_services && provider.provider_services.length > 0 ? (
                            <div className="space-y-4">
                                {provider.provider_services.map((ps) => (
                                    <div key={ps.id} className="flex justify-between items-center p-4 border rounded-xl hover:bg-gray-50 border-gray-100">
                                        <div>
                                            <h3 className="font-semibold text-[#1B3C53]">{ps.service.name}</h3>
                                            <p className="text-sm text-gray-500">{ps.pricing_type} pricing</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-[#1B3C53]">Rs. {Number(ps.price).toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No specific services listed.</p>
                        )}
                    </div>
                </div>

                {/* Right Column: Booking Form */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-3xl p-6 shadow-xl sticky top-24 border border-gray-100">

                        {orderingStatus === "success" && bookingDetails ? (
                            <div className="text-center py-10 space-y-4">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock size={32} />
                                </div>
                                <h2 className="text-2xl font-bold text-[#1B3C53]">Booking Request Sent!</h2>
                                <p className="text-gray-600">
                                    Your booking ID is <span className="font-mono font-bold text-[#1B3C53]">#{bookingDetails.id}</span>
                                </p>
                                <p className="text-xs text-gray-500 mt-2">Waiting for provider acceptance</p>

                                <div className="bg-gray-50 p-4 rounded-xl text-left space-y-2 text-sm mt-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Provider</span>
                                        <span className="font-medium">{provider.first_name} {provider.last_name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Date & Time</span>
                                        <span className="font-medium">{bookingDetails.scheduled_date} at {bookingDetails.scheduled_time}</span>
                                    </div>
                                    <div className="flex justify-between border-t pt-2 mt-2">
                                        <span className="text-gray-500">Estimated Price</span>
                                        <span className="font-bold text-[#1B3C53]">Rs. {Number(bookingDetails.total_price).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Status</span>
                                        <span className={`font-bold px-2 py-1 rounded text-xs uppercase ${bookingDetails.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                            bookingDetails.status === 'accepted' ? 'bg-blue-100 text-blue-700' :
                                                bookingDetails.status === 'in_progress' ? 'bg-orange-100 text-orange-700' :
                                                    bookingDetails.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                            {bookingDetails.status.replace('_', ' ')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payment Status</span>
                                        <span className={`font-bold ${bookingDetails.is_paid ? 'text-green-600' : 'text-orange-500'}`}>
                                            {bookingDetails.is_paid ? "Paid" : "Pending"}
                                        </span>
                                    </div>
                                </div>

                                {bookingDetails.status === 'completed' && !bookingDetails.is_paid && (
                                    <button
                                        onClick={handleMockPay}
                                        className="w-full mt-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg"
                                    >
                                        Pay Now
                                    </button>
                                )}

                                {bookingDetails.status === 'pending' && (
                                    <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100 mt-4">
                                        <p className="font-semibold mb-1">Next Steps:</p>
                                        <p>1. Provider will review your request</p>
                                        <p>2. You'll be notified when accepted</p>
                                        <p>3. Payment available after completion</p>
                                    </div>
                                )}

                                <Link to="/customer-dashboard" className="block mt-4 text-[#1B3C53] font-medium hover:underline">
                                    Go to Dashboard
                                </Link>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-xl font-bold text-[#1B3C53] mb-6">Book this Provider</h2>
                                <form onSubmit={handleBookProvider} className="space-y-4">

                                    {/* 1. Service Selection */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Select Service</label>
                                        <select
                                            value={selectedServiceId}
                                            onChange={(e) => setSelectedServiceId(e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/20"
                                            required
                                        >
                                            <option value="">-- Choose a Service --</option>
                                            {provider.provider_services?.map(ps => (
                                                <option key={ps.id} value={ps.service.id}>
                                                    {ps.service.name} - Rs. {ps.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="date"
                                                    min={getTodayDate()}
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                <input
                                                    type="time"
                                                    value={time}
                                                    onChange={(e) => setTime(e.target.value)}
                                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address & Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Service Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="text"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                placeholder="e.g. Kathmandu, Ward 4"
                                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                            <input
                                                type="tel"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                placeholder="e.g. 9812345678"
                                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                                                required
                                            />
                                        </div>
                                    </div>


                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Describe Issue (Optional)</label>
                                        <textarea
                                            rows="3"
                                            value={issueDescription}
                                            onChange={(e) => setIssueDescription(e.target.value)}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none"
                                            placeholder="Briefly describe what you need..."
                                        ></textarea>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image (Optional)</label>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                                id="issue-image-upload"
                                            />
                                            <label
                                                htmlFor="issue-image-upload"
                                                className="w-full p-3 bg-gray-50 border border-dashed border-gray-300 rounded-xl flex items-center justify-center gap-2 text-gray-500 cursor-pointer hover:bg-gray-100"
                                            >
                                                <ImageIcon size={18} />
                                                {issueImage ? issueImage.name : "Choose File"}
                                            </label>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod("cash")}
                                                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${paymentMethod === "cash"
                                                    ? "border-[#1B3C53] bg-[#1B3C53]/5 text-[#1B3C53]"
                                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <span>💵 Cash</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod("online")}
                                                className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-medium transition-all ${paymentMethod === "online"
                                                    ? "border-[#1B3C53] bg-[#1B3C53]/5 text-[#1B3C53]"
                                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                                    }`}
                                            >
                                                <CreditCard size={18} /> Online
                                            </button>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            disabled={orderingStatus === "submitting"}
                                            className="w-full py-4 bg-[#1B3C53] text-white rounded-xl font-bold text-lg hover:bg-[#152e40] transition-transform hover:scale-[1.02] shadow-xl shadow-blue-900/10 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {orderingStatus === "submitting" ? "Processing..." : "Confirm Booking"}
                                        </button>
                                        <p className="text-xs text-center text-gray-500 mt-3 flex items-center justify-center gap-1">
                                            <AlertCircle size={14} /> You won't be charged yet
                                        </p>
                                    </div>
                                </form>
                            </>
                        )}

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProviderDetails;
