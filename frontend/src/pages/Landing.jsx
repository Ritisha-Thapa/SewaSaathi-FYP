import React from "react";
import LandingHeader from "../components/LandingHeader";
import LandingHero from "../components/LandingHero";
import HowItWorks from "../components/HowItWorks";
import FeaturedServices from "../components/FeaturedServices";
import OurFeatures from "../components/OurFeatures";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[#F9F5F0]">
      <LandingHeader />
      <LandingHero />
      <HowItWorks />
      <FeaturedServices />
      <OurFeatures/>
      <Testimonials />
      <Footer />
    </div>
  );
};

export default Landing;
