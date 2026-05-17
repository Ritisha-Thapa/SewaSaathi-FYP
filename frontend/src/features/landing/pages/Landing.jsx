import React from "react";
import Navbar from "../../../shared/components/layout/Navbar";
import LandingHero from "../components/LandingHero";
import HowItWorks from "../../../shared/components/ui/HowItWorks";
// import FeaturedServices from "../../components/customer/FeaturedServices";
import FeaturedCategories from "../../../shared/components/ui/FeaturedCategories";
import OurFeatures from "../../../shared/components/ui/OurFeatures";
import Testimonials from "../../../shared/components/ui/Testimonials";
import Footer from "../../../shared/components/layout/Footer";

const Landing = () => {
  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[#F9F5F0]">
      <Navbar />
      <LandingHero />
      <HowItWorks />
      {/* <FeaturedServices /> */}
      <FeaturedCategories />
      <OurFeatures />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Landing;
