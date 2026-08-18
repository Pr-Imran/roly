import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { 
  Star, 
  ShoppingBag, 
  Sparkles, 
  FileText, 
  ShieldCheck, 
  Truck, 
  Package, 
  Layers, 
  Check, 
  ChevronRight,
  Info,
  ArrowLeft,
  Share2,
  Download,
  Box,
  Printer,
  FileCheck,
  CheckCircle2,
  Sliders,
  Scissors,
  Droplets,
  ExternalLink,
  Flame,
  Palette
} from 'lucide-react';
import { Product } from '../../types';

export const ProductDetail: React.FC = () => {
  const {
    selectedModelCode,
    products,
    displayPrices,
    favorites,
    toggleFavorite,
    addToCart,
    setActivePage,
    navigateToCategory,
    navigateToProduct,
    showToast,
  } = useStore();

  const product = products.find((p) => p.modelCode === selectedModelCode) || products[0];

  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [activeMenuTab, setActiveMenuTab] = useState<'matrix' | 'technical' | 'packaging' | 'customization' | 'downloads'>('matrix');

  const isFav = favorites.includes(product.modelCode);

  // Sync color changes
  const handleColorChange = (color: typeof product.colors[0]) => {
    setSelectedColor(color);
  };

  const handleQtyChange = (size: string, value: string) => {
    const qty = parseInt(value, 10);
    setQuantities((prev) => ({
      ...prev,
      [size]: isNaN(qty) || qty < 0 ? 0 : qty,
    }));
  };

  const totalQuantity: number = (Object.values(quantities) as number[]).reduce((a: number, b: number) => a + (Number(b) || 0), 0);

  // Dynamic wholesale tier calculation
  const getEffectiveUnitPrice = (): number => {
    if (totalQuantity >= product.boxQuantity) {
      return product.priceBox;
    }
    if (totalQuantity >= product.packQuantity) {
      return product.pricePack;
    }
    return product.priceUnit;
  };

  const currentUnitPrice: number = getEffectiveUnitPrice();
  const totalPrice: number = totalQuantity * currentUnitPrice;

  const handleAddSelectionToCart = () => {
    if (totalQuantity === 0) {
      showToast('Please enter a quantity for at least one size', 'warning');
      return;
    }

    const filteredBreakdown: Record<string, number> = {};
    Object.entries(quantities).forEach(([sz, q]) => {
      const count = Number(q);
      if (count > 0) filteredBreakdown[sz] = count;
    });

    addToCart({
      productId: product.id,
      modelCode: product.modelCode,
      productName: `${product.name} - ${product.subtitle || product.category}`,
      image: selectedImage,
      colorName: selectedColor.name,
      colorHex: selectedColor.hex,
      sizeBreakdown: filteredBreakdown,
      totalQuantity,
      unitPrice: currentUnitPrice,
      totalPrice,
    });

    setQuantities({});
  };

  // Quick fill triggers
  const handleQuickFill = (type: 'pack' | 'box' | 'pallet') => {
    let multiplier = 1;
    if (type === 'pack') multiplier = product.packQuantity;
    else if (type === 'box') multiplier = product.boxQuantity;
    else if (type === 'pallet') multiplier = product.boxQuantity * 24; // 24 boxes / pallet

    const countPerSize = Math.ceil(multiplier / product.sizes.length);
    const newQtys: Record<string, number> = {};
    product.sizes.forEach((sz) => {
      newQtys[sz] = countPerSize;
    });
    setQuantities(newQtys);
    showToast(`Matrix loaded with 1 full ${type.toUpperCase()} (${Object.values(newQtys).reduce((a,b)=>a+b,0)} pcs total)`, 'info');
  };

  const colorStockMap = product.stockMatrix[selectedColor.name] || {};

  // Find related models in same category
  const relatedModels = products.filter(p => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 4);

  return (
    <div className="w-full bg-[#f8f8f8] min-h-screen pb-24 font-sans">
      
      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <button onClick={() => setActivePage('home')} className="hover:text-black cursor-pointer">Home</button>
            <ChevronRight className="w-3 h-3" />
            <button onClick={() => navigateToCategory(product.categorySlug)} className="hover:text-black cursor-pointer">
              {product.category}
            </button>
            <ChevronRight className="w-3 h-3" />
            <span className="font-bold text-gray-900 font-mono">{product.modelCode}</span>
            <span className="font-bold text-gray-900">{product.name}</span>
          </div>

          <div className="flex items-center space-x-3 text-[11px]">
            <span className="bg-neutral-100 text-neutral-800 font-mono font-bold px-2 py-0.5 rounded border border-neutral-200">
              TARIC: 61091000
            </span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Alicante Logistics Hub: Available
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-8">
        
        {/* Top Product Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          
          {/* Left Column: Image Gallery & Swatches */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-square bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs group">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
              />

              <button
                onClick={() => toggleFavorite(product.modelCode)}
                className="absolute top-4 right-4 p-2.5 bg-white/90 hover:bg-white rounded-full shadow-md transition-all cursor-pointer"
                title="Save model to favourites"
              >
                <Star className={`w-5 h-5 ${isFav ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
              </button>

              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="bg-black text-white text-xs font-mono font-black px-3 py-1 rounded-sm shadow-xs uppercase tracking-wider">
                  {product.modelCode}
                </span>
                {product.oekoTexCertified && (
                  <span className="bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm flex items-center gap-1 shadow-xs">
                    <ShieldCheck className="w-3 h-3" />
                    OEKO-TEX® 100
                  </span>
                )}
                {product.isEco && (
                  <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
                    100% ORGANIC COTTON
                  </span>
                )}
                {product.isHighVis && (
                  <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
                    HIGH-VIS EN20471
                  </span>
                )}
              </div>

              <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-xs text-white text-xs font-mono font-bold px-2.5 py-1 rounded-md">
                {product.weightGsm} g/m² • {product.gender}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                    selectedImage === img ? 'border-black shadow-md scale-98' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Color Swatch Selector for fast gallery preview */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-900">
                  Select Shade: <span className="font-semibold text-neutral-600">{selectedColor.name}</span>
                </span>
                <span className="text-gray-400 font-mono">{product.colors.length} shades</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => handleColorChange(c)}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer flex items-center justify-center ${
                      selectedColor.code === c.code ? 'border-black ring-2 ring-black/20 scale-110' : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor.code === c.code && (
                      <Check className={`w-4 h-4 ${['#FFFFFF', '#FACC15', '#FFF'].includes(c.hex) ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Title, Volume Price Tiers & Summary */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-2xs">
              
              <div className="border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-2 text-xs font-mono font-bold text-gray-400 uppercase tracking-wider mb-1">
                  <span>{product.category}</span>
                  <span>•</span>
                  <span>{product.gender} COLLECTION</span>
                  {product.vendorName && (
                    <>
                      <span>•</span>
                      <span className="text-purple-600 font-bold">Vendor: {product.vendorName}</span>
                    </>
                  )}
                </div>
                <h1 className="text-2xl sm:text-4xl font-black text-gray-900 tracking-tight uppercase">
                  {product.name}
                </h1>
                <p className="text-sm text-gray-600 mt-1 font-medium leading-relaxed">
                  {product.subtitle || product.description}
                </p>
              </div>

              {/* Volume Discount Ladder */}
              {displayPrices && (
                <div className="my-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase text-gray-700 tracking-wider">
                      Tiered B2B Wholesale Pricing
                    </span>
                    <span className="text-[11px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                      Automatic Volume Discount Applied
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3 p-4 bg-neutral-50 rounded-xl border border-gray-200 text-center">
                    <div className={`p-2.5 rounded-lg border transition-all ${
                      totalQuantity < product.packQuantity 
                        ? 'bg-white border-black shadow-sm font-bold' 
                        : 'bg-white/50 border-gray-200 text-gray-500'
                    }`}>
                      <p className="text-[10px] uppercase font-bold text-gray-400">Unit Rate (&lt; {product.packQuantity} pcs)</p>
                      <p className="text-lg font-mono font-black text-gray-900 mt-0.5">{product.priceUnit.toFixed(2)} €</p>
                      <span className="text-[10px] text-gray-400">per piece</span>
                    </div>

                    <div className={`p-2.5 rounded-lg border transition-all ${
                      totalQuantity >= product.packQuantity && totalQuantity < product.boxQuantity 
                        ? 'bg-white border-blue-600 ring-1 ring-blue-600 shadow-sm font-bold' 
                        : 'bg-white/50 border-gray-200 text-gray-500'
                    }`}>
                      <p className="text-[10px] uppercase font-bold text-blue-600">Pack Rate (≥ {product.packQuantity} pcs)</p>
                      <p className="text-lg font-mono font-black text-blue-700 mt-0.5">{product.pricePack.toFixed(2)} €</p>
                      <span className="text-[10px] text-blue-600 font-semibold">-15% Savings</span>
                    </div>

                    <div className={`p-2.5 rounded-lg border transition-all ${
                      totalQuantity >= product.boxQuantity 
                        ? 'bg-white border-emerald-600 ring-1 ring-emerald-600 shadow-sm font-bold' 
                        : 'bg-white/50 border-gray-200 text-gray-500'
                    }`}>
                      <p className="text-[10px] uppercase font-bold text-emerald-600">Box Rate (≥ {product.boxQuantity} pcs)</p>
                      <p className="text-lg font-mono font-black text-emerald-700 mt-0.5">{product.priceBox.toFixed(2)} €</p>
                      <span className="text-[10px] text-emerald-600 font-semibold">Max Wholesale Rate</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Order Matrix Box */}
              <div className="my-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: selectedColor.hex }} />
                    <span className="text-xs font-bold text-gray-900 uppercase">
                      Stock for {selectedColor.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1.5 text-xs font-semibold">
                    <span className="text-gray-400 text-[11px]">Quick Order:</span>
                    <button
                      onClick={() => handleQuickFill('pack')}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-2 py-1 rounded text-[11px] font-bold cursor-pointer"
                    >
                      +1 Pack ({product.packQuantity} pcs)
                    </button>
                    <button
                      onClick={() => handleQuickFill('box')}
                      className="bg-black text-white hover:bg-neutral-800 px-2 py-1 rounded text-[11px] font-bold cursor-pointer"
                    >
                      +1 Box ({product.boxQuantity} pcs)
                    </button>
                    <button
                      onClick={() => handleQuickFill('pallet')}
                      className="bg-amber-500 text-black hover:bg-amber-400 px-2 py-1 rounded text-[11px] font-bold cursor-pointer hidden sm:inline-block"
                    >
                      +1 Pallet ({product.boxQuantity * 24} pcs)
                    </button>
                  </div>
                </div>

                {/* Size Grid Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-2.5 p-3 bg-neutral-100/60 rounded-xl border border-gray-200">
                  {product.sizes.map((size) => {
                    const stockCount = colorStockMap[size] ?? 750;
                    const isLow = stockCount < 100;
                    return (
                      <div key={size} className="bg-white p-2.5 rounded-lg border border-gray-200 shadow-2xs flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-xs text-gray-900">{size}</span>
                          <span className={`text-[10px] font-mono font-bold ${isLow ? 'text-amber-600' : 'text-emerald-700'}`}>
                            {stockCount} in hub
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <input
                            type="number"
                            min="0"
                            max={stockCount}
                            placeholder="0"
                            value={quantities[size] || ''}
                            onChange={(e) => handleQtyChange(size, e.target.value)}
                            className="w-full bg-neutral-50 border border-gray-300 rounded px-2 py-1.5 text-xs text-center font-black font-mono focus:bg-white focus:border-black outline-none"
                          />
                          <span className="text-[10px] text-gray-400">pcs</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Subtotal & Add to Order Bar */}
              <div className="p-5 bg-neutral-950 text-white rounded-xl space-y-4 shadow-lg">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs border-b border-neutral-800 pb-3">
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-neutral-400">Total Units: </span>
                      <strong className="text-white font-mono text-sm">{totalQuantity} pcs</strong>
                    </div>
                    <div>
                      <span className="text-neutral-400">Applied Rate: </span>
                      <strong className="text-yellow-400 font-mono text-sm">{currentUnitPrice.toFixed(2)} € /pc</strong>
                    </div>
                  </div>
                  <div className="text-neutral-400 text-[11px]">
                    Estimated Carton Weight: <strong>{((totalQuantity / product.boxQuantity) * 16.5).toFixed(1)} kg</strong>
                  </div>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] text-neutral-400 uppercase tracking-wider font-semibold">Net Total Amount</p>
                    <p className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {totalPrice.toFixed(2)} €
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      + 21% VAT ({(totalPrice * 0.21).toFixed(2)} €) = <strong className="text-gray-200 font-mono">{(totalPrice * 1.21).toFixed(2)} € incl. Tax</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleAddSelectionToCart}
                      className="px-6 sm:px-8 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-md flex items-center space-x-2 transition-all cursor-pointer transform active:scale-95"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>ADD TO B2B BASKET</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* COMPREHENSIVE ROLY VARIATIONS MENU & TABS ACCORDION */}
        {/* ======================================================== */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden mt-10">
          
          {/* Navigation Bar for Product Variations Menu */}
          <div className="flex border-b border-gray-200 overflow-x-auto no-scrollbar bg-neutral-50/70 text-xs font-bold">
            <button
              onClick={() => setActiveMenuTab('matrix')}
              className={`px-5 py-3.5 flex items-center space-x-2 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeMenuTab === 'matrix' ? 'border-black text-black bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Package className="w-4 h-4 text-neutral-700" />
              <span>Full Color & Size Stock Matrix</span>
            </button>

            <button
              onClick={() => setActiveMenuTab('technical')}
              className={`px-5 py-3.5 flex items-center space-x-2 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeMenuTab === 'technical' ? 'border-black text-black bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <FileCheck className="w-4 h-4 text-emerald-600" />
              <span>Technical Data Sheet (Ficha Técnica)</span>
            </button>

            <button
              onClick={() => setActiveMenuTab('packaging')}
              className={`px-5 py-3.5 flex items-center space-x-2 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeMenuTab === 'packaging' ? 'border-black text-black bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Box className="w-4 h-4 text-blue-600" />
              <span>Packaging & Logistics Measurements</span>
            </button>

            <button
              onClick={() => setActiveMenuTab('customization')}
              className={`px-5 py-3.5 flex items-center space-x-2 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeMenuTab === 'customization' ? 'border-black text-black bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Scissors className="w-4 h-4 text-amber-500" />
              <span>Printing Techniques & Max Placement</span>
            </button>

            <button
              onClick={() => setActiveMenuTab('downloads')}
              className={`px-5 py-3.5 flex items-center space-x-2 whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
                activeMenuTab === 'downloads' ? 'border-black text-black bg-white' : 'border-transparent text-gray-500 hover:text-gray-900'
              }`}
            >
              <Download className="w-4 h-4 text-purple-600" />
              <span>Downloads & Vector Mockups</span>
            </button>
          </div>

          {/* TAB CONTENT 1: FULL COLOR & SIZE STOCK MATRIX */}
          {activeMenuTab === 'matrix' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Alicante Central Warehouse Live Matrix</h3>
                  <p className="text-xs text-gray-500">Real-time unit availability breakdown across all catalogue colors and sizes.</p>
                </div>
                <div className="flex items-center space-x-3 text-xs">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> &gt; 500 pcs High Stock
                  </span>
                  <span className="flex items-center gap-1.5 text-amber-600 font-bold">
                    <span className="w-2 h-2 rounded-full bg-amber-500" /> &lt; 200 pcs Limited
                  </span>
                </div>
              </div>

              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-neutral-900 text-white font-bold">
                      <th className="py-3 px-4">Color Shade</th>
                      <th className="py-3 px-3">Code</th>
                      {product.sizes.map((s) => (
                        <th key={s} className="py-3 px-3 text-center">{s}</th>
                      ))}
                      <th className="py-3 px-4 text-right">Total In Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {product.colors.map((c) => {
                      const stockObj = product.stockMatrix[c.name] || {};
                      const rowTotal = Object.values(stockObj).reduce((a, b) => Number(a) + Number(b), 0);
                      return (
                        <tr key={c.code} className="hover:bg-neutral-50">
                          <td className="py-3 px-4 font-bold flex items-center space-x-2">
                            <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: c.hex }} />
                            <span>{c.name}</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-gray-500 font-bold">{c.code}</td>
                          {product.sizes.map((s) => {
                            const count = stockObj[s] ?? 0;
                            return (
                              <td key={s} className="py-3 px-3 text-center font-mono">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                                  count > 500 ? 'bg-emerald-50 text-emerald-800' : count > 0 ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-700'
                                }`}>
                                  {count}
                                </span>
                              </td>
                            );
                          })}
                          <td className="py-3 px-4 text-right font-mono font-black text-gray-900">
                            {rowTotal.toLocaleString()} pcs
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: TECHNICAL DATA SHEET (FICHA TÉCNICA) */}
          {activeMenuTab === 'technical' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    Fabric Construction & Composition
                  </h3>
                  
                  <div className="bg-neutral-50 p-4 rounded-xl border border-gray-200 text-xs space-y-3">
                    <div className="flex justify-between py-1.5 border-b border-gray-200">
                      <span className="text-gray-500">Fabric Composition:</span>
                      <strong className="text-gray-900 text-right">{product.composition}</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-200">
                      <span className="text-gray-500">Grammage / Fabric Weight:</span>
                      <strong className="text-gray-900">{product.weightGsm} g/m²</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-200">
                      <span className="text-gray-500">Weave / Knit Structure:</span>
                      <strong className="text-gray-900">Single Jersey 24/1 Combed Ring-Spun</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-200">
                      <span className="text-gray-500">Collar Construction:</span>
                      <strong className="text-gray-900">4-layer ribbed 1x1 elastane collar</strong>
                    </div>
                    <div className="flex justify-between py-1.5 border-b border-gray-200">
                      <span className="text-gray-500">Body Cut:</span>
                      <strong className="text-gray-900">Tubular seamless torso</strong>
                    </div>
                    <div className="flex justify-between py-1.5">
                      <span className="text-gray-500">Labeling:</span>
                      <strong className="text-emerald-700">Removable Roly Tear-Away Label</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-start space-x-3 text-xs">
                    <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-900">OEKO-TEX® Standard 100 Certified (Class I/II)</p>
                      <p className="text-emerald-800 text-[11px] mt-0.5">
                        Tested for harmful substances and guaranteed safe for human ecological health. Certificate Nº 2012OK0645 AITEX.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right: Wash Care & Dimensions */}
                <div className="space-y-4">
                  <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-blue-600" />
                    Garment Care & Wash Guide
                  </h3>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-neutral-50 border border-gray-200 rounded-lg text-center">
                      <span className="font-bold text-gray-900 block">Machine Wash 40°C</span>
                      <span className="text-[11px] text-gray-500">Normal cycle</span>
                    </div>
                    <div className="p-3 bg-neutral-50 border border-gray-200 rounded-lg text-center">
                      <span className="font-bold text-gray-900 block">Do Not Bleach</span>
                      <span className="text-[11px] text-gray-500">Chlorine-free only</span>
                    </div>
                    <div className="p-3 bg-neutral-50 border border-gray-200 rounded-lg text-center">
                      <span className="font-bold text-gray-900 block">Iron Medium 150°C</span>
                      <span className="text-[11px] text-gray-500">Inside-out on prints</span>
                    </div>
                    <div className="p-3 bg-neutral-50 border border-gray-200 rounded-lg text-center">
                      <span className="font-bold text-gray-900 block">Do Not Tumble Dry</span>
                      <span className="text-[11px] text-gray-500">Hang dry recommended</span>
                    </div>
                  </div>

                  {/* Size Measurement Chart Width / Length */}
                  <div className="pt-2">
                    <h4 className="font-bold text-xs text-gray-900 mb-2 uppercase tracking-wide">
                      Garment Measurements (Width A / Length B in cm)
                    </h4>
                    <div className="overflow-x-auto border border-gray-200 rounded-lg">
                      <table className="w-full text-center text-xs">
                        <thead className="bg-gray-100 font-bold">
                          <tr>
                            <th className="py-2 px-3 text-left">Dimension</th>
                            {product.sizes.map(s => <th key={s} className="py-2 px-2">{s}</th>)}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 font-mono">
                          <tr>
                            <td className="py-2 px-3 text-left font-sans font-semibold text-gray-700">Width A (Chest)</td>
                            <td className="py-2">48 cm</td>
                            <td className="py-2">51 cm</td>
                            <td className="py-2">54 cm</td>
                            <td className="py-2">57 cm</td>
                            <td className="py-2">60 cm</td>
                            {product.sizes.length > 5 && <td className="py-2">63 cm</td>}
                          </tr>
                          <tr>
                            <td className="py-2 px-3 text-left font-sans font-semibold text-gray-700">Length B (Body)</td>
                            <td className="py-2">69 cm</td>
                            <td className="py-2">71 cm</td>
                            <td className="py-2">73 cm</td>
                            <td className="py-2">75 cm</td>
                            <td className="py-2">77 cm</td>
                            {product.sizes.length > 5 && <td className="py-2">79 cm</td>}
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          )}

          {/* TAB CONTENT 3: PACKAGING & LOGISTICS */}
          {activeMenuTab === 'packaging' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Carton Packaging & Palletization Standards</h3>
                <p className="text-xs text-gray-500">Gor Factory S.A. certified export container and master carton specifications.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-neutral-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-500 uppercase font-semibold text-[10px]">Pack Unit</span>
                  <p className="text-2xl font-black font-mono text-gray-900 mt-1">{product.packQuantity} pcs</p>
                  <span className="text-[11px] text-gray-500">Folded & polybagged</span>
                </div>

                <div className="p-4 bg-neutral-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-500 uppercase font-semibold text-[10px]">Master Box Unit</span>
                  <p className="text-2xl font-black font-mono text-blue-700 mt-1">{product.boxQuantity} pcs</p>
                  <span className="text-[11px] text-gray-500">{product.boxQuantity / product.packQuantity} individual packs</span>
                </div>

                <div className="p-4 bg-neutral-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-500 uppercase font-semibold text-[10px]">Carton Gross Weight</span>
                  <p className="text-2xl font-black font-mono text-gray-900 mt-1">16.50 kg</p>
                  <span className="text-[11px] text-gray-500">Net: 15.20 kg</span>
                </div>

                <div className="p-4 bg-neutral-50 border border-gray-200 rounded-xl">
                  <span className="text-gray-500 uppercase font-semibold text-[10px]">European Pallet Capacity</span>
                  <p className="text-2xl font-black font-mono text-emerald-700 mt-1">2,400 pcs</p>
                  <span className="text-[11px] text-emerald-600 font-semibold">24 Boxes / Pallet</span>
                </div>
              </div>

              <div className="bg-neutral-900 text-white p-5 rounded-xl text-xs space-y-2 font-mono">
                <p className="font-bold text-yellow-400 font-sans">GOR FACTORY LOGISTICS HUB (ALICANTE, SPAIN)</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-gray-300 pt-2 border-t border-neutral-800">
                  <div>Master Box Dimensions: <strong>{product.cartonDimensions}</strong></div>
                  <div>Pallet Height: <strong>1.85 m</strong></div>
                  <div>Commodity Code (TARIC): <strong>61091000</strong></div>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 4: PRINTING TECHNIQUES */}
          {activeMenuTab === 'customization' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-gray-900">Recommended Personalization Techniques</h3>
                  <p className="text-xs text-gray-500">Optimal commercial printing and branding methods certified for model {product.modelCode}.</p>
                </div>

                <button
                  onClick={() => setActivePage('customizer')}
                  className="px-5 py-2.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider rounded-lg flex items-center space-x-2 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>Launch Customizer Studio</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2 hover:border-black transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold">
                    <Printer className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Screen Printing (Serigrafía)</h4>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    Ideal for high-volume orders up to 6 spot PMS colors. Smooth cotton surface ensures crisp reproduction.
                  </p>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded block w-fit">
                    Max Area: 35 x 45 cm
                  </span>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2 hover:border-black transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Embroidery (Bordado)</h4>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    Premium textured thread finish. High fabric weight prevents puckering on left chest emblems.
                  </p>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded block w-fit">
                    Max Area: 10 x 10 cm
                  </span>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2 hover:border-black transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                    <Palette className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">DTF & Digital Transfer</h4>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    Full-color photographic gradients with sharp outlines and flexible stretch adhesion.
                  </p>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded block w-fit">
                    Max Area: 30 x 40 cm
                  </span>
                </div>

                <div className="p-4 bg-white border border-gray-200 rounded-xl space-y-2 hover:border-black transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Flame className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-900">Direct-To-Garment (DTG)</h4>
                  <p className="text-gray-600 text-[11px] leading-relaxed">
                    Water-based CMYK eco inks directly infused into single jersey combed cotton fibers.
                  </p>
                  <span className="text-[10px] font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded block w-fit">
                    Max Area: 35 x 45 cm
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB CONTENT 5: DOWNLOADS & VECTOR TEMPLATES */}
          {activeMenuTab === 'downloads' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900">Model Assets, Lookbooks & Vector Files</h3>
                <p className="text-xs text-gray-500">Download official high-resolution marketing and technical collateral for model {product.modelCode}.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                
                <div className="p-4 bg-neutral-50 border border-gray-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-red-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900">Technical Sheet (PDF)</h4>
                      <span className="text-[11px] text-gray-500 font-mono">1.2 MB • English / Spanish</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`Downloaded ${product.modelCode}_technical_sheet.pdf`, 'success')}
                    className="p-2 bg-black hover:bg-neutral-800 text-white rounded-lg cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 bg-neutral-50 border border-gray-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Sliders className="w-6 h-6 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900">Vector Mockups (EPS/SVG)</h4>
                      <span className="text-[11px] text-gray-500 font-mono">3.4 MB • Front / Back Outlines</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast(`Downloaded ${product.modelCode}_vector_mockup.zip`, 'success')}
                    className="p-2 bg-black hover:bg-neutral-800 text-white rounded-lg cursor-pointer"
                    title="Download Vectors"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 bg-neutral-50 border border-gray-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
                    <div>
                      <h4 className="font-bold text-gray-900">Oeko-Tex Standard 100</h4>
                      <span className="text-[11px] text-gray-500 font-mono">820 KB • Certificate PDF</span>
                    </div>
                  </div>
                  <button
                    onClick={() => showToast('Downloaded Oeko-Tex Standard 100 Certificate', 'success')}
                    className="p-2 bg-black hover:bg-neutral-800 text-white rounded-lg cursor-pointer"
                    title="Download Certificate"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Related Collection Models */}
        {relatedModels.length > 0 && (
          <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Collection Duo & Cross-Sell</span>
                <h3 className="text-xl font-black text-gray-900 uppercase">Complementary Collection Garments</h3>
              </div>
              <button
                onClick={() => navigateToCategory(product.categorySlug)}
                className="text-xs font-bold text-black hover:underline"
              >
                View all {product.category} →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedModels.map((rel) => (
                <div
                  key={rel.id}
                  onClick={() => navigateToProduct(rel.modelCode)}
                  className="bg-white rounded-xl border border-gray-200 p-3 hover:border-black transition-all cursor-pointer group"
                >
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2 relative">
                    <img src={rel.images[0]} alt={rel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                      {rel.modelCode}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 group-hover:text-red-600 truncate">{rel.name}</h4>
                  <p className="text-[11px] text-gray-500 truncate">{rel.subtitle}</p>
                  <div className="mt-2 flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-gray-900">{rel.priceBox.toFixed(2)} €</span>
                    <span className="text-[10px] text-gray-400">{rel.colors.length} colors</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
