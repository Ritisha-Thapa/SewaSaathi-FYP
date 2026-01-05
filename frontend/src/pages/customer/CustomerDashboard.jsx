import React from "react";
import DashboardHeader from "../../components/customer/DashboardHeader";
import CustDashHero from "../../components/customer/CustDashHero";
import HowItWorks from "../../components/customer/HowItWorks";
import FeaturedServices from "../../components/customer/FeaturedServices";
import OurFeatures from "../../components/customer/OurFeatures";
import Testimonials from "../../components/customer/Testimonials";
import Footer from "../../components/customer/Footer";

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
