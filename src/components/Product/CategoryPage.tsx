import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { selectedCategorySlug, selectedSubcategorySlug, products, setActivePage, catalogCategories, navigateToCategory } = useStore();

  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedGsmRange, setSelectedGsmRange] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [onlyEco, setOnlyEco] = useState<boolean>(false);
  const [onlyHighVis, setOnlyHighVis] = useState<boolean>(false);

  const currentCategory = catalogCategories.find(c => c.slug === selectedCategorySlug) || catalogCategories[0];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category match
      if (selectedCategorySlug !== 'all' && selectedCategorySlug !== 'limited') {
        const matchesCategory = p.categorySlug === selectedCategorySlug || currentCategory.subcategories.some((subcategory) => subcategory.slug === p.subCategory);
        if (!matchesCategory) return false;
      }
      if (selectedSubcategorySlug && p.subCategory !== selectedSubcategorySlug) return false;

      // Gender filter
      if (selectedGender !== 'all' && p.gender.toLowerCase() !== selectedGender.toLowerCase()) {
        return false;
      }

      // GSM filter
      if (selectedGsmRange === 'light' && p.weightGsm > 160) return false;
      if (selectedGsmRange === 'medium' && (p.weightGsm <= 160 || p.weightGsm > 240)) return false;
      if (selectedGsmRange === 'heavy' && p.weightGsm <= 240) return false;

      // Special flags
      if (onlyEco && !p.isEco) return false;
      if (onlyHighVis && !p.isHighVis) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.priceBox - b.priceBox;
      if (sortBy === 'price_desc') return b.priceBox - a.priceBox;
      if (sortBy === 'gsm') return b.weightGsm - a.weightGsm;
      return 0;
    });
  }, [products, selectedCategorySlug, selectedSubcategorySlug, selectedGender, selectedGsmRange, sortBy, onlyEco, onlyHighVis, currentCategory]);

  return (
    <div className="w-full bg-[#fbfbfb] min-h-screen pb-20 font-sans">
      {/* Category Hero Banner */}
      <div className="bg-neutral-900 text-white py-8 px-4 sm:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs text-neutral-400 mb-2">
              <button onClick={() => setActivePage('home')} className="hover:text-white cursor-pointer">Home</button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white font-semibold">Catalog</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-yellow-400 font-bold">{currentCategory.name}</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight">{currentCategory.name}</h1>
            <p className="text-xs sm:text-sm text-neutral-300 mt-1 max-w-2xl">
              Official Roly wholesale distribution collection. Complete stock matrix, European Oeko-Tex certified quality, and multi-tier volume discounts.
            </p>
          </div>

          <div className="bg-neutral-800 p-3 rounded-lg border border-neutral-700 text-xs flex items-center space-x-4">
            <div>
              <span className="text-gray-400 block text-[10px] uppercase">Available Models</span>
              <strong className="text-white font-mono text-sm">{filteredProducts.length} references</strong>
            </div>
            <div className="border-l border-neutral-700 pl-4">
              <span className="text-gray-400 block text-[10px] uppercase">Delivery Speed</span>
              <strong className="text-emerald-400 font-mono text-sm">24/48h Dispatch</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar Filters */}
          <aside className="w-full lg:w-64 shrink-0 space-y-6">
            <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-2xs space-y-5 text-xs">
              <div className="flex items-center justify-between font-bold text-gray-900 border-b border-gray-100 pb-3">
                <span className="flex items-center gap-1.5 uppercase tracking-wide">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filters
                </span>
                <button
                  onClick={() => {
                    setSelectedGender('all');
                    setSelectedGsmRange('all');
                    setOnlyEco(false);
                    setOnlyHighVis(false);
                  }}
                  className="text-[11px] text-gray-500 hover:text-black font-normal"
                >
                  Reset all
                </button>
              </div>

              {/* Categories Submenu */}
              <div>
                <h4 className="font-bold text-gray-800 uppercase mb-2">Category Navigation</h4>
                <div className="space-y-1">
                  {catalogCategories.filter((category) => category.visible).map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => navigateToCategory(cat.slug)}
                      className={`w-full text-left px-2.5 py-1.5 rounded transition-colors flex items-center justify-between ${
                        selectedCategorySlug === cat.slug
                          ? 'bg-black text-white font-bold'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {currentCategory.subcategories.some((subcategory) => subcategory.visible) && (
                <div className="pt-3 border-t border-gray-100">
                  <h4 className="font-bold text-gray-800 uppercase mb-2">{currentCategory.name}</h4>
                  <div className="space-y-1">
                    <button type="button" onClick={() => navigateToCategory(currentCategory.slug)} className={`w-full rounded px-2.5 py-1.5 text-left ${!selectedSubcategorySlug ? 'bg-neutral-200 font-bold' : 'text-gray-600 hover:bg-gray-100'}`}>All products</button>
                    {currentCategory.subcategories.filter((subcategory) => subcategory.visible).map((subcategory) => (
                      <button key={subcategory.id} type="button" onClick={() => navigateToCategory(`${currentCategory.slug}/${subcategory.slug}`)} className={`w-full rounded px-2.5 py-1.5 text-left ${selectedSubcategorySlug === subcategory.slug ? 'bg-black font-bold text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{subcategory.label}</button>
                    ))}
                  </div>
                </div>
              )}

              {/* Gender Filter */}
              <div className="pt-3 border-t border-gray-100">
                <h4 className="font-bold text-gray-800 uppercase mb-2">Gender & Target</h4>
                <div className="space-y-1">
                  {['all', 'Unisex', 'Men', 'Women', 'Kids'].map((g) => (
                    <label key={g} className="flex items-center space-x-2 text-gray-700 cursor-pointer hover:text-black">
                      <input
                        type="radio"
                        name="gender"
                        checked={selectedGender === g}
                        onChange={() => setSelectedGender(g)}
                        className="accent-black"
                      />
                      <span>{g === 'all' ? 'All Collections' : g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Weight GSM */}
              <div className="pt-3 border-t border-gray-100">
                <h4 className="font-bold text-gray-800 uppercase mb-2">Fabric Weight (GSM)</h4>
                <div className="space-y-1">
                  <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gsm"
                      checked={selectedGsmRange === 'all'}
                      onChange={() => setSelectedGsmRange('all')}
                      className="accent-black"
                    />
                    <span>All Weights</span>
                  </label>
                  <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gsm"
                      checked={selectedGsmRange === 'light'}
                      onChange={() => setSelectedGsmRange('light')}
                      className="accent-black"
                    />
                    <span>Lightweight (&lt; 160 g/m²)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gsm"
                      checked={selectedGsmRange === 'medium'}
                      onChange={() => setSelectedGsmRange('medium')}
                      className="accent-black"
                    />
                    <span>Medium (160 - 240 g/m²)</span>
                  </label>
                  <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                    <input
                      type="radio"
                      name="gsm"
                      checked={selectedGsmRange === 'heavy'}
                      onChange={() => setSelectedGsmRange('heavy')}
                      className="accent-black"
                    />
                    <span>Heavyweight (&gt; 240 g/m²)</span>
                  </label>
                </div>
              </div>

              {/* Special Badges */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyEco}
                    onChange={(e) => setOnlyEco(e.target.checked)}
                    className="rounded accent-emerald-600"
                  />
                  <span>100% Organic & Eco</span>
                </label>
                <label className="flex items-center space-x-2 text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={onlyHighVis}
                    onChange={(e) => setOnlyHighVis(e.target.checked)}
                    className="rounded accent-yellow-500"
                  />
                  <span>High-Visibility Certified</span>
                </label>
              </div>

            </div>
          </aside>

          {/* Main Grid View */}
          <main className="flex-1">
            {/* Sorting Toolbar */}
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-6 flex flex-wrap items-center justify-between gap-4 text-xs">
              <span className="text-gray-500 font-semibold">
                Showing <strong className="text-gray-900">{filteredProducts.length}</strong> products
              </span>

              <div className="flex items-center space-x-2">
                <span className="text-gray-600 font-semibold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-50 border border-gray-300 rounded px-3 py-1.5 text-xs font-semibold outline-none focus:border-black"
                >
                  <option value="featured">Featured / Catalog Order</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="gsm">Fabric Weight (Heaviest)</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
                <p className="text-base font-bold text-gray-800">No products match your current filters.</p>
                <p className="text-xs text-gray-500 mt-1">Try resetting the weight, gender or certification options.</p>
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
};
