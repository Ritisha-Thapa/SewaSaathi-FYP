import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ServiceBackLink = ({ to, children, className = "" }) => (
  <Link
    to={to}
    className={`text-primary hover:text-gray-500 text-md mb-2 inline-flex items-center gap-2 ${className}`}
  >
    <ArrowLeft size={16} />
    {children}
  </Link>
);

export default ServiceBackLink;
