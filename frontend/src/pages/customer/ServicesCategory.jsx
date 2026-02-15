import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardHeader from "../../components/customer/DashboardHeader";
import Footer from "../../components/customer/Footer";
import servicesBg from "../../assets/images/services/electrical.png";

const ServicesCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          "http://127.0.0.1:8000/services/service-categories/"
        );
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading categories...
      </div>
    );
  }

  return (
    <div className="font-sans text-gray-900 min-h-screen bg-[#F9F5F0]">
      <DashboardHeader />

      {/* HERO */}
      <section
        className="relative py-24 md:py-32 flex items-center"
        style={{
          backgroundImage: `url(${servicesBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-[#1B3C53] opacity-70"></div>

        <div className="relative container mx-auto px-4 max-w-7xl text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Service Categories
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">
            Choose a category to explore available services
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
                to={`/services/${category.name
                  .toLowerCase()
                  .replace(/\s+/g, "-")}`}
                className="bg-white rounded-xl p-6 hover:shadow-xl transition shadow-lg block text-center"
              >
                {category.image && (
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-24 h-24 mx-auto mb-4 object-cover rounded-full"
                  />
                )}

                <h3 className="text-2xl font-bold text-[#1B3C53] mb-2">
                  {category.name}
                </h3>

                <p className="text-gray-600 text-sm">{category.description}</p>
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
