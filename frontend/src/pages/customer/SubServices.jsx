import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SubCatHeader from "../../components/customer/SubCatHeader";
import Footer from "../../components/customer/Footer";
import ServiceCard from "../../components/customer/services/ServiceCard"; // Import ServiceCard

const formatPrice = (n) => `Rs. ${n.toLocaleString()}`;

const SubServices = () => {
  const { category } = useParams(); // category slug from URL
  const [services, setServices] = useState([]);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all categories first to get the category ID
        const categoriesRes = await fetch(
          "http://127.0.0.1:8000/services/service-categories/"
        );
        const categoriesData = await categoriesRes.json();
        const cat = categoriesData.find(
          (c) => c.name.toLowerCase() === category.toLowerCase()
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
          `http://127.0.0.1:8000/services/service/?category=${cat.id}`
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
  }, [category]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading services...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-[#F9F5F0] to-[#ece7df]">
      <SubCatHeader />

      {/* Hero Section */}
      {categoryData && (
        <div
          className="relative h-56 bg-cover bg-center"
          style={{ backgroundImage: `url(${categoryData.image})` }}
        >
          <div className="absolute inset-0 bg-black/40"></div>

          <div className="relative z-10 container mx-auto max-w-7xl h-full flex items-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white capitalize">
              {categoryData.name} Services
            </h1>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div className="container mx-auto px-4 max-w-7xl py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-[#1B3C53] capitalize">
            Available Services
          </h2>
          <Link to="/services" className="text-[#1B3C53] hover:text-[#1a3248]">
            Back to Services
          </Link>
        </div>

        <p className="text-gray-600 mb-10">
          Pick the {categoryData?.name} service you need — all with transparent
          pricing.
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
