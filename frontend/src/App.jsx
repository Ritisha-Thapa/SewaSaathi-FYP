import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CustomerSignup from "./pages/CustomerSignup";
import Login from "./pages/Login"
import OTPVerification from "./pages/OTPVerification";
import ResetPassword from "./pages/ResetPassword";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProviderSignup from './pages/ProviderSignup'; 
import AboutUs from './pages/AboutUs'; 
import Contact from './pages/Contact'; 
import Services from './pages/Services'; 
import SubServices from './pages/SubServices'; 
import ServiceDetails from './pages/ServiceDetails';

// Provider Pages
import ProviderLayout from './components/provider/ProviderLayout';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import JobRequests from './pages/provider/JobRequests';
import AssignedJobs, { ActiveJobs } from './pages/provider/AssignedJobs';
import MyServices from './pages/provider/MyServices';
import Earnings from './pages/provider/Earnings';
import Schedule from './pages/provider/Schedule';
import Reviews from './pages/provider/Reviews';
import ProviderProfile from './pages/provider/ProviderProfile';

import './App.css'

function App() {
  return (
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
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:category" element={<SubServices />} />
        <Route path="/services/:category/:serviceSlug" element={<ServiceDetails />} />

         {/* Provider Routes */}
        <Route path="/provider" element={<ProviderLayout />}>
           <Route path="dashboard" element={<ProviderDashboard />} />
           <Route path="requests" element={<JobRequests />} />
           <Route path="assigned" element={<AssignedJobs />} />
           <Route path="active" element={<ActiveJobs />} />
           <Route path="services" element={<MyServices />} />
           <Route path="earnings" element={<Earnings />} />
           <Route path="schedule" element={<Schedule />} />
           <Route path="reviews" element={<Reviews />} />
           <Route path="profile" element={<ProviderProfile />} />
        </Route>





      </Routes>
    </Router>
  );
}

export default App