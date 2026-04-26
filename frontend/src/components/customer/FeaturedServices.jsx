import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Skeleton from "../Skeleton";
import { useTranslation } from "react-i18next";
import { buildLocalizedHeaders } from "../../utils/i18nRequest";

const FeaturedServices = () => {
    const { t, i18n } = useTranslation();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        // Fetch random services
        fetch("http://127.0.0.1:8000/services/service/", {
            headers: buildLocalizedHeaders(),
        })
            .then((res) => res.json())
            .then((data) => {
                const shuffled = data.sort(() => 0.5 - Math.random());
                setServices(shuffled.slice(0, 10)); // Take top 10
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error fetching services:", err);
                setLoading(false);
            });
    }, [i18n.language]);

    const nextSlide = () => {
        if (currentIndex < services.length - 4) { // Show 4 items
            setCurrentIndex(prev => prev + 1);
        } else {
            setCurrentIndex(0); // loop back
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prev => prev - 1);
        } else {
            setCurrentIndex(services.length - 4 > 0 ? services.length - 4 : 0);
        }
    };

    if (loading) {
        return (
            <section className="bg-white py-16 md:py-24 border-t border-gray-100">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="flex flex-col items-center text-center mb-8">
                        <Skeleton className="w-64 h-10 mb-3" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden p-6 space-y-4">
                                <Skeleton className="w-full h-48 rounded-xl" />
                                <Skeleton className="w-24 h-6 rounded-full" />
                                <Skeleton className="w-3/4 h-8" />
                                <Skeleton className="w-1/2 h-5" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (services.length === 0) return null;

    return (
        <section className="bg-white py-16 md:py-24 border-t border-gray-100">
            <div className="container mx-auto px-4 max-w-7xl">

                <div className="relative mb-8">
                    <div className="flex flex-col items-center text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] mb-3">
                            {t('services.featured_services')}
                        </h2>
                    </div>

                    <Link
                        to="/services"
                        className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 text-[#1B3C53] font-medium hover:text-orange-500 transition-colors"
                    >
                        {t('services.view_all')} →
                    </Link>
                </div>


                <div className="relative">
                    {/* Carousel Controls */}
                    <button
                        onClick={prevSlide}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white shadow-lg rounded-full p-3 text-[#1B3C53] hover:bg-gray-50 transition border border-gray-100 hidden md:block"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white shadow-lg rounded-full p-3 text-[#1B3C53] hover:bg-gray-50 transition border border-gray-100 hidden md:block"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>


                    {/* Carousel Track */}
                    <div className="overflow-hidden">
                        <div
                            className="flex transition-transform duration-500 ease-in-out gap-6"
                            style={{ transform: `translateX(-${currentIndex * (100 / 4)}%)` }}
                        >
                            {services.map((service) => (
                                <div key={service.id} className="min-w-[100%] md:min-w-[calc(50%-12px)] lg:min-w-[calc(25%-18px)] flex-shrink-0">
                                    <Link to={`/services/${service.category.slug}/${service.id}`} className="block group">
                                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition">
                                            <div className="h-48 overflow-hidden relative">
                                                <img
                                                    src={service.image}
                                                    alt={service.name}
                                                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="font-bold text-[#1B3C53] text-lg mb-1 truncate">{service.name}</h3>
                                                <p className="text-sm text-gray-500 mb-3">{service.category.name}</p>
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-[#1B3C53]">Rs. {service.base_price}</span>
                                                    <span className="text-sm text-blue-600 font-medium">{t('common.book_now')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-8 md:hidden text-center">
                    <Link to="/services" className="inline-flex items-center text-[#1B3C53] font-semibold">
                        {t('services.view_all')} <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedServices;
