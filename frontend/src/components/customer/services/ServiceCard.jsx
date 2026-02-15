import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  return (
    <Link
      to={`/services/${service.category.name}/${service.id}`}
      className="bg-[#F9F5F0] rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden block"
    >
      {service.image && (
        <img
          src={service.image}
          alt={service.name}
          className="w-full h-52 object-cover"
        />
      )}

      <div className="p-6 space-y-3">
        <span className="inline-block px-3 py-1 text-xs bg-[#1B3C53]/10 text-[#1B3C53] rounded-full capitalize">
          {service.category.name}
        </span>

        <h3 className="text-xl font-semibold text-[#1B3C53]">
          {service.name}
        </h3>

        <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>

        <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-700 space-y-2">
          <div className="flex justify-between">
            <span>Service price</span>
            <span className="font-bold">
              Rs. {Number(service.base_price).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="inline-block px-2 py-1 bg-blue-50 rounded">
              Extra 1% insurance charge will be added later
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
