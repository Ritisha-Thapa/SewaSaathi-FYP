import React from "react";
import LandingHeader from "../../components/customer/LandingHeader";
import LandingHero from "../../components/customer/LandingHero";
import HowItWorks from "../../components/customer/HowItWorks";
// import FeaturedServices from "../../components/customer/FeaturedServices";
import FeaturedCategories from "../../components/customer/FeaturedCategories";
import OurFeatures from "../../components/customer/OurFeatures";
import Testimonials from "../../components/customer/Testimonials";
import Footer from "../../components/customer/Footer";

const Landing = () => {
  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[#F9F5F0]">
      <LandingHeader />
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
