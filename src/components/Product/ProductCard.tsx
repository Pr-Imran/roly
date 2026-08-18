import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Star, ShieldCheck, Sparkles, Layers, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { displayPrices, favorites, toggleFavorite, navigateToProduct } = useStore();
  const isFav = favorites.includes(product.modelCode);
  const [activeColor, setActiveColor] = useState(product.colors[0]);

  return (
    <div
      onClick={() => navigateToProduct(product.modelCode)}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl hover:border-black transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image & Badges */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.modelCode);
          }}
          className="absolute top-2.5 right-2.5 p-1.5 bg-white/90 hover:bg-white rounded-full shadow-xs text-gray-700 hover:text-black transition-all cursor-pointer z-10"
          title="Add to favourites"
        >
          <Star className={`w-4 h-4 ${isFav ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
        </button>

        {/* Authentic Roly Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          <span className="bg-black text-white text-[10px] font-mono font-black px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
            {product.modelCode}
          </span>
          {product.isEco && (
            <span className="bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs">
              ORGANIC ECO
            </span>
          )}
          {product.isHighVis && (
            <span className="bg-yellow-400 text-black text-[9px] font-black px-1.5 py-0.5 rounded-xs shadow-xs">
              EN20471 CLASS 2
            </span>
          )}
          {product.isWorkwear && !product.isHighVis && (
            <span className="bg-neutral-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs">
              ROLY WRK
            </span>
          )}
        </div>

        {/* Weight GSM tag */}
        <div className="absolute bottom-2.5 right-2.5 bg-neutral-900/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-xs shadow-xs">
          {product.weightGsm} g/m²
        </div>

        {/* Vendor tag if multi-vendor */}
        {product.vendorName && (
          <div className="absolute bottom-2.5 left-2.5 bg-purple-700/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs shadow-xs">
            {product.vendorName}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
            <span className="font-semibold uppercase text-[10px] tracking-wider">{product.gender}</span>
            <span className="text-gray-500 font-mono text-[11px]">{product.colors.length} shades</span>
          </div>

          <h3 className="font-black text-sm text-gray-900 group-hover:text-red-600 transition-colors uppercase tracking-tight line-clamp-1">
            {product.name}
          </h3>

          <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 leading-relaxed font-normal">
            {product.subtitle || product.description}
          </p>

          {/* Interactive Color Variation Swatches */}
          <div className="mt-3 pt-2.5 border-t border-gray-100">
            <div className="flex items-center justify-between text-[10px] text-gray-500 mb-1.5">
              <span>Shade: <strong className="text-gray-800 font-semibold">{activeColor.name}</strong></span>
            </div>
            <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
              {product.colors.slice(0, 7).map((c, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveColor(c);
                  }}
                  onMouseEnter={() => setActiveColor(c)}
                  className={`w-4 h-4 rounded-full border transition-all cursor-pointer shrink-0 ${
                    activeColor.code === c.code ? 'border-black ring-2 ring-black/30 scale-110' : 'border-gray-300 hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
              {product.colors.length > 7 && (
                <span className="text-[10px] font-bold text-gray-400 pl-0.5">+{product.colors.length - 7}</span>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-end justify-between">
          <div>
            {displayPrices ? (
              <div>
                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">From Box Tier</p>
                <p className="text-base font-black text-gray-900 font-mono">
                  {product.priceBox.toFixed(2)} € <span className="text-[10px] text-gray-500 font-normal">/pc</span>
                </p>
              </div>
            ) : (
              <span className="text-xs font-semibold text-neutral-800">Login for Price</span>
            )}
          </div>

          <span className="text-xs font-black uppercase text-black group-hover:text-red-600 transition-colors flex items-center gap-1">
            Order Matrix →
          </span>
        </div>
      </div>
    </div>
  );
};
