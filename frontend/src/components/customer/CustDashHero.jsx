import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import painting from "../../assets/images/services/painting.png";

const CustDashHero = () => {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/services/service-categories/");
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchValue.trim().toLowerCase();

    if (!query) {
      navigate("/services");
      return;
    }

    // Find if the query matches any category name (case-insensitive)
    const match = categories.find(c => c.name.toLowerCase() === query);

    if (match) {
      navigate(`/services/${match.name}`);
    } else {
      // Fallback to services page if no category matches
      navigate("/services");
    }
  };

  return (
    <section className="bg-white pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Left Column: Content & Search */}
          <div className="w-full lg:w-1/2 z-10">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-black mb-6 leading-[1.1]">
              Discover reliable{" "}
              <span className="text-[#1B3C53]">home service</span> pros in your
              area.
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              From quick repairs to full renovations — find trusted, vetted
              professionals ready to handle any home project
            </p>

            {/* Search Box Container */}
            <div className="max-w-xl relative">
              {/* Input Area */}
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100 h-14"
              >
                <input
                  type="text"
                  placeholder="Search for plumbing, cleaning, painting"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="flex-1 px-6 py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-lg h-full"
                />
                <button
                  type="submit"
                  className="bg-[#1B3C53] text-white h-full px-8 hover:bg-[#153043] transition duration-300 flex items-center justify-center"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </form>


            </div>
          </div>

          {/* Right Column: Image */}
          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end">
            {/* Abstract Blur/Gradient Background Effect behind image */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-blue-50 to-pink-50 rounded-full blur-3xl -z-10 opacity-60"></div>

            <div className="relative z-10 w-full max-w-xl">
              <img
                src={painting}
                alt="Professional Service Provider"
                className="w-full h-auto object-contain drop-shadow-2xl animate-fade-in-up"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustDashHero;
