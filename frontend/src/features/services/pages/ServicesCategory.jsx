import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../../../shared/components/layout/Skeleton";
import Footer from "../../../shared/components/layout/Footer";
import servicesBg from "../../../assets/images/services/electrical.png";
import Navbar from '../../../shared/components/layout/Navbar';
import { buildLocalizedHeaders } from "../../../utils/i18nRequest";
import { useTranslation } from "react-i18next";

const ServicesCategory = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/services/service-categories/", {
          headers: buildLocalizedHeaders(),
        });
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [i18n.language]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <section
          className="relative py-24 md:py-32 flex items-center"
          style={{
            backgroundImage: `url(${servicesBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-primary opacity-70"></div>

          <div className="relative container mx-auto px-4 max-w-7xl text-center text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t('services.featured_categories', 'Service Categories')}
            </h1>
            <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
              {t('services.reliable_solutions', 'Choose a category to explore available services')}
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-lg">
                  <Skeleton className="w-24 h-24 mx-auto mb-5 rounded-full" />
                  <Skeleton className="h-7 w-3/5 mx-auto mb-3 rounded-lg" />
                  <Skeleton className="h-4 w-full mb-2 rounded" />
                  <Skeleton className="h-4 w-4/5 mx-auto rounded" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background font-sans text-gray-900">
      <Navbar />

      {/* HERO */}
      <section
        className="relative py-24 md:py-32 flex items-center"
        style={{
          backgroundImage: `url(${servicesBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-primary opacity-70"></div>

        <div className="relative container mx-auto px-4 max-w-7xl text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('services.featured_categories', 'Service Categories')}
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            {t('services.reliable_solutions', 'Choose a category to explore available services')}
          </p>
        </div>
      </section>

      {/* CATEGORY GRID */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={`/services/${category.slug}`}
                className="bg-white rounded-xl p-6 hover:shadow-xl transition shadow-lg block text-center"
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={t(`categories.${category.name_key}`)}
                    className="w-24 h-24 mx-auto mb-4 object-cover rounded-full"
                  />
                )}

                <h3 className="text-2xl font-bold text-primary mb-2">
                  {t(`categories.${category.name_key}`)}
                </h3>

                <p className="text-gray-600 text-sm line-clamp-2 text-ellipsis overflow-hidden h-10">
                  {t(`categories.${category.description_key}`)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ServicesCategory;
