import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Skeleton from "../Skeleton";
import { useTranslation } from "react-i18next";
import { buildLocalizedHeaders } from "../../utils/i18nRequest";

const FeaturedCategories = () => {
  const { t, i18n } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/services/service-categories/", {
      headers: buildLocalizedHeaders(),
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching categories:", err);
        setLoading(false);
      });
  }, [i18n.language]);

  if (loading) {
    return (
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex justify-center mb-12">
            <Skeleton className="w-64 h-10" />
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-8 w-full justify-items-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 w-full">
                <Skeleton className="w-20 h-20 md:w-28 md:h-28 rounded-full flex-shrink-0" />
                <Skeleton className="w-16 h-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#1B3C53] text-center mb-12">
          {t('services.featured_categories')}
        </h2>

        {/* Categories Row - Dynamic Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-8 w-full justify-items-center">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/services/${category.slug}`}
              className="flex flex-col items-center group w-full"
            >
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#1B3C53] transition-all duration-300 shadow-sm mb-3">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <span className="text-sm md:text-base font-medium text-gray-700 group-hover:text-[#1B3C53] text-center leading-tight">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
};

export default FeaturedCategories;
