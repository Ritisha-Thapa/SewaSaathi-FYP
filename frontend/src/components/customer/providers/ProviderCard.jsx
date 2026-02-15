import React from "react";
import { Link } from "react-router-dom";

const ProviderCard = ({ provider }) => {
    return (
        <Link
            to={`/service-providers/${provider.id}`}
            className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden block"
        >
            <div className="h-52 w-full bg-gray-200 relative overflow-hidden">
                {provider.profile_image ? (
                    <img
                        src={provider.profile_image}
                        alt={`${provider.first_name} ${provider.last_name}`}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                    </div>
                )}
            </div>

            <div className="p-6 space-y-3">
                {provider.skills && (
                    <span className="inline-block px-3 py-1 text-xs bg-[#1B3C53]/10 text-[#1B3C53] rounded-full capitalize">
                        {provider.skills}
                    </span>
                )}

                <h3 className="text-xl font-semibold text-[#1B3C53] capitalize">
                    {provider.first_name} {provider.last_name}
                </h3>

                <div className="text-sm text-gray-600 space-y-1">
                    <p className="flex items-center gap-2">
                        <span>📍 {provider.city}</span>
                    </p>
                    <p>Experience: {provider.experience_years} Years</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between items-center">
                        <span>Rating</span>
                        <span className="font-bold text-yellow-500 flex items-center gap-1">
                            ★ {provider.average_rating || "N/A"}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProviderCard;
