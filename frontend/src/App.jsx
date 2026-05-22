import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ToastProvider from './shared/components/layout/ToastProvider';

// --- Authentication Features ---
import Login from "./features/authentication/pages/Login";
import CustomerSignup from "./features/authentication/pages/CustomerSignup";
import ProviderSignup from "./features/authentication/pages/ProviderSignup";
import ForgotPassword from "./features/authentication/components/pass_change/ForgotPassword";
import OTPVerification from "./features/authentication/components/pass_change/OTPVerification";
import ResetPassword from "./features/authentication/components/pass_change/ResetPassword";
import PasswordResetSuccess from "./features/authentication/components/pass_change/PasswordResetSuccess";
import { AuthProvider } from "./features/authentication/components/auths/AuthContext";

// --- Landing Feature ---
import Landing from "./features/landing/pages/Landing";

// --- Dashboard & Management Features ---
import CustomerDashboard from "./features/cust_dash/pages/CustomerDashboard";
import ProviderDashboard from "./features/provider_dash/pages/ProviderDashboard";
import ProviderLayout from "./features/provider_dash/components/shared/ProviderLayout";
import JobRequests from "./features/provider_dash/pages/JobRequests";
import AssignedJobs, { ActiveJobs } from "./features/provider_dash/pages/AssignedJobs";
import BookingHistory from "./features/provider_dash/pages/BookingHistory";
import MyServices from "./features/provider_dash/pages/MyServices";
import Earnings from "./features/provider_dash/pages/Earnings";
import Reviews from "./features/provider_dash/pages/Reviews";

// --- Services & Booking Features ---
import ServicesCategory from "./features/services/pages/ServicesCategory";
import SubServices from "./features/services/pages/SubServices";
import ServiceDetails from "./features/services/pages/ServiceDetails";
import ServicesPage from "./features/services/pages/ServicesPage";
import MyBookings from "./features/booking/pages/MyBookings";
import ClaimInsurancePage from "./features/insurance/pages/ClaimInsurancePage";

// --- Profile & Notification Features ---
import CustomerProfile from "./features/profile/pages/CustomerProfile";
import ProviderProfile from "./features/profile/pages/ProviderProfile";
import NotificationsPage from "./features/notifications/pages/NotificationsPage";
import { NotificationProvider } from "./features/notifications/components/NotificationContext";

// --- Payment Features ---
import PaymentResponse from "./features/payment/pages/PaymentResponse";

// --- Shared Components & Pages ---
import AboutUs from "./shared/pages/AboutUs";
import Contact from "./shared/pages/Contact";
import ProtectedRoute from "./shared/components/layout/ProtectedRoute";

import './App.css'

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ToastProvider />
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot" element={<ForgotPassword />} />
            <Route path="/forgot/otp" element={<OTPVerification />} />
            <Route path="/forgot/reset" element={<ResetPassword />} />
            <Route path="/forgot/success" element={<PasswordResetSuccess />} />
            <Route path="/signup/customer" element={<CustomerSignup />} />
            <Route path="/signup/provider" element={<ProviderSignup />} />

            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services-category" element={<ServicesCategory />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:category" element={<SubServices />} />
            <Route path="/services/:category/:serviceId" element={<ServiceDetails />} />
            <Route path="/notifications" element={<NotificationsPage />} />

            {/* Customer Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
              <Route path="/customer-dashboard" element={<CustomerDashboard />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/claim-insurance/:bookingId" element={<ClaimInsurancePage />} />
              <Route path="/profile" element={<CustomerProfile />} />
              <Route path="/payment-response" element={<PaymentResponse />} />
            </Route>

            {/* Provider Protected Routes */}
            <Route path="/provider" element={<ProtectedRoute allowedRoles={['provider']} />}>
              <Route element={<ProviderLayout />}>
                <Route path="dashboard" element={<ProviderDashboard />} />
                <Route path="requests" element={<JobRequests />} />
                <Route path="active" element={<ActiveJobs />} />
                <Route path="history" element={<BookingHistory />} />
                <Route path="services" element={<MyServices />} />
                <Route path="earnings" element={<Earnings />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="profile" element={<ProviderProfile />} />
                <Route path="notifications" element={<NotificationsPage />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App