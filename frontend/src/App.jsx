import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import CustomerSignup from "./pages/CustomerSignup";
import Login from "./pages/Login"
import CustomerDashboard from "./pages/CustomerDashboard";
import ProviderSignup from './pages/ProviderSignup'; 
import AboutUs from './pages/AboutUs'; 
import Contact from './pages/Contact'; 
import Services from './pages/Services'; 
import SubServices from './pages/SubServices'; 
import ServiceDetails from './pages/ServiceDetails';

import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup/customer" element={<CustomerSignup />} />
        <Route path="/signup/provider" element={<ProviderSignup />} />
        <Route path="/customer-dashboard" element={<CustomerDashboard />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/services" element={<Services />} />
         <Route path="/services/:category" element={<SubServices />} />
        <Route path="/services/:category/:serviceSlug" element={<ServiceDetails />} />


      </Routes>
    </Router>
  );
}

export default App