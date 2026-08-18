import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { CATEGORIES } from '../../data/mockProducts';
import { ProductCard } from '../Product/ProductCard';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Layers, 
  Package, 
  Leaf, 
  Flame, 
  CheckCircle2, 
  ChevronRight,
  ChevronLeft,
  Download,
  BookOpen,
  FileText,
  Clock,
  Shield,
  TrendingUp,
  Tag,
  Factory,
  Globe,
  Award
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { products, navigateToCategory, navigateToProduct, setActivePage, showToast, siteSettings } = useStore();
  const [heroSearch, setHeroSearch] = useState('');
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 't_shirts' | 'polos' | 'sweaters' | 'jackets' | 'workwear'>('all');

  // Hero carousel slides
  const heroSlides = [
    {
      id: 'general_2026',
      badge: 'Official 2026 Collection',
      title: 'THE TEXTILE STANDARD FOR PROMOTIONAL & CORPORATE WEAR',
      subtitle: 'Over 200 European models with 35,000,000+ units in permanent automated inventory at our Alicante central logistics hub.',
      modelCode: 'CA6681',
      modelName: 'ATOMIC 150 T-SHIRT',
      modelDetails: '100% Combed Cotton • 24 Standard Colors • 150 g/m²',
      priceFrom: '1.62 €',
      categorySlug: 't_shirts',
      bgImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1400&q=80',
      accentColor: 'text-yellow-400',
      buttonText: 'Explore 2026 Collection',
    },
    {
      id: 'roly_wrk',
      badge: 'Certified Safety & Industrial',
      title: 'ROLY WRK HIGH-VISIBILITY & TECHNICAL WORKWEAR',
      subtitle: 'EN ISO 20471 certified Class 2 & 3 high-visibility, flame retardant, and multi-hazard protective apparel engineered for European industry.',
      modelCode: 'HV9300',
      modelName: 'POLARIS HIGH-VIS POLO',
      modelDetails: 'Coolpass Microfiber • 3M Scotchlite Retroreflective Tape',
      priceFrom: '8.40 €',
      categorySlug: 'workwear',
      bgImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1400&q=80',
      accentColor: 'text-yellow-400',
      buttonText: 'Explore Roly WRK',
    },
    {
      id: 'roly_eco',
      badge: '100% GOTS Organic & Recycled',
      title: 'ROLY ECO: SUSTAINABLE APPAREL FOR A CIRCULAR FUTURE',
      subtitle: 'Manufactured with 100% certified organic ring-spun cotton and recycled PET polyester fibers under strict Oeko-Tex Standard 100 protocols.',
      modelCode: 'CA6681',
      modelName: 'ATOMIC ECO ORGANIC',
      modelDetails: 'GOTS Certified • 100% Pesticide-Free Cotton • Removable Label',
      priceFrom: '2.10 €',
      categorySlug: 'rolyeco',
      bgImage: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=1400&q=80',
      accentColor: 'text-emerald-400',
      buttonText: 'Explore Eco Line',
    },
    {
      id: 'roly_sport',
      badge: 'High Performance Teamwear',
      title: 'ROLY SPORT TECHNICAL RUNNING & MULTI-SPORT KITS',
      subtitle: 'Engineered breathable fabrics with Control-Dry technology for sublimation, football teams, marathon racing, and fitness clubs.',
      modelCode: 'CA6654',
      modelName: 'MONTECARLO TECHNICAL TEE',
      modelDetails: '100% Breathable Pique Polyester • Easy Sublimation • 140 g/m²',
      priceFrom: '1.95 €',
      categorySlug: 'sports',
      bgImage: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=80',
      accentColor: 'text-blue-400',
      buttonText: 'Explore Roly Sport',
    }
  ];

  // Auto-advance hero carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!heroSearch.trim()) return;
    const match = products.find(
      p => p.modelCode.toLowerCase() === heroSearch.trim().toLowerCase() ||
           p.name.toLowerCase().includes(heroSearch.trim().toLowerCase())
    );
    if (match) {
      navigateToProduct(match.modelCode);
    } else {
      navigateToCategory('all');
    }
  };

  // Filter products by tab
  const getTabProducts = () => {
    switch (activeTab) {
      case 't_shirts':
        return products.filter(p => p.categorySlug === 't_shirts' && !p.name.toLowerCase().includes('polo')).slice(0, 8);
      case 'polos':
        return products.filter(p => p.name.toLowerCase().includes('polo') || p.modelCode.startsWith('PO')).slice(0, 8);
      case 'sweaters':
        return products.filter(p => p.categorySlug === 'swe' || p.modelCode.startsWith('SW') || p.name.toLowerCase().includes('hoodie')).slice(0, 8);
      case 'jackets':
        return products.filter(p => p.categorySlug === 'coats' || p.modelCode.startsWith('CH') || p.name.toLowerCase().includes('softshell')).slice(0, 8);
      case 'workwear':
        return products.filter(p => p.categorySlug === 'workwear' || p.isWorkwear || p.isHighVis).slice(0, 8);
      case 'all':
      default:
        return products.slice(0, 8);
    }
  };

  const currentSlide = heroSlides[currentHeroSlide];

  return (
    <div className="w-full bg-[#f8f8f8] min-h-screen font-sans">
      
      {/* 1. HERO SLIDER CAROUSEL */}
      <section className="relative bg-neutral-950 text-white overflow-hidden min-h-[500px] lg:min-h-[580px] flex items-center border-b border-neutral-800">
        
        {/* Background Image with smooth fade */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentSlide.bgImage}
            alt={currentSlide.title}
            className="w-full h-full object-cover opacity-25 filter brightness-75 transition-all duration-1000 transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 relative z-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center space-x-2 bg-yellow-400/10 border border-yellow-400/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-yellow-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{currentSlide.badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight uppercase">
              {currentSlide.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-300 max-w-xl leading-relaxed">
              {currentSlide.subtitle}
            </p>

            {/* Direct Model Code Quick Search Box */}
            <form onSubmit={handleHeroSearch} className="max-w-md flex items-center bg-white rounded-xl p-1.5 shadow-2xl">
              <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="Search Model Code (e.g. CA6681, PO6638, HV9300)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs font-bold text-gray-900 outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white text-xs font-black uppercase rounded-lg transition-colors shrink-0 cursor-pointer"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => navigateToCategory(currentSlide.categorySlug)}
                className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider rounded-lg shadow-md transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>{currentSlide.buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePage('catalogs')}
                className="px-6 py-3 bg-neutral-900/80 hover:bg-neutral-800 text-white font-bold text-xs uppercase rounded-lg border border-neutral-700 transition-all cursor-pointer flex items-center space-x-2"
              >
                <BookOpen className="w-4 h-4 text-gray-300" />
                <span>PDF Catalogues 2026</span>
              </button>
            </div>
          </div>

          {/* Right Hero Feature Card */}
          <div className="lg:col-span-5 relative hidden sm:block">
            <div 
              onClick={() => navigateToProduct(currentSlide.modelCode)}
              className="group bg-neutral-900/90 backdrop-blur-md rounded-2xl border border-neutral-700 p-5 shadow-2xl cursor-pointer hover:border-yellow-400 transition-all"
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4 bg-neutral-800">
                <img
                  src={currentSlide.bgImage}
                  alt={currentSlide.modelName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-black text-white text-xs font-mono font-black px-2.5 py-1 rounded">
                  MODEL {currentSlide.modelCode}
                </span>
                <span className="absolute bottom-3 right-3 bg-yellow-400 text-black text-xs font-mono font-black px-2.5 py-1 rounded shadow-md">
                  From {currentSlide.priceFrom} /pc
                </span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-lg font-black text-white uppercase group-hover:text-yellow-400 transition-colors">
                    {currentSlide.modelName}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">{currentSlide.modelDetails}</p>
                </div>
                <span className="text-xs font-bold text-yellow-400 flex items-center gap-1 group-hover:underline">
                  Order Matrix →
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Slider Controls */}
        <div className="absolute bottom-4 left-0 right-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex justify-between items-center">
            <div className="flex space-x-2">
              {heroSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  onClick={() => setCurrentHeroSlide(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    currentHeroSlide === idx ? 'w-8 bg-yellow-400' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                  }`}
                  title={slide.badge}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))}
                className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % heroSlides.length)}
                className="p-2 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-white border border-neutral-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. GOR FACTORY LOGISTIC ADVANTAGE STRIP */}
      <section className="bg-white border-b border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase text-gray-900">35M+ Units in Stock</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Permanent automated inventory at Alicante Hub</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase text-gray-900">24/48h EU Express</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Automated parcel & pallet dispatch daily</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase text-gray-900">In-House Personalization</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Screen print, embroidery & DTF transfer</p>
              </div>
            </div>

            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-black text-xs uppercase text-gray-900">OEKO-TEX® & GOTS</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Standard 100 eco-safety certified textiles</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. VISUAL CATEGORY BENTO GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-2">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-widest">Official Collections</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight">
              Explore Main Textile Lines
            </h2>
          </div>
          <button
            onClick={() => navigateToCategory('all')}
            className="text-xs font-bold text-black hover:underline flex items-center space-x-1 cursor-pointer"
          >
            <span>View All Collections ({products.length} Models)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              onClick={() => navigateToCategory(cat.slug)}
              className="group bg-white rounded-2xl border border-gray-200 p-5 hover:border-black hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-mono font-bold text-gray-400 uppercase tracking-wider block mb-1">
                  Collection
                </span>
                <h3 className="font-black text-sm text-gray-900 group-hover:text-red-600 transition-colors uppercase">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-relaxed">
                  {cat.sub.slice(0, 3).join(', ')}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-700 font-bold group-hover:text-black">
                <span>Browse Models</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. TABBED BEST-SELLERS SHOWCASE WITH PRODUCT CARDS */}
      <section className="bg-white py-16 border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <span className="text-xs font-bold text-red-600 uppercase tracking-widest">High Volume Best-Sellers</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight mt-0.5">
                Top Wholesale References
              </h2>
            </div>

            {/* Filter Tabs */}
            <div className="flex space-x-1.5 overflow-x-auto no-scrollbar bg-neutral-100 p-1.5 rounded-xl text-xs font-bold">
              {[
                { id: 'all', label: 'All Top Models' },
                { id: 't_shirts', label: 'T-Shirts' },
                { id: 'polos', label: 'Polo Shirts' },
                { id: 'sweaters', label: 'Sweats & Fleece' },
                { id: 'jackets', label: 'Softshell & Jackets' },
                { id: 'workwear', label: 'Roly WRK' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-black text-white shadow-sm'
                      : 'text-gray-600 hover:text-black hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {getTabProducts().map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <button
              onClick={() => navigateToCategory('all')}
              className="px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center space-x-2"
            >
              <span>View Full B2B Wholesale Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 5. INTERACTIVE CUSTOMIZER STUDIO CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="bg-neutral-950 text-white rounded-3xl p-8 sm:p-14 overflow-hidden relative shadow-2xl border border-neutral-800">
          
          <div className="max-w-2xl space-y-5 relative z-10">
            <div className="inline-flex items-center space-x-2 bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-3.5 py-1 rounded-full text-xs font-bold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Garment Customization Simulator</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight uppercase leading-tight">
              Screen Printing, Embroidery & DTF Transfer Studio
            </h2>

            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Upload your customer logos, simulate placement on Roly garments (chest, back, sleeves), and calculate automated printing and screen setup rates with instant PDF quotes.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => setActivePage('customizer')}
                className="px-7 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all cursor-pointer flex items-center space-x-2"
              >
                <span>Launch Customizer Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActivePage('catalogs')}
                className="px-7 py-3.5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-xs uppercase rounded-xl border border-neutral-700 transition-all cursor-pointer flex items-center space-x-2"
              >
                <Download className="w-4 h-4 text-gray-400" />
                <span>Download Lookbooks</span>
              </button>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-10 bg-[radial-gradient(ellipse_at_center,rgba(250,204,21,0.5),transparent_70%)] pointer-events-none hidden lg:block" />
        </div>
      </section>

      {/* 6. OFFICIAL PDF CATALOGUES & LOOKBOOKS SECTION */}
      <section className="bg-white py-16 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Marketing & Sales Collateral</span>
              <h2 className="text-2xl sm:text-3xl font-black text-gray-900 uppercase tracking-tight mt-0.5">
                Official Roly 2026 Catalogues
              </h2>
            </div>
            <button
              onClick={() => setActivePage('catalogs')}
              className="text-xs font-bold text-black hover:underline flex items-center space-x-1"
            >
              <span>View All Lookbooks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-neutral-50 rounded-2xl border border-gray-200 p-5 flex flex-col justify-between hover:border-black transition-all">
              <div>
                <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  PDF • 180 Pages
                </span>
                <h3 className="font-black text-base text-gray-900 mt-3 uppercase">General Catalogue 2026</h3>
                <p className="text-xs text-gray-500 mt-1">Complete collection of T-shirts, Polos, Sweats, Jackets, and Accessories.</p>
              </div>
              <button
                onClick={() => showToast('Downloaded General_Catalogue_2026.pdf', 'success')}
                className="mt-4 w-full py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="bg-neutral-50 rounded-2xl border border-gray-200 p-5 flex flex-col justify-between hover:border-black transition-all">
              <div>
                <span className="bg-yellow-500 text-black text-[10px] font-mono font-black px-2 py-0.5 rounded uppercase">
                  PDF • 95 Pages
                </span>
                <h3 className="font-black text-base text-gray-900 mt-3 uppercase">Roly WRK Workwear 2026</h3>
                <p className="text-xs text-gray-500 mt-1">High-visibility ISO 20471, multi-hazard, and industrial protective garments.</p>
              </div>
              <button
                onClick={() => showToast('Downloaded Roly_WRK_Safety_2026.pdf', 'success')}
                className="mt-4 w-full py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="bg-neutral-50 rounded-2xl border border-gray-200 p-5 flex flex-col justify-between hover:border-black transition-all">
              <div>
                <span className="bg-blue-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  PDF • 70 Pages
                </span>
                <h3 className="font-black text-base text-gray-900 mt-3 uppercase">Roly Sport & Performance</h3>
                <p className="text-xs text-gray-500 mt-1">Technical running apparel, team sports kits, and fitness accessories.</p>
              </div>
              <button
                onClick={() => showToast('Downloaded Roly_Sport_Performance_2026.pdf', 'success')}
                className="mt-4 w-full py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

            <div className="bg-neutral-50 rounded-2xl border border-gray-200 p-5 flex flex-col justify-between hover:border-black transition-all">
              <div>
                <span className="bg-emerald-600 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                  PDF • 45 Pages
                </span>
                <h3 className="font-black text-base text-gray-900 mt-3 uppercase">Roly Eco Sustainability</h3>
                <p className="text-xs text-gray-500 mt-1">100% GOTS organic cotton and recycled fibers technical dossier.</p>
              </div>
              <button
                onClick={() => showToast('Downloaded Roly_Eco_Sustainability.pdf', 'success')}
                className="mt-4 w-full py-2.5 bg-black hover:bg-neutral-800 text-white rounded-lg font-bold text-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 7. CORPORATE TRUST & CERTIFICATIONS BAR */}
      <section className="bg-neutral-900 text-white py-12 border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="text-xs font-bold text-yellow-400 uppercase tracking-widest">Quality & Social Compliance</span>
            <h3 className="text-xl font-black uppercase mt-1">Certified European Manufacturing Standards</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center text-xs">
            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="font-bold">OEKO-TEX® 100</span>
              <span className="text-[10px] text-gray-400">Class I/II Certified</span>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center">
              <Leaf className="w-8 h-8 text-emerald-400 mb-2" />
              <span className="font-bold">GOTS Organic</span>
              <span className="text-[10px] text-gray-400">100% Bio Cotton</span>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center">
              <Globe className="w-8 h-8 text-blue-400 mb-2" />
              <span className="font-bold">BSCI amfori</span>
              <span className="text-[10px] text-gray-400">Social Audited</span>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center">
              <Award className="w-8 h-8 text-yellow-400 mb-2" />
              <span className="font-bold">ISO 9001:2015</span>
              <span className="text-[10px] text-gray-400">Quality Management</span>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center">
              <Factory className="w-8 h-8 text-yellow-400 mb-2" />
              <span className="font-bold">ISO 14001:2015</span>
              <span className="text-[10px] text-gray-400">Environmental</span>
            </div>

            <div className="p-4 bg-neutral-950 rounded-xl border border-neutral-800 flex flex-col items-center justify-center">
              <Shield className="w-8 h-8 text-purple-400 mb-2" />
              <span className="font-bold">Sedex SMETA</span>
              <span className="text-[10px] text-gray-400">Ethical Trade</span>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
