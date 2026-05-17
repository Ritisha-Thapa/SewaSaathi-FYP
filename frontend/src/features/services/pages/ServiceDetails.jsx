import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Skeleton from "../../../shared/components/layout/Skeleton";
import Footer from "../../../shared/components/layout/Footer";
import { api } from "../../../utils/api";
import Navbar from '../../../shared/components/layout/Navbar';
import ReviewModal from '../../../shared/components/ui/ReviewModal';
import ImageModal from '../../../shared/components/ui/ImageModal';
import PaymentModal from '../../payment/components/PaymentModal';
import { useTranslation } from 'react-i18next';

// New sub-components
import ServiceHero from "../components/ServiceHero";
import BookingSidebar from "../components/BookingSidebar";

const ServiceDetails = () => {
  const { t, i18n } = useTranslation();
  const { category, serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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

  // Review & Image State
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBookingForReview, setSelectedBookingForReview] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);


  const fetchExistingBooking = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setExistingBooking(null);
      setBookingDetails(null);
      setOrderingStatus("");
      return;
    }

    try {
      const bookings = await api.get(`/booking/bookings/`);
      const activeBooking = bookings.find((b) => {
        if (!['cancelled', 'rejected', 'completed', 'paid', 'refunded'].includes(b.status)) {
          return b.service === Number(serviceId);
        }
        if (b.status === 'completed' && !b.is_paid) {
          return b.service === Number(serviceId);
        }
        if (b.latest_claim_status && b.service === Number(serviceId)) {
          if (b.latest_claim_status === 'pending') return true;
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
      } else {
        setExistingBooking(null);
        setBookingDetails(null);
        setOrderingStatus('');
      }
    } catch (err) {
      console.error('Failed to check existing booking:', err);
    }
  };

  const fetchService = async () => {
    setLoading(true);
    try {
      const data = await api.get(`/services/service/${serviceId}/`);
      setItem(data);
    } catch (err) {
      console.error("Failed to fetch service details:", err);
      setItem(null);
    } finally {
      // Do not block page rendering on booking list fetch.
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchService();
    fetchExistingBooking();
  }, [category, serviceId, i18n.language]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIssueImage(e.target.files[0]);
    }
  };

  const handleBookService = async () => {
    setErrorMessage("");
    setOrderingStatus("submitting");

    const token = localStorage.getItem("access");
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
    formData.append("scheduled_date", date);
    formData.append("scheduled_time", time);
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

  const handleResolution = async (resolution) => {
    if (!bookingDetails) return;

    try {
      await api.post(`/insurance/claims/${bookingDetails.latest_claim_id}/choose-resolution/`, { resolution });

      if (resolution === 'refund') {
        toast.success("Your refund will be sent within 3 days.");
        resetView();
      } else {
        toast.success("Rework request initiated.");
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
    pending: { title: "Booking Request Sent!", message: "Waiting for provider acceptance" },
    accepted: { title: "Booking Accepted!", message: "Provider will arrive at scheduled time" },
    in_progress: { title: "Service In Progress", message: "Provider is currently working on your request" },
    completed: { title: "Service Completed!", message: "Please review and complete payment" },
    paid: { title: "Payment Received!", message: "Thank you for using SewaSaathi" },
    rejected: { title: "Booking Rejected", message: "The provider was unavailable for this slot" },
    cancelled: { title: "Booking Cancelled", message: "This booking request has been cancelled" },
    claim_pending: { title: "Insurance Claim Request Sent", message: "Admin is reviewing your claim" },
    claim_approved: { title: "Insurance Claim Approved", message: "Processing Claim" }
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

  const timeSlots = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
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
              </div>
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="w-full h-[500px] rounded-2xl" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-lg text-gray-700">Service not found.</p>
          <Link to={`/services/${category}`} className="text-primary mt-4 inline-block underline">
            Back to {category}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 max-w-7xl py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link to={`/services/${category}`} className="text-gray-500 hover:text-primary text-sm mb-2 inline-flex items-center gap-2">
              <ArrowLeft size={16} />
              {t('booking_form.back_to')} {t(`categories.${item?.category?.name_key}`, { defaultValue: category })}
            </Link>
            <h2 className="text-4xl font-bold text-primary">
              {t(`service_names.${item?.name_key}`, { defaultValue: item?.name_key || "Service Details" })}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <ServiceHero item={item} />
          
          <BookingSidebar 
            bookingDetails={bookingDetails}
            item={item}
            currentStatusMsg={currentStatusMsg}
            onViewImage={() => setIsImageModalOpen(true)}
            onShowPayment={() => setShowPaymentModal(true)}
            handleResolution={handleResolution}
            orderingStatus={orderingStatus}
            address={address}
            setAddress={setAddress}
            phone={phone}
            setPhone={setPhone}
            date={date}
            setDate={setDate}
            time={time}
            setTime={setTime}
            issueDescription={issueDescription}
            setIssueDescription={setIssueDescription}
            issueImage={issueImage}
            handleImageChange={handleImageChange}
            handleBookService={handleBookService}
            errorMessage={errorMessage}
            authError={authError}
            timeSlots={timeSlots}
          />
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
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={bookingDetails?.issue_images}
      />
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        booking={bookingDetails}
        onPaymentSuccess={(booking) => {
          setSelectedBookingForReview(booking);
          setShowReviewModal(true);
          fetchService();
        }}
      />
      <Footer />
    </div>
  );
};

export default ServiceDetails;
