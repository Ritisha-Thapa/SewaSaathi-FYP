import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import painting from "../../../assets/images/services/electricianman.png";
import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { buildLocalizedHeaders } from "../../../utils/i18nRequest";
import {
  findCategoryBySearchQuery,
  getCategoryLabel,
  getCategorySearchSuggestions,
} from "../../../utils/categorySearch";
import Button from "../../../shared/components/ui/Button";

const CustDashHero = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [categories, setCategories] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/services/service-categories/", {
          headers: buildLocalizedHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, [i18n.language]);

  const suggestions = useMemo(
    () => getCategorySearchSuggestions(categories, searchValue, t),
    [categories, searchValue, t, i18n.language]
  );

  const openSuggestions = showSuggestions && searchValue.trim() && suggestions.length > 0;

  const goToCategory = (category) => {
    if (category?.slug) {
      navigate(`/services/${category.slug}`);
    }
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();

    if (openSuggestions && activeIndex >= 0 && suggestions[activeIndex]) {
      goToCategory(suggestions[activeIndex]);
      return;
    }

    const query = searchValue.trim().toLowerCase();

    if (!query) {
      navigate("/services");
      return;
    }

    const match = findCategoryBySearchQuery(categories, query, t);

    if (match?.slug) {
      navigate(`/services/${match.slug}`);
    } else {
      navigate("/services");
    }
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setShowSuggestions(true);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!openSuggestions) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleSuggestionClick = (category) => {
    goToCategory(category);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section
      className={`relative bg-background pt-10 pb-16 md:pt-16 md:pb-24 ${
        openSuggestions ? "z-50" : "z-10"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="w-full lg:w-1/2">
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-[1.1]">
              {t("cust_dash.hero_title_part1")}{" "}
              <span className="text-primary">{t("cust_dash.hero_title_part2")}</span>{" "}
              {t("cust_dash.hero_title_part3")}
            </h1>

            <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
              {t("cust_dash.hero_subtitle")}
            </p>

            <div ref={searchContainerRef} className="max-w-xl relative">
              <form
                onSubmit={handleSearch}
                className="flex items-center bg-white rounded-2xl shadow-xl shadow-primary/5 border border-gray-100 h-16 group focus-within:border-primary/30 transition-all"
                role="search"
              >
                <input
                  type="text"
                  placeholder={t("cust_dash.search_placeholder")}
                  value={searchValue}
                  onChange={handleInputChange}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={handleKeyDown}
                  autoComplete="off"
                  aria-autocomplete="list"
                  aria-expanded={openSuggestions}
                  aria-controls="category-search-suggestions"
                  className="flex-1 px-6 py-3 text-gray-700 placeholder-gray-400 focus:outline-none text-lg h-full rounded-l-full"
                />
                <Button
                  type="submit"
                  fullWidth={false}
                  className="h-full px-8 !rounded-l-none"
                >
                  <Search size={24} />
                </Button>
              </form>

              {openSuggestions && (
                <ul
                  id="category-search-suggestions"
                  role="listbox"
                  className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-50 bg-white rounded-2xl shadow-xl shadow-primary/10 border border-gray-100 py-2 max-h-64 overflow-y-auto"
                >
                  {suggestions.map((category, index) => (
                    <li key={category.id} role="option" aria-selected={index === activeIndex}>
                      <button
                        type="button"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSuggestionClick(category)}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`w-full text-left px-6 py-3 text-lg transition-colors ${
                          index === activeIndex
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {getCategoryLabel(category, t)}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/2 relative flex justify-center lg:justify-end overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl -z-10 opacity-60" />

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
