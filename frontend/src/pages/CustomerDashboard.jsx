import React from "react";
import DashboardHeader from "../components/DashboardHeader";
import CustDashHero from "../components/CustDashHero";
import HowItWorks from "../components/HowItWorks";
import FeaturedServices from "../components/FeaturedServices";
import OurFeatures from "../components/OurFeatures";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const CustomerDashboard = () => {
  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[#F9F5F0]">

      <DashboardHeader />
      <CustDashHero />
      <HowItWorks />
      <FeaturedServices />
      <OurFeatures />
      <Testimonials />
      <Footer />
      
    </div>
  );
};

export default CustomerDashboard;
