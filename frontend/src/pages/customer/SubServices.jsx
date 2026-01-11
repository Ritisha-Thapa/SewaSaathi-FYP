import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import SubCatHeader from "../../components/customer/SubCatHeader";
import Footer from "../../components/customer/Footer";

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
              <Link
                key={item.id}
                to={`/services/${category}/${item.id}`}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden block"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-52 object-cover"
                  />
                )}

                <div className="p-6 space-y-3">
                  <span className="inline-block px-3 py-1 text-xs bg-[#1B3C53]/10 text-[#1B3C53] rounded-full capitalize">
                    {categoryData?.name}
                  </span>

                  <h3 className="text-xl font-semibold text-[#1B3C53]">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-600">{item.description}</p>

                  <div className="mt-4 pt-3 border-t border-gray-200 text-sm text-gray-700 space-y-2">
                    <div className="flex justify-between">
                      <span>Service price</span>
                      <span>{formatPrice(item.base_price)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <span className="inline-block px-2 py-1 bg-blue-50 rounded">
                        Extra 1% insurance charge will be added later
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SubServices;
