import { useEffect, useState } from "react";
import ServiceCard from "../../components/customer/services/ServiceCard";
import ServiceFilters from "../../components/customer/services/ServiceFilters";
import DashboardHeader from "../../components/customer/DashboardHeader"; // Navbar/Header
import Footer from "../../components/customer/Footer"; // Footer

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ordering, setOrdering] = useState("");

  // Fetch categories once
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/services/service-categories/");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch services whenever filters change
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        // Build query params
        const params = new URLSearchParams();
        if (selectedCategories.length) selectedCategories.forEach(id => params.append("category", id));
        if (minPrice) params.append("min_price", minPrice);
        if (maxPrice) params.append("max_price", maxPrice);
        if (ordering) params.append("ordering", ordering);

        const url = `http://127.0.0.1:8000/services/service/?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch services");
        const data = await res.json();
        setServices(data);
      } catch (err) {
        console.error(err);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategories, minPrice, maxPrice, ordering]);

  return (
    <div className="min-h-screen bg-[#F9F5F0]">
    <DashboardHeader />
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters */}
      <ServiceFilters
        categories={categories}
        selectedCategories={selectedCategories}
        setSelectedCategories={setSelectedCategories}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        ordering={ordering}
        setOrdering={setOrdering}
      />

      {/* Services Grid */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading services...</p>
        ) : services.length === 0 ? (
          <p>No services found.</p>
        ) : (
          services.map((service) => <ServiceCard key={service.id} service={service} />)
        )}
      </div>
    </div>
         {/* Footer */}
      <Footer />
    </div>
  );
};

export default ServicesPage;
