import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import fullLogo from "../../../assets/sewasathi_full_logo.png";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#1B3C53] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/" className="mb-2 block">
              <img
                src={fullLogo}
                alt="SewaSaathi"
                className="h-60 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {t("footer.tagline", "Your trusted partner for all home services. Connecting you with verified professionals for quick and reliable solutions.")}
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t("footer.quick_links", "Quick Links")}</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition flex items-center">

                  {t("nav.home", "Home")}
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-300 hover:text-white transition flex items-center">

                  {t("nav.about_us", "About Us")}
                </Link>
              </li>
              <li>
                <Link to="/services-category" className="text-gray-300 hover:text-white transition flex items-center">

                  {t("nav.services", "Services")}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition flex items-center">

                  {t("nav.contact", "Contact")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t("services.popular_services", "Popular Services")}</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/services/cleaning" className="text-gray-300 hover:text-white transition">
                  {t("footer.popular_home_cleaning", "Home Cleaning")}
                </Link>
              </li>
              <li>
                <Link to="/services/plumbing" className="text-gray-300 hover:text-white transition">
                  {t("footer.popular_plumbing_services", "Plumbing Services")}
                </Link>
              </li>
              <li>
                <Link to="/services/electrical-repairing" className="text-gray-300 hover:text-white transition">
                  {t("footer.popular_electrical_repairs", "Electrical Repairs")}
                </Link>
              </li>
              <li>
                <Link to="/services/painting" className="text-gray-300 hover:text-white transition">
                  {t("footer.popular_painting_renovation", "Painting & Renovation")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">{t("footer.contact_us", "Contact Us")}</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <MapPin className="w-6 h-6 text-blue-400 mr-4 shrink-0" />
                <span className="text-gray-300">{t("footer.address", "Kathmandu, Nepal")}</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-6 h-6 text-blue-400 mr-4 shrink-0" />
                <span className="text-gray-300">+977 9800000000</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-6 h-6 text-blue-400 mr-4 shrink-0" />
                <span className="text-gray-300">support@sewasaathi.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            {t("footer.copyright", "© {{year}} SewaSaathi. All rights reserved.", { year: new Date().getFullYear() })}
          </p>
          <div className="flex space-x-6">
            <Link to="/about-us" className="text-gray-400 hover:text-white text-sm transition">
              {t("footer.privacy_policy", "Privacy Policy")}
            </Link>
            <Link to="/about-us" className="text-gray-400 hover:text-white text-sm transition">
              {t("footer.terms_of_service", "Terms of Service")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
