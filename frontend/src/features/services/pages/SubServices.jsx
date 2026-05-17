import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "../../../shared/components/layout/Skeleton";
import Footer from "../../../shared/components/layout/Footer";
import ServiceCard from "../components/ServiceCard"; // Import ServiceCard
import Navbar from '../../../shared/components/layout/Navbar';
import { buildLocalizedHeaders } from "../../../utils/i18nRequest";
import { useTranslation } from "react-i18next";

const SubServices = () => {
  const { t, i18n } = useTranslation();
  const { category } = useParams(); // category slug from URL
  const [services, setServices] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all categories first to get the category ID
        const categoriesRes = await fetch(
          "http://127.0.0.1:8000/services/service-categories/",
          { headers: buildLocalizedHeaders() }
        );
        const categoriesData = await categoriesRes.json();
        const cat = categoriesData.find(
          (c) => c.slug === category
        );
        if (!cat) {
          setServices([]);
          setCategoryData(null);
          setLoading(false);
          return;
        }
        setCategoryData(cat);

        // Fetch services for this category
        const servicesRes = await fetch(
          `http://127.0.0.1:8000/services/service/?category=${cat.id}`,
          { headers: buildLocalizedHeaders() }
        );
        const servicesData = await servicesRes.json();
        setServices(servicesData);
      } catch (err) {
        console.error("Failed to fetch services:", err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [category, i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Skeleton className="w-full h-56 rounded-none" />
        <div className="container mx-auto px-4 max-w-7xl py-12">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="w-64 h-8" />
            <Skeleton className="w-32 h-4" />
          </div>
          <Skeleton className="w-full h-4 mb-10 max-w-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden p-6 space-y-4">
                <Skeleton className="w-full h-48 rounded-xl" />
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-3/4 h-8" />
                <Skeleton className="w-1/2 h-5" />
              </div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      {categoryData && (
        <div
          className="relative h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${categoryData.image})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 container mx-auto max-w-7xl h-full flex items-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">
              {t(`categories.${categoryData.name_key}`)} {t('nav.services')}
            </h1>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-primary capitalize">
            {t('services.available_services', 'Available Services')}
          </h2>
          <Link to="/services-category" className="text-primary hover:text-[#1a3248]">
            {t('nav.back_to_category', '← Back to Category')}
          </Link>
        </div>

        <p className="text-gray-600 mb-10">
          {t('services.pick_category_service', {
            category: t(`categories.${categoryData?.name_key}`),
            defaultValue: `Pick the ${t(`categories.${categoryData?.name_key}`)} service you need — all with transparent pricing.`
          })}
        </p>

        {services.length === 0 ? (
          <p className="text-gray-600">No services found for this category.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {services.map((item) => (
              <ServiceCard key={item.id} service={{ ...item, category: categoryData }} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SubServices;
