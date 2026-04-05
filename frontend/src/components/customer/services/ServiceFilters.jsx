import { Search } from 'lucide-react';

const ServiceFilters = ({
  searchQuery,
  setSearchQuery,
  categories,
  selectedCategories,
  setSelectedCategories,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  ordering,
  setOrdering,
}) => {
  return (
    <div
      style={{
        position: 'sticky',
        top: '90px',
        maxHeight: 'calc(100vh - 120px)',
        overflowY: 'auto',
      }}
      className="bg-white rounded-2xl shadow-md border border-gray-100 self-start"
    >
      {/* Sidebar Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="text-base font-bold text-[#1B3C53] tracking-wide uppercase">Filters</h3>
      </div>

      <div className="px-5 py-4 space-y-6">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-2">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#1B3C53] focus:ring-1 focus:ring-[#1B3C53] transition"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Category</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() =>
                    setSelectedCategories((prev) =>
                      prev.includes(cat.id)
                        ? prev.filter((id) => id !== cat.id)
                        : [...prev, cat.id]
                    )
                  }
                  className="w-4 h-4 rounded accent-[#1B3C53] cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-[#1B3C53] transition">
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Price Range */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Price Range</h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#1B3C53] focus:ring-1 focus:ring-[#1B3C53] transition"
              />
            </div>
            <div className="flex items-center text-gray-400 text-xs">—</div>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#1B3C53] focus:ring-1 focus:ring-[#1B3C53] transition"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100" />

        {/* Sort By */}
        <div>
          <h4 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">Sort By</h4>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-[#1B3C53] focus:ring-1 focus:ring-[#1B3C53] transition cursor-pointer"
          >
            <option value="">Default</option>
            <option value="base_price">Price: Low → High</option>
            <option value="-base_price">Price: High → Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>

        {/* Clear All Button */}
        {(searchQuery || selectedCategories.length > 0 || minPrice || maxPrice || ordering) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategories([]);
              setMinPrice('');
              setMaxPrice('');
              setOrdering('');
            }}
            className="w-full py-2 text-sm font-semibold text-[#1B3C53] border border-[#1B3C53] rounded-lg hover:bg-[#1B3C53] hover:text-white transition"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceFilters;
