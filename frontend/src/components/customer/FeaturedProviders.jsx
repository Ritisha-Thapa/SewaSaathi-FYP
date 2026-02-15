import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

/**
 * Lists featured providers in a horizontal carousel.
 * Fetches from /accounts/providers/
 */
const FeaturedProviders = () => {
    const [providers, setProviders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/services/provider-services/");
                const data = await res.json();
                // Assuming pagination or list, take first 10
                const list = Array.isArray(data) ? data : data.results || [];
                // Filter for available services only
                const availableServices = list.filter(item => item.is_available);
                setProviders(availableServices.slice(0, 10));
            } catch (err) {
                console.error("Failed to fetch featured services", err);
            } finally {
                setLoading(false);
            }
        };
        fetchProviders();
    }, []);

    const nextSlide = () => {
        if (currentIndex + 4 < providers.length) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) return null;
    if (!providers.length) return null;

    return (
        <section className="bg-white py-16 md:py-24 border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-7xl">
                <div className="relative mb-8">
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] mb-3">
                            Provider Services
                        </h2>
                        {/* <p className="text-gray-600 text-lg max-w-2xl">
                            Top rated service providers! Book them directly!
                        </p> */}
                    </div>

                    <Link
                        to="/service-providers"
                        /* Note: The user might want this link to go to a services list or keep it as service-providers. 
                           The previous link was /service-providers. 
                           The PROMPT says: "Clicking a card should route to the provider-service detail page using its ID."
                           It doesn't explicitly mention the "View All" link, but it's likely safe to keep or point to a general list.
                           I'll keep it as is for now or maybe point to a services page if it exists. 
                           Actually, /service-providers is likely the listing page. I will leave it.
                        */
                        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-[#1B3C53] font-medium hover:text-orange-500 transition-colors"
                    >
                        View All →
                    </Link>
                </div>


                <div className="relative group">
                    <div className="overflow-hidden -mx-2 p-2">
                        <div
                            className="flex transition-transform duration-500 ease-out gap-6"
                            style={{ transform: `translateX(-${currentIndex * 270}px)` }}
                        >
                            {providers.map((item) => (
                                <Link
                                    key={item.id}
                                    to={`/provider-services/${item.id}`}
                                    className="min-w-[250px] md:min-w-[260px] bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 block group/card"
                                >
                                    <div className="h-48 relative overflow-hidden rounded-t-2xl">
                                        {item.provider?.profile_image ? (
                                            <img
                                                src={item.provider.profile_image}
                                                alt={item.provider.first_name}
                                                className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-yellow-500 flex items-center gap-1 shadow-sm">
                                            <Star size={12} fill="currentColor" /> {item.rating || "N/A"}
                                        </div>
                                    </div>

                                    <div className="p-5">
                                        <p className="text-sm text-gray-500 mb-1 capitalize">
                                            {item.service?.name}
                                        </p>
                                        <h3 className="text-lg font-bold text-[#1B3C53] mb-1 capitalize">
                                            {item.provider?.first_name} {item.provider?.last_name}
                                        </h3>
                                        <p className="text-base text-black-600 font-bold mb-4">
                                            Rs. {item.price}
                                            <span className="text-xs text-gray-400 font-normal ml-1">
                                                / {item.pricing_type}
                                            </span>
                                        </p>
                                        <span className="text-sm text-blue-600 font-medium">
                                            Book Now
                                        </span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Controls - Only show if enough items */}
                    {providers.length > 4 && (
                        <>
                            <button
                                onClick={prevSlide}
                                disabled={currentIndex === 0}
                                className="absolute -left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1B3C53] disabled:opacity-0 disabled:pointer-events-none hover:scale-110 transition-all z-10"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={nextSlide}
                                disabled={currentIndex + 4 >= providers.length}
                                className="absolute -right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-[#1B3C53] disabled:opacity-0 disabled:pointer-events-none hover:scale-110 transition-all z-10"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>

                <div className="mt-8 md:hidden text-center">
                    <Link
                        to="/service-providers"
                        className="text-[#1B3C53] font-medium hover:text-orange-500 transition-colors"
                    >
                        View All Providers →
                    </Link>
                </div>

            </div>
        </section>
    );
};

export default FeaturedProviders;
