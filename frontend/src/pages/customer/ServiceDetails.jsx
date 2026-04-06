import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, CheckCircle, Clock, CreditCard, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import Skeleton from "../../components/Skeleton";
import Footer from "../../components/customer/Footer";
import { api } from "../../utils/api";
import ReviewModal from "../../components/customer/ReviewModal";
import DashboardHeader from '../../components/customer/DashboardHeader';
import khaltiLogo from "../../assets/khalti_logo.png";

const formatPrice = (n) => `Rs. ${Number(n).toLocaleString()}`;

const ServiceDetails = () => {
  const { category, serviceId } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(false);

  // Form States
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [issueImage, setIssueImage] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  // Booking State
  const [orderingStatus, setOrderingStatus] = useState(""); // '', 'submitting', 'success'
  const [bookingDetails, setBookingDetails] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [existingBooking, setExistingBooking] = useState(null);

  // Review State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const data = await api.get(`/services/service/${serviceId}/`);
        setItem(data);

        // Check if user already has a booking for this service
        const token = localStorage.getItem("access");
        if (token) {
          try {
            const bookings = await api.get(`/booking/bookings/`);
            const activeBooking = bookings.find(b => {
              // 1. Show if request is active (pending, accepted, in_progress)
              if (!['cancelled', 'rejected', 'completed', 'paid', 'refunded'].includes(b.status)) {
                return b.service === Number(serviceId);
              }

              // 2. Show if completed but NOT paid (waiting for payment)
              if (b.status === 'completed' && !b.is_paid) {
                return b.service === Number(serviceId);
              }

              // 3. Show if there's an ongoing insurance claim (regardless of 3-day window once claimed)
              if (b.latest_claim_status && b.service === Number(serviceId)) {
                // Show claim card if pending
                if (b.latest_claim_status === 'pending') return true;

                // Show claim card if approved but not yet resolved (resolution 'none' means processing)
                if (b.latest_claim_status === 'approved' && b.latest_claim_resolution === 'none') {
                  return true;
                }
              }

              return false;
            });
            if (activeBooking) {
              setExistingBooking(activeBooking);
              setBookingDetails(activeBooking);
              setOrderingStatus('success');
            }
          } catch (err) {
            console.error('Failed to check existing booking:', err);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [category, serviceId]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIssueImage(e.target.files[0]);
    }
  };

  const handleBookService = async () => {
    setErrorMessage("");
    setOrderingStatus("submitting");

    // Auth Check
    const token = localStorage.getItem("access"); // Assuming 'access' based on typical Django SimpleJWT
    if (!token) {
      setErrorMessage("You must be logged in to book a service.");
      setAuthError(true);
      setOrderingStatus("");
      return;
    }

    if (!date || !time || !address || !phone) {
      setErrorMessage("Please fill in all required fields.");
      setOrderingStatus("");
      return;
    }

    const formData = new FormData();
    formData.append("service", serviceId);
    formData.append("scheduled_date", date); // Format YYYY-MM-DD
    formData.append("scheduled_time", time); // Format HH:MM
    formData.append("payment_method", paymentMethod);
    formData.append("address", address);
    formData.append("phone", phone);

    if (issueDescription) formData.append("issue_description", issueDescription);
    if (issueImage) formData.append("issue_images", issueImage);

    try {
      const data = await api.post("/booking/bookings/", formData);
      setBookingDetails(data);
      setOrderingStatus("success");

    } catch (err) {
      console.error("Booking Error:", err);
      setErrorMessage("Failed to book service. Please check your inputs.");
      setOrderingStatus("");
    }
  };

  const handlePayNow = async () => {
    if (!bookingDetails) return;

    try {
      toast.loading('Preparing Khalti payment...', { id: 'khalti-service' });
      const res = await api.post(`/booking/bookings/${bookingDetails.id}/initialize-payment/`, {
        return_url: `${window.location.origin}/payment-response`
      });

      if (res.payment_url) {
        toast.success('Redirecting to Khalti...', { id: 'khalti-service' });
        window.location.href = res.payment_url;
      } else {
        toast.error(res.error || 'Payment URL not received.', { id: 'khalti-service' });
      }
    } catch (err) {
      const msg = err?.response?.data?.error || err?.response?.data?.details || 'Payment initialization failed. Please try again.';
      toast.error(msg, { id: 'khalti-service' });
      console.error('Payment initialization failed', err?.response?.data);
    }
  };

  const handleResolution = async (resolution) => {
    if (!bookingDetails) return;

    try {
      await api.post(`/insurance/claims/${bookingDetails.latest_claim_id}/choose-resolution/`, { resolution });

      if (resolution === 'refund') {
        toast.success("Your refund will be sent within 3 days.");
        resetView();
      } else {
        // Rework logic - logic to be confirmed later
        toast.success("Rework request initiated.");
        // We'll just refresh the data for rework to show updated resolution
        const bookings = await api.get(`/booking/bookings/`);
        const updated = bookings.find(b => b.id === bookingDetails.id);
        if (updated) {
          setBookingDetails(updated);
        }
      }
    } catch (err) {
      console.error("Failed to set resolution", err);
      toast.error("Failed to set resolution.");
    }
  };

  const resetView = () => {
    setBookingDetails(null);
    setExistingBooking(null);
    setOrderingStatus("");
    setAddress("");
    setPhone("");
    setDate("");
    setTime("");
    setIssueDescription("");
    setIssueImage(null);
  };

  const statusMessages = {
    pending: {
      title: "Booking Request Sent!",
      message: "Waiting for provider acceptance"
    },
    accepted: {
      title: "Booking Accepted!",
      message: "Provider will arrive at scheduled time"
    },
    in_progress: {
      title: "Service In Progress",
      message: "Provider is currently working on your request"
    },
    completed: {
      title: "Service Completed!",
      message: "Please review and complete payment"
    },
    paid: {
      title: "Payment Received!",
      message: "Thank you for using SewaSaathi"
    },
    rejected: {
      title: "Booking Rejected",
      message: "The provider was unavailable for this slot"
    },
    cancelled: {
      title: "Booking Cancelled",
      message: "This booking request has been cancelled"
    },
    // Insurance specific messages
    claim_pending: {
      title: "Insurance Claim Request Sent",
      message: "Admin is reviewing your claim"
    },
    claim_approved: {
      title: "Insurance Claim Approved",
      message: "Processing Claim"
    }
  };

  let currentStatusMsg = null;
  if (bookingDetails) {
    if (bookingDetails.latest_claim_status === 'pending') {
      currentStatusMsg = statusMessages.claim_pending;
    } else if (bookingDetails.latest_claim_status === 'approved' && bookingDetails.latest_claim_resolution === 'none') {
      currentStatusMsg = statusMessages.claim_approved;
    } else {
      currentStatusMsg = statusMessages[bookingDetails.status] || {
        title: "Booking Update",
        message: `Status: ${bookingDetails.status}`
      };
    }
  }

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F5F0]">
        <DashboardHeader />
        <div className="container mx-auto px-4 max-w-7xl py-10">
          <div className="flex flex-col mb-8 gap-2">
            <Skeleton className="w-32 h-4" />
            <Skeleton className="w-1/2 h-10" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="w-full h-[400px] rounded-2xl" />
              <div className="bg-white rounded-2xl p-8 space-y-4">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-3/4 h-4" />
                <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-4">
                  <Skeleton className="w-24 h-6" />
                  <Skeleton className="w-32 h-10 rounded-xl" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 space-y-6">
                <Skeleton className="w-full h-12 rounded-xl" />
                <Skeleton className="w-full h-12 rounded-xl" />
                <Skeleton className="w-full h-40 rounded-xl" />
                <Skeleton className="w-full h-14 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-[#F9F5F0]">
        <DashboardHeader />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-gray-700">Service not found.</p>
          <Link
            to={`/services/${category}`}
            className="text-[#1B3C53] mt-4 inline-block underline"
          >
            Back to {category}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
      <DashboardHeader />
      <div className="container mx-auto px-4 max-w-7xl py-10">
        {/* Breadcrumb / Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              to={`/services/${category}`}
              className="text-gray-500 hover:text-[#1B3C53] text-sm mb-2 inline-flex items-center gap-2"
            >
              <ArrowLeft size={16} />
              Back to {category}
            </Link>
            <h2 className="text-4xl font-bold text-[#1B3C53]">{item.name}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* LEFT COLUMN: Service Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-96 object-cover"
              />
            </div>

            <div className="bg-white rounded-2xl shadow-sm p-8 border border-gray-100">
              <p className="text-gray-700 leading-relaxed text-lg">
                {item.description}
              </p>

              <div className="mt-8 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 text-lg">Base Price:</span>
                  <span className="text-3xl font-bold text-[#1B3C53]">
                    {formatPrice(item.base_price)}
                  </span>
                </div>
                <p className="text-gray-500 mt-2 text-sm bg-blue-50 inline-block px-3 py-1 rounded-full border border-blue-100">
                  Note: A 1% insurance fee will be added to the total.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Sticky Booking Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-4 bg-[#1B3C53] text-white text-center">
                <h3 className="font-bold text-xl">
                  {bookingDetails?.latest_claim_status && bookingDetails.latest_claim_resolution === 'none'
                    ? "Insurance Status"
                    : orderingStatus === "success"
                      ? "Booking Status"
                      : "Book This Service"}
                </h3>
              </div>

              <div className="p-6 space-y-6">

                {orderingStatus === "success" && bookingDetails ? (
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
                                'bg-gray-100 text-gray-700'
                          }`}>
                          {bookingDetails.status.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-white p-2 rounded border">
                        <span className="text-gray-500">Payment:</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold uppercase ${bookingDetails.is_paid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                          {bookingDetails.is_paid ? "PAID" : "UNPAID"}
                        </span>
                      </div>

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
                      <button
                        onClick={handlePayNow}
                        className="w-full py-3 bg-[#5C2D91] text-white rounded-xl font-bold hover:bg-[#4a2475] transition shadow-lg flex items-center justify-center gap-2"
                      >
                        <img src={khaltiLogo} alt="Khalti" className="h-5" />
                        Pay with Khalti
                      </button>
                    )}

                    {bookingDetails.latest_claim_status === 'approved' && bookingDetails.latest_claim_resolution === 'none' && (
                      <div className="space-y-3">
                        <button
                          onClick={() => handleResolution('refund')}
                          className="w-full py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
                        >
                          <CheckCircle size={18} />
                          80% Refund
                        </button>
                        <button
                          onClick={() => {/* logic to be confirmed later */ }}
                          className="w-full py-3 bg-[#1B3C53] text-white rounded-xl font-bold hover:bg-[#152e40] transition shadow-md flex items-center justify-center gap-2"
                        >
                          Request Rework
                        </button>
                        <p className="text-[10px] text-gray-500 text-center italic">
                          Choosing refund will process your money back within 3 days.
                        </p>
                      </div>
                    )}

                    {bookingDetails.status === 'completed' && !bookingDetails.is_paid && (
                      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="font-semibold mb-1">Next Steps:</p>
                        <p>1. Provider has completed the work</p>
                        <p>2. Please make payment to finish</p>
                        <p>3. Insurance claim available after payment</p>
                      </div>
                    )}

                    {bookingDetails.status === 'pending' && (
                      <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
                        <p className="font-semibold mb-1">Next Steps:</p>
                        <p>1. Provider will review your request</p>
                        <p>2. You'll be notified when accepted</p>
                        <p>3. Payment available after completion</p>
                      </div>
                    )}

                    <div className="pt-2">
                      <Link to="/customer-dashboard" className="text-[#1B3C53] underline text-sm hover:text-blue-700">Go to Dashboard</Link>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Address & Phone */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Address *
                        </label>
                        <input
                          type="text"
                          placeholder="Service Address"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          placeholder="Contact Number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition"
                        />
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition cursor-pointer"
                      />
                    </div>

                    {/* Time Slots */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Time
                      </label>
                      <div className="grid grid-cols-4 gap-2">
                        {timeSlots.map((slot) => (
                          <button
                            key={slot}
                            onClick={() => setTime(slot)}
                            className={`py-2 px-1 rounded-lg text-xs font-medium transition border ${time === slot
                              ? "bg-[#1B3C53] text-white border-[#1B3C53]"
                              : "bg-white text-gray-600 border-gray-200 hover:border-[#1B3C53] hover:text-[#1B3C53]"
                              }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Issue Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Problem Description (Optional)
                      </label>
                      <textarea
                        value={issueDescription}
                        onChange={(e) => setIssueDescription(e.target.value)}
                        placeholder="Describe the issue..."
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#1B3C53] focus:border-transparent outline-none transition h-24 resize-none"
                      ></textarea>
                    </div>

                    {/* Image Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Upload Image (Optional)
                      </label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <p className="text-xs text-gray-500 pt-1">
                              {issueImage ? issueImage.name : "Click to upload"}
                            </p>
                          </div>
                          <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                        </label>
                      </div>
                    </div>

                    {/* Error Message */}
                    {errorMessage && (
                      <div className="p-3 bg-red-50 text-red-700 rounded-lg text-xs border border-red-100">
                        {errorMessage}
                      </div>
                    )}

                    {authError && (
                      <div className="text-center">
                        <Link to="/login" className="text-[#1B3C53] underline font-medium">Login here</Link>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleBookService}
                      disabled={orderingStatus === "submitting"}
                      className="w-full py-4 bg-[#1B3C53] text-white rounded-xl font-medium text-lg shadow-lg hover:bg-[#152e40] transition transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {orderingStatus === "submitting" ? "Processing..." : "Confirm Booking"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ReviewModal
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          resetView();
        }}
        booking={selectedBookingForReview}
        onReviewSubmit={() => {
          setShowReviewModal(false);
          toast.success("Thank you for your feedback!");
          resetView();
        }}
      />
      <Footer />
    </div>
  );
};

export default ServiceDetails;
