import { Search, Filter, RotateCcw, Check } from 'lucide-react';
import Button from '../../../shared/components/ui/Button';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  return (
    <div
      className="bg-white rounded-[2rem] shadow-xl shadow-primary/5 border border-gray-100 self-start sticky top-[100px] max-h-[calc(100vh-140px)] overflow-y-auto overflow-x-hidden scrollbar-hide"
    >
      {/* Sidebar Header */}
      <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-primary text-white">
        <div className="flex items-center gap-2">
          <Filter size={18} />
          <h3 className="text-sm font-black uppercase tracking-widest">{t('bookings.filter_by', 'Filters')}</h3>
        </div>
      </div>

      <div className="px-6 py-6 space-y-8">
        {/* Search Input */}
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{t('labels.search', 'Search')}</label>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Type to search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-sm border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-50" />

        {/* Category Filter */}
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Category</h4>
          <div className="space-y-3">
            {categories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div className="relative flex items-center">
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
                    className="peer w-5 h-5 rounded-lg border-2 border-gray-200 checked:bg-primary checked:border-primary transition-all cursor-pointer appearance-none"
                  />
                  <Check size={12} className="absolute left-1 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <span className="text-sm font-bold text-gray-600 group-hover:text-primary transition-colors">
                  {t(`categories.${cat.name_key}`)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-50" />

        {/* Price Range */}
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Price Range</h4>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
            <div className="text-gray-300 font-bold">/</div>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-50" />

        {/* Sort By */}
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Sort By</h4>
          <select
            value={ordering}
            onChange={(e) => setOrdering(e.target.value)}
            className="w-full px-4 py-3 text-sm border border-gray-100 rounded-xl bg-gray-50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all cursor-pointer font-bold text-gray-600"
          >
            <option value="">{t('bookings.default_ordering', 'Default Ordering')}</option>
            <option value="base_price">{t('bookings.price_low_high', 'Price: Low → High')}</option>
            <option value="-base_price">{t('bookings.price_high_low', 'Price: High → Low')}</option>
            <option value="name_key">{t('bookings.name_az', 'Name A–Z')}</option>
          </select>
        </div>

        {/* Clear All Button */}
        {(searchQuery || selectedCategories.length > 0 || minPrice || maxPrice || ordering) && (
          <Button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategories([]);
              setMinPrice('');
              setMaxPrice('');
              setOrdering('');
            }}
            variant="ghost"
            className="w-full py-4 text-xs font-black uppercase tracking-widest text-red-500 hover:bg-red-50 hover:text-red-600 transition-all border border-red-100"
          >
            <RotateCcw size={14} className="mr-2" />
            Reset All
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceFilters;
