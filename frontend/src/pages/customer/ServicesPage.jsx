import { useEffect, useState } from "react";
import ServiceCard from "../../components/customer/services/ServiceCard";
import Skeleton from "../../components/Skeleton";
import ServiceFilters from "../../components/customer/services/ServiceFilters";
import DashboardHeader from "../../components/customer/DashboardHeader"; // Navbar/Header
import Footer from "../../components/customer/Footer"; // Footer
import Pagination from "../../components/common/Pagination";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [ordering, setOrdering] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

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
    setCurrentPage(1); // Reset to page 1 when filters change
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
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-md overflow-hidden p-6 space-y-4">
                  <Skeleton className="w-full h-48 rounded-xl" />
                  <Skeleton className="w-24 h-6 rounded-full" />
                  <Skeleton className="w-3/4 h-8" />
                  <Skeleton className="w-1/2 h-5" />
                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <Skeleton className="w-20 h-6" />
                    <Skeleton className="w-16 h-6" />
                  </div>
                </div>
              ))
            ) : services.length === 0 ? (
              <p className="col-span-full text-center py-20 text-gray-500">No services found.</p>
            ) : (
                services
                .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                .map((service) => <ServiceCard key={service.id} service={service} />)
            )}
          </div>
          
          <Pagination 
            currentPage={currentPage}
            totalPages={Math.ceil(services.length / itemsPerPage)}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default ServicesPage;
