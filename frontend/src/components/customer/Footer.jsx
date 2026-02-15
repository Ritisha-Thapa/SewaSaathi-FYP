import React from "react";
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#1B3C53] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div>
            <Link to="/customer-dashboard" className="text-3xl font-bold text-white mb-6 block">
              SewaSaathi
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Your trusted partner for all home services.
              Connecting you with verified professionals for quick
              and reliable solutions.
            </p>
            <div className="flex items-center space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <Twitter className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <Instagram className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">
                <Linkedin className="w-5 h-5 text-white" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/customer-dashboard" className="text-gray-300 hover:text-white transition flex items-center">
                  
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about-us" className="text-gray-300 hover:text-white transition flex items-center">
                  
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services-category" className="text-gray-300 hover:text-white transition flex items-center">
                  
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-white transition flex items-center">
                
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6">Popular Services</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/services/Cleaning" className="text-gray-300 hover:text-white transition">
                  Home Cleaning
                </Link>
              </li>
              <li>
                <Link to="/services/Plumbing" className="text-gray-300 hover:text-white transition">
                  Plumbing Services
                </Link>
              </li>
              <li>
                <Link to="/services/Electrical" className="text-gray-300 hover:text-white transition">
                  Electrical Repairs
                </Link>
              </li>
              <li>
                <Link to="/services/Painting" className="text-gray-300 hover:text-white transition">
                  Painting & Renovation
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6">Contact Us</h3>
            <ul className="space-y-6">
              <li className="flex items-start">
                <MapPin className="w-6 h-6 text-blue-400 mr-4 shrink-0" />
                <span className="text-gray-300">Kathmandu, Nepal</span>
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
            © {new Date().getFullYear()} SewaSaathi. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="text-gray-400 hover:text-white text-sm transition">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white text-sm transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
