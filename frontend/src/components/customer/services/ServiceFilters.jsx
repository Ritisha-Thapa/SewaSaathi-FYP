const ServiceFilters = ({
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
    <div className="bg-white p-6 rounded-xl shadow space-y-4">
      {/* Category Filter */}
      <div>
        <h4 className="font-semibold mb-2">Category</h4>
        {categories.map((cat) => (
          <label key={cat.id} className="flex items-center gap-2">
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
            />
            {cat.name}
          </label>
        ))}
      </div>

      {/* Price */}
      <div>
        <h4 className="font-semibold mb-2">Price Range</h4>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border p-2 rounded w-full"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>
      </div>

      {/* Ordering */}
      <div>
        <h4 className="font-semibold mb-2">Sort By</h4>
        <select
          value={ordering}
          onChange={(e) => setOrdering(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">Default</option>
          <option value="base_price">Price: Low → High</option>
          <option value="-base_price">Price: High → Low</option>
          <option value="name">Name A–Z</option>
        </select>
      </div>
    </div>
  );
};

export default ServiceFilters;
