import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { CATEGORIES } from '../data/mockProducts';
import { 
  Search, 
  Star, 
  ShoppingBag, 
  User, 
  Globe, 
  ChevronDown, 
  Check, 
  HelpCircle, 
  Shield, 
  Sparkles, 
  X,
  ArrowRight,
  Package,
  Layers,
  Flame,
  Award
} from 'lucide-react';
import { Language } from '../types';

export const Header: React.FC = () => {
  const {
    activePage,
    setActivePage,
    clientProfile,
    displayPrices,
    setDisplayPrices,
    language,
    setLanguage,
    searchQuery,
    setSearchQuery,
    cartTotal,
    cartItemCount,
    favorites,
    setShowSalesRepModal,
    setShowDbSetupModal,
    navigateToProduct,
    navigateToCategory,
    products,
    siteSettings
  } = useStore();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const menuTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnterCategory = (slug: string) => {
    if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
    setHoveredCategory(slug);
  };

  const handleMouseLeaveNav = () => {
    menuTimeoutRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 250);
  };

  const filteredProducts = searchQuery.trim().length > 1
    ? products.filter(
        p =>
          p.modelCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'EN', label: 'English', flag: '🇬🇧' },
    { code: 'ES', label: 'Español', flag: '🇪🇸' },
    { code: 'FR', label: 'Français', flag: '🇫🇷' },
    { code: 'DE', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'IT', label: 'Italiano', flag: '🇮🇹' },
    { code: 'PT', label: 'Português', flag: '🇵🇹' },
  ];

  // Rich subcategories for Mega Menu
  const categorySubTree: Record<string, { label: string; items: { name: string; filter?: string; modelCode?: string }[] }[]> = {
    't_shirts': [
      {
        label: 'T-Shirts (Camisetas)',
        items: [
          { name: 'Short Sleeve T-Shirts', modelCode: 'CA6681' },
          { name: 'Long Sleeve T-Shirts', modelCode: 'CA6554' },
          { name: 'Tank Tops & Sleeveless' },
          { name: 'Heavy & Organic Cotton', modelCode: 'CA6502' },
          { name: 'Sublimation Ready T-Shirts' }
        ]
      },
      {
        label: 'Polo Shirts (Polos)',
        items: [
          { name: 'Short Sleeve Pique Polos', modelCode: 'PO6638' },
          { name: 'Long Sleeve Polos', modelCode: 'PO6609' },
          { name: 'Technical Sports Polos' },
          { name: 'Duo Concept Women/Men' }
        ]
      },
      {
        label: 'Flagship Models',
        items: [
          { name: 'Atomic 150 (CA6681)', modelCode: 'CA6681' },
          { name: 'Beagle 155 (CA6554)', modelCode: 'CA6554' },
          { name: 'Star Pique (PO6638)', modelCode: 'PO6638' },
          { name: 'Pegaso Premium (PO6609)', modelCode: 'PO6609' }
        ]
      }
    ],
    'swe': [
      {
        label: 'Sweaters & Hoodies',
        items: [
          { name: 'Classic Crewneck Sweaters', modelCode: 'SW1085' },
          { name: 'Kangaroo Pocket Hoodies', modelCode: 'SW1087' },
          { name: 'Full-Zip Hooded Sweatshirts' },
          { name: 'Two-Tone Contrast Hoodies' }
        ]
      },
      {
        label: 'Fleeces & Softshell',
        items: [
          { name: 'Polar Fleeces (Pirineo)' },
          { name: 'Microfleece Jackets' },
          { name: '3-Layer Softshell Jackets', modelCode: 'SS5064' },
          { name: 'Windproof Bonded Vests' }
        ]
      },
      {
        label: 'Popular Models',
        items: [
          { name: 'Caprice Crewneck (SW1085)', modelCode: 'SW1085' },
          { name: 'Urban Hoodie (SW1087)', modelCode: 'SW1087' },
          { name: 'Siberia Softshell (SS5064)', modelCode: 'SS5064' }
        ]
      }
    ],
    'coats': [
      {
        label: 'Outerwear & Jackets',
        items: [
          { name: 'Padded Winter Parkas', modelCode: 'CH5064' },
          { name: 'Technical Windbreakers' },
          { name: 'Waterproof Raincoats' },
          { name: 'Quilted Bodywarmers & Vests' }
        ]
      },
      {
        label: 'Protective Outerwear',
        items: [
          { name: 'Thermal Insulation Coats' },
          { name: 'Breathable Membrane Shells' },
          { name: 'Reversible Puffer Jackets' }
        ]
      }
    ],
    'sh_pant': [
      {
        label: 'Trousers & Shorts',
        items: [
          { name: 'Casual Chinos & Cargo Pants', modelCode: 'PA8400' },
          { name: 'Sports Bermudas & Shorts' },
          { name: 'Joggers & Tracksuit Bottoms' },
          { name: 'Compression Sport Leggings' }
        ]
      },
      {
        label: 'Work Trousers',
        items: [
          { name: 'Daily Multi-Pocket Pants', modelCode: 'PA8400' },
          { name: 'Reinforced Cordura Kneepads' },
          { name: 'Elastic Stretch Workpants' }
        ]
      }
    ],
    'sports': [
      {
        label: 'Roly Sport Technical',
        items: [
          { name: 'Breathable Running Tees', modelCode: 'CA6654' },
          { name: 'Team Sports Kits (Football/Basketball)' },
          { name: 'Training Tracksuits' },
          { name: 'Control-Dry Pique Apparel' }
        ]
      },
      {
        label: 'Sports Accessories',
        items: [
          { name: 'Training Bibs & Markers' },
          { name: 'Sports Bags & Shoe Bags' },
          { name: 'Technical Wristbands & Towels' }
        ]
      }
    ],
    'workwear': [
      {
        label: 'High Visibility EN ISO 20471',
        items: [
          { name: 'Polaris High-Vis Polo', modelCode: 'HV9300' },
          { name: 'High-Vis Safety Vests (Sirio)' },
          { name: 'High-Vis Fleece & Softshell' },
          { name: 'Class 1, 2 & 3 Certified Apparel' }
        ]
      },
      {
        label: 'Industry Sectors',
        items: [
          { name: 'HORECA & Hospitality Uniforms' },
          { name: 'Healthcare & Sanitary Scrubs' },
          { name: 'Food Industry Cleanroom Wear' },
          { name: 'Flame-Retardant & Antistatic' }
        ]
      },
      {
        label: 'Top WRK Models',
        items: [
          { name: 'Polaris High-Vis (HV9300)', modelCode: 'HV9300' },
          { name: 'Daily HV Workpants (PA8400)', modelCode: 'PA8400' },
          { name: 'Almanzor Multi-Pocket Vest' }
        ]
      }
    ],
    'rolyeco': [
      {
        label: 'Roly Eco Sustainable',
        items: [
          { name: '100% Organic GOTS Cotton T-Shirts', modelCode: 'CA6681' },
          { name: 'Recycled PET Polyester Garments' },
          { name: 'Eco-Friendly Sublimation Series' },
          { name: 'Oeko-Tex Standard 100 Class I' }
        ]
      }
    ],
    'other_products': [
      {
        label: 'Accessories & Headwear',
        items: [
          { name: 'Baseball Caps (5 & 6 Panels)' },
          { name: 'Winter Beanies & Neck Warmers' },
          { name: 'Drawstring Bags & Backpacks' },
          { name: 'Chef & Kitchen Aprons' },
          { name: 'Microfiber & Cotton Towels' }
        ]
      }
    ],
    'footwear': [
      {
        label: 'Footwear Collection',
        items: [
          { name: 'Casual Sneakers & Urban Shoes' },
          { name: 'Medical & Hospital Clogs' },
          { name: 'Beach Flip-Flops & Slides' },
          { name: 'Safety Steel-Toe Work Shoes' }
        ]
      }
    ]
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      
      {/* Top Black Bar */}
      <div className="bg-black text-white text-xs px-4 sm:px-8 py-2 flex flex-wrap items-center justify-between">
        
        {/* Left: User greeting & Gor Factory identifier */}
        <div className="flex items-center space-x-3">
          <span className="font-semibold text-gray-200 tracking-wide">
            Hi <span className="text-white font-bold">{clientProfile.name}</span>
          </span>
          <span className="hidden sm:inline text-gray-500">|</span>
          <button
            onClick={() => setActivePage('client_area')}
            className="hidden sm:inline-flex items-center text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            Client Area
          </button>
          <span className="hidden md:inline-block px-2 py-0.5 text-[10px] bg-neutral-800 text-yellow-400 rounded-sm font-medium border border-neutral-700">
            {clientProfile.discountTier}
          </span>
        </div>

        {/* Right side: Stamina badge, Display Prices, Language, Sales Rep, User Account */}
        <div className="flex items-center space-x-4 sm:space-x-6 text-gray-300">
          
          {/* Stamina Power Ideas logo */}
          <div className="hidden lg:flex items-center space-x-1 font-bold text-gray-400 hover:text-white transition-colors cursor-pointer">
            <span className="italic tracking-tighter text-sm font-black text-white">Stamina</span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Power Ideas</span>
          </div>

          {/* Display Prices Checkbox */}
          <label className="flex items-center space-x-1.5 cursor-pointer select-none text-xs hover:text-white">
            <input
              type="checkbox"
              checked={displayPrices}
              onChange={(e) => setDisplayPrices(e.target.checked)}
              className="w-3.5 h-3.5 rounded-xs accent-white bg-neutral-800 border-neutral-600 cursor-pointer"
            />
            <span className="text-gray-300 flex items-center gap-1">
              <Check className={`w-3 h-3 ${displayPrices ? 'text-white' : 'text-transparent'}`} />
              Display Prices
            </span>
          </label>

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center space-x-1 text-gray-200 hover:text-white transition-colors cursor-pointer py-1"
            >
              <span>{languages.find((l) => l.code === language)?.flag}</span>
              <span className="font-semibold">{language}</span>
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white text-gray-800 rounded-md shadow-lg border border-gray-100 py-1 z-50">
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setIsLangOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-gray-50 transition-colors ${
                      language === l.code ? 'font-bold text-black bg-gray-50' : 'text-gray-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </span>
                    {language === l.code && <Check className="w-3 h-3 text-black" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sales Representative */}
          <button
            onClick={() => setShowSalesRepModal(true)}
            className="hidden md:flex items-center space-x-1 hover:text-white transition-colors cursor-pointer text-xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
            <span>Sales Representative</span>
          </button>

          {/* Admin & DB Setup quick link */}
          <button
            onClick={() => setShowDbSetupModal(true)}
            className="hidden xl:inline-flex items-center gap-1 text-[11px] text-sky-400 hover:text-sky-300 font-mono"
            title="Configure MySQL Database"
          >
            <Shield className="w-3 h-3" />
            MySQL Setup
          </button>

          {/* User Account Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center space-x-1 text-gray-200 hover:text-white transition-colors cursor-pointer p-1 rounded-full hover:bg-neutral-800"
            >
              <User className="w-4 h-4" />
              <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-md shadow-xl border border-gray-100 py-2 z-50 text-xs">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="font-bold text-gray-900">{clientProfile.company}</p>
                  <p className="text-gray-500 text-[11px]">NIF: {clientProfile.vatNumber}</p>
                  <p className="text-emerald-600 font-medium text-[11px] mt-0.5">Credit: {clientProfile.availableCredit.toFixed(2)} €</p>
                </div>
                <button
                  onClick={() => {
                    setActivePage('client_area');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between"
                >
                  <span>Client Area & Invoices</span>
                  <span className="text-[10px] bg-black text-white px-1.5 py-0.5 rounded-sm font-bold">B2B</span>
                </button>
                <button
                  onClick={() => {
                    setActivePage('admin');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between text-indigo-700 font-semibold"
                >
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Admin Control Panel
                  </span>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded-sm">Manager</span>
                </button>
                <button
                  onClick={() => {
                    setShowDbSetupModal(true);
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-gray-700"
                >
                  MySQL Database Setup Wizard
                </button>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    setActivePage('home');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 text-red-600"
                >
                  Switch Account / Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar: Logo, Search, Favourites, Cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo ROLY */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActivePage('home')}
            className="flex items-baseline text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-3xl sm:text-4xl font-black tracking-tighter text-black uppercase font-sans">
              {siteSettings?.siteName || 'ROLY'}
            </span>
            <span className="text-xs font-bold text-red-600 ml-0.5">®</span>
          </button>
        </div>

        {/* Big Search Bar */}
        <div ref={searchRef} className="relative flex-1 max-w-2xl hidden md:block">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search by model (e.g. CA6681, PO6638, HV9300), fabric, or category..."
              className="w-full bg-[#f4f4f4] border border-transparent focus:border-gray-400 focus:bg-white text-gray-800 text-sm rounded-full pl-5 pr-12 py-2.5 outline-none transition-all placeholder:text-gray-400 font-medium"
            />
            <button
              onClick={() => {
                if (filteredProducts.length > 0) {
                  navigateToProduct(filteredProducts[0].modelCode);
                  setIsSearchFocused(false);
                }
              }}
              className="absolute right-3.5 text-gray-500 hover:text-black transition-colors cursor-pointer"
            >
              <Search className="w-5 h-5" />
            </button>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-10 text-gray-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isSearchFocused && searchQuery.trim().length > 1 && (
            <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-50 divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {filteredProducts.length > 0 ? (
                <>
                  <div className="p-3 bg-gray-50 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Matching Products ({filteredProducts.length})
                  </div>
                  {filteredProducts.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => {
                        navigateToProduct(product.modelCode);
                        setIsSearchFocused(false);
                        setSearchQuery('');
                      }}
                      className="w-full p-3.5 text-left hover:bg-gray-50 flex items-center justify-between transition-colors group cursor-pointer"
                    >
                      <div className="flex items-center space-x-3.5">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                        />
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-black text-sm text-black group-hover:text-red-600 transition-colors uppercase">
                              {product.name}
                            </span>
                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded font-mono font-bold">
                              {product.modelCode}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{product.subtitle}</p>
                          <span className="text-[11px] text-gray-400">{product.category} • {product.weightGsm} g/m²</span>
                        </div>
                      </div>
                      <div className="text-right">
                        {displayPrices && (
                          <div className="text-sm font-black text-gray-900 font-mono">
                            from {product.priceBox.toFixed(2)} €
                          </div>
                        )}
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 font-bold px-1.5 py-0.5 rounded">In Stock</span>
                      </div>
                    </button>
                  ))}
                </>
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No products found for "{searchQuery}". Try "ATOMIC", "POLO", "CA6681" or "WRK".
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right actions: Favourites, Cart, Admin Switcher */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Favourites Star */}
          <button
            onClick={() => setActivePage('client_area')}
            className="flex items-center text-gray-800 hover:text-black p-2 rounded-full hover:bg-gray-100 transition-colors relative cursor-pointer"
            title="Favourites & Saved Orders"
          >
            <Star className="w-5 h-5 fill-black text-black" />
            {favorites.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-yellow-400 text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            onClick={() => setActivePage('cart')}
            className="flex items-center space-x-2 text-gray-900 hover:text-black p-2 sm:px-3 sm:py-2 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
          >
            {displayPrices && (
              <span className="font-bold text-sm hidden sm:inline font-mono">
                {cartTotal.toFixed(2)}€
              </span>
            )}
            <div className="relative">
              <ShoppingBag className="w-5 h-5 text-black" />
              <span className="absolute -top-1.5 -right-2 bg-black text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            </div>
          </button>

          {/* Admin Switcher Quick Button */}
          <button
            onClick={() => setActivePage(activePage === 'admin' ? 'client_area' : 'admin')}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-neutral-300 hover:border-black font-bold text-neutral-800 hover:text-black transition-colors cursor-pointer"
          >
            <Shield className="w-3.5 h-3.5 text-neutral-700" />
            <span>{activePage === 'admin' ? 'Exit Admin' : 'Admin ERP'}</span>
          </button>
        </div>
      </div>

      {/* Main Navigation Bar with Interactive Mega Menus */}
      <nav 
        onMouseLeave={handleMouseLeaveNav}
        className="border-t border-gray-100 bg-white relative"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between overflow-x-auto no-scrollbar text-xs font-bold text-gray-900 tracking-tight">
          
          {/* Main 9 Category Buttons */}
          <div className="flex items-center space-x-1 sm:space-x-4 py-2.5 whitespace-nowrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onMouseEnter={() => handleMouseEnterCategory(cat.slug)}
                onClick={() => {
                  navigateToCategory(cat.slug);
                  setHoveredCategory(null);
                }}
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer uppercase text-[11px] sm:text-xs font-black tracking-tight ${
                  hoveredCategory === cat.slug ? 'text-red-600 bg-neutral-50' : 'hover:text-red-600'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Right side special links */}
          <div className="flex items-center space-x-4 py-2.5 border-l border-gray-200 pl-4 whitespace-nowrap">
            <button
              onClick={() => setActivePage('customizer')}
              className="flex items-center space-x-1 text-gray-900 hover:text-red-600 font-bold uppercase text-[11px] cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Customizer Studio</span>
            </button>
            <button
              onClick={() => setActivePage('catalogs')}
              className="hover:text-red-600 font-bold uppercase text-[11px] text-gray-900 cursor-pointer"
            >
              Catalogue 2026
            </button>
            <button
              onClick={() => navigateToCategory('limited')}
              className="text-red-600 hover:text-red-700 font-black uppercase text-[11px] cursor-pointer"
            >
              Outlet
            </button>
          </div>
        </div>

        {/* MEGA MENU DROPDOWN PANEL */}
        {hoveredCategory && categorySubTree[hoveredCategory] && (
          <div 
            onMouseEnter={() => {
              if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
            }}
            onMouseLeave={handleMouseLeaveNav}
            className="absolute left-0 right-0 top-full bg-white border-b border-gray-200 shadow-2xl z-50 py-6 px-4 sm:px-8 animate-fadeIn"
          >
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Category Columns */}
              {categorySubTree[hoveredCategory].map((col, idx) => (
                <div key={idx} className="space-y-3">
                  <h4 className="font-black text-xs uppercase text-gray-900 tracking-wider pb-1.5 border-b border-gray-100">
                    {col.label}
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {col.items.map((item, itemIdx) => (
                      <li key={itemIdx}>
                        <button
                          onClick={() => {
                            if (item.modelCode) {
                              navigateToProduct(item.modelCode);
                            } else {
                              navigateToCategory(hoveredCategory);
                            }
                            setHoveredCategory(null);
                          }}
                          className="text-gray-600 hover:text-red-600 hover:font-bold transition-all text-left block w-full cursor-pointer"
                        >
                          {item.name}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Promo Banner Card inside Mega Menu */}
              <div className="bg-neutral-900 text-white rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase">
                    Central Logistics Hub
                  </span>
                  <h4 className="font-black text-sm uppercase mt-1">35,000,000+ Units Ready for Dispatch</h4>
                  <p className="text-xs text-gray-400 mt-1">Direct B2B wholesale pricing with tiered discounts.</p>
                </div>
                <button
                  onClick={() => {
                    navigateToCategory(hoveredCategory);
                    setHoveredCategory(null);
                  }}
                  className="mt-4 text-xs font-bold text-yellow-400 hover:text-white flex items-center space-x-1 cursor-pointer"
                >
                  <span>View All in Collection</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
