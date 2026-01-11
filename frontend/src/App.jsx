import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Customer Pages
import Landing from "./pages/customer/Landing";
import CustomerSignup from "./pages/customer/CustomerSignup";
import Login from "./pages/Login"
import OTPVerification from "./pages/OTPVerification";
import ResetPassword from "./pages/ResetPassword";
import PasswordResetSuccess from "./pages/PasswordResetSuccess";
import ForgotPassword from "./pages/ForgotPassword";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import AboutUs from './pages/customer/AboutUs'; 
import Contact from './pages/customer/Contact'; 
import ServicesCategory from './pages/customer/ServicesCategory'; 
import SubServices from './pages/customer/SubServices'; 
import ServiceDetails from './pages/customer/ServiceDetails';

// Provider Pages
import ProviderSignup from './pages/ProviderSignup'; 
import ProviderLayout from './components/provider/ProviderLayout';
import ProviderDashboard from './pages/provider/ProviderDashboard';
import JobRequests from './pages/provider/JobRequests';
import AssignedJobs, { ActiveJobs } from './pages/provider/AssignedJobs';
import MyServices from './pages/provider/MyServices';
import Earnings from './pages/provider/Earnings';
import Schedule from './pages/provider/Schedule';
import Reviews from './pages/provider/Reviews';
import ProviderProfile from './pages/provider/ProviderProfile';
import ServicesPage from './pages/customer/ServicesPage';

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
        <Route path="/services-category" element={<ServicesCategory />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:category" element={<SubServices />} />
        <Route path="/services/:category/:serviceId" element={<ServiceDetails />} />

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