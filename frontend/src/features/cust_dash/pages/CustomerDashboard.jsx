import React from "react";
import Navbar from "../../../shared/components/layout/Navbar";
import CustDashHero from "../components/CustDashHero";
import HowItWorks from "../../../shared/components/ui/HowItWorks";
import FeaturedCategories from "../../../shared/components/ui/FeaturedCategories";
import FeaturedServices from "../../../shared/components/ui/FeaturedServices";
// import FeaturedProviders from "../../components/customer/FeaturedProviders";
import OurFeatures from "../../../shared/components/ui/OurFeatures";
import Testimonials from "../../../shared/components/ui/Testimonials";
import CoverageSection from "../../../shared/components/ui/CoverageSection";
import Footer from "../../../shared/components/layout/Footer";

const CustomerDashboard = () => {
  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[#F9F5F0]">

      <Navbar />
      <CustDashHero />
      <HowItWorks />
      <FeaturedCategories />
      <OurFeatures />
      <FeaturedServices />
      <CoverageSection />
      <Testimonials />
      <Footer />

    </div>
  );
};

export default CustomerDashboard;
