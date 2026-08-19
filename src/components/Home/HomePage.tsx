import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { ActivePage, useStore } from '../../context/StoreContext';
import { HomeContentCard, HomeVideoSlide, Product } from '../../types';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=85';

export const HomePage: React.FC = () => {
  const {
    siteSettings,
    products,
    setActivePage,
    navigateToCategory,
    navigateToProduct,
    showToast,
  } = useStore();
  const [heroIndex, setHeroIndex] = useState(0);
  const [brandVideoIndex, setBrandVideoIndex] = useState(0);
  const [search, setSearch] = useState('');

  const heroSlides = siteSettings.heroSlides.length > 0 ? siteSettings.heroSlides : [];
  const currentHero = heroSlides[heroIndex % Math.max(heroSlides.length, 1)];
  const featuredProducts = useMemo(() => {
    const configured = siteSettings.featuredRolyProductCodes.map((code) => products.find((product) => product.modelCode === code)).filter((product): product is Product => Boolean(product));
    return configured.length > 0 ? configured : [...products.filter((product) => product.isNew), ...products].filter((product, index, all) => all.findIndex((item) => item.id === product.id) === index);
  }, [products, siteSettings.featuredRolyProductCodes]);
  const featuredWorkwearProducts = useMemo(() => {
    const configured = siteSettings.featuredWorkwearProductCodes.map((code) => products.find((product) => product.modelCode === code)).filter((product): product is Product => Boolean(product));
    return configured.length > 0 ? configured : products.filter((product) => product.isWorkwear || product.categorySlug === 'workwear');
  }, [products, siteSettings.featuredWorkwearProductCodes]);
  const footwearProducts = useMemo(() => products.filter((product) => product.categorySlug === 'footwear'), [products]);

  useEffect(() => {
    if (heroSlides.length < 2) return undefined;
    const timer = window.setInterval(() => {
      setHeroIndex((index) => (index + 1) % heroSlides.length);
    }, 6500);
    return () => window.clearInterval(timer);
  }, [heroSlides.length]);

  useEffect(() => {
    if (siteSettings.brandVideoSlides.length < 2) return undefined;
    const timer = window.setInterval(() => setBrandVideoIndex((index) => (index + 1) % siteSettings.brandVideoSlides.length), 9000);
    return () => window.clearInterval(timer);
  }, [siteSettings.brandVideoSlides.length]);

  const navigate = (target: string) => {
    const [kind, value] = target.split(':');
    if (kind === 'category' && value) {
      navigateToCategory(value);
      return;
    }
    if (kind === 'product' && value) {
      navigateToProduct(value);
      return;
    }
    if (kind === 'page' && value) {
      setActivePage(value as ActivePage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = search.trim().toLowerCase();
    if (!query) return;
    const match = products.find((product) =>
      product.modelCode.toLowerCase() === query || product.name.toLowerCase().includes(query),
    );
    if (match) {
      navigateToProduct(match.modelCode);
      return;
    }
    showToast(`No product found for “${search.trim()}”`, 'info');
  };

  const imageStyle = (imageUrl: string) => ({ backgroundImage: `url("${imageUrl || FALLBACK_IMAGE}")` });

  return (
    <div className="w-full overflow-hidden bg-white text-[#1d1d1b]">
      <section className="relative bg-neutral-100">
        {currentHero ? (
          <button
            type="button"
            onClick={() => navigate(currentHero.target)}
            className="group relative block h-[36vw] min-h-[310px] max-h-[680px] w-full overflow-hidden text-left"
            aria-label={`${currentHero.title}: ${currentHero.ctaLabel || 'Discover'}`}
          >
            {currentHero.videoUrl ? (
              <video key={currentHero.videoUrl} autoPlay muted loop playsInline preload="metadata" poster={currentHero.imageUrl} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1600ms] group-hover:scale-[1.015]">
                <source src={currentHero.videoUrl} type="video/mp4" />
              </video>
            ) : (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-[1600ms] group-hover:scale-[1.015]"
                style={imageStyle(currentHero.imageUrl)}
              />
            )}
            {currentHero.showContent !== false && <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/5 to-transparent" />}
            {currentHero.showContent !== false && <div className={`absolute bottom-[12%] left-[7%] max-w-xl ${currentHero.textColor === 'dark' ? 'text-black' : 'text-white'}`}>
              <span className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-xs">
                {currentHero.eyebrow}
              </span>
              <h1 className="max-w-lg text-3xl font-semibold leading-[1.02] tracking-tight sm:text-5xl lg:text-6xl">
                {currentHero.title}
              </h1>
              <p className="mt-3 text-xs sm:text-base">{currentHero.description}</p>
              <span className="mt-5 inline-flex rounded-full bg-white px-5 py-2 text-[10px] font-bold text-black transition-transform group-hover:translate-x-1">
                {currentHero.ctaLabel || 'DISCOVER'}
              </span>
            </div>}
          </button>
        ) : (
          <div className="flex min-h-[420px] items-center justify-center">Add a hero slide in Super Admin.</div>
        )}

        {heroSlides.length > 1 && (
          <>
          <button type="button" onClick={() => setHeroIndex((index) => (index - 1 + heroSlides.length) % heroSlides.length)} className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-black backdrop-blur transition hover:bg-white" aria-label="Previous slide"><ChevronLeft className="h-5 w-5" /></button>
          <button type="button" onClick={() => setHeroIndex((index) => (index + 1) % heroSlides.length)} className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-black backdrop-blur transition hover:bg-white" aria-label="Next slide"><ChevronRight className="h-5 w-5" /></button>
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/80 px-3 py-2 backdrop-blur">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setHeroIndex(index)}
                aria-label={`Show slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all ${index === heroIndex ? 'w-6 bg-black' : 'w-1.5 bg-black/35'}`}
              />
            ))}
          </div>
          </>
        )}
      </section>

      <div className="mx-auto max-w-[1600px] px-2 sm:px-3">
        <form onSubmit={submitSearch} className="mx-auto -mt-px flex max-w-2xl items-center border-x border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
          <Search className="h-4 w-4 text-neutral-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products"
            className="min-w-0 flex-1 px-3 text-sm outline-none"
          />
        </form>

        <section className="grid grid-cols-1 gap-1 py-8 sm:grid-cols-3">
          {siteSettings.audienceCards.map((card) => (
            <EditorialCard key={card.id} card={card} onClick={() => navigate(card.target)} className="aspect-[1.22/1]" />
          ))}
        </section>

        <section className="pb-8">
          <h2 className="mb-5 text-xl font-medium sm:text-2xl">The latest in Roly</h2>
          <div className="grid gap-1 md:grid-cols-2">
            {siteSettings.latestBanners.map((card) => (
              <EditorialCard key={card.id} card={card} onClick={() => navigate(card.target)} className="aspect-[2/1]" showButton />
            ))}
          </div>
        </section>

        {siteSettings.showCustomizerBanner && (
          <CampaignBanner card={siteSettings.customizerBanner} onClick={() => navigate(siteSettings.customizerBanner.target)} />
        )}

        <section className="py-10">
          <h2 className="mb-5 text-xl font-medium sm:text-2xl">What you can't miss</h2>
          <div className="grid gap-1 md:grid-cols-3">
            {siteSettings.storyCards.map((card) => (
              <button key={card.id} type="button" onClick={() => navigate(card.target)} className="group text-left">
                <div className="aspect-[1.05/1] overflow-hidden bg-neutral-100">
                  <img src={card.imageUrl || FALLBACK_IMAGE} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
                </div>
                <h3 className="mt-3 text-base font-semibold">{card.title}</h3>
                <p className="mt-1 max-w-md text-xs leading-relaxed text-neutral-600">{card.description}</p>
              </button>
            ))}
          </div>
        </section>

        <ProductRail title="Featured in Roly" products={featuredProducts} intervalMs={siteSettings.productCarouselIntervalMs} onProduct={navigateToProduct} />

        {siteSettings.brandVideoSlides.length > 0 && (
          <VideoFeatureCarousel slides={siteSettings.brandVideoSlides} activeIndex={brandVideoIndex} onIndex={setBrandVideoIndex} onNavigate={navigate} />
        )}

        {footwearProducts.length > 0 && (
          <section className="mb-12 grid overflow-hidden bg-[#eeeeee] md:grid-cols-[0.8fr_1.2fr]">
            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-neutral-500">Footwear collection</span>
              <h2 className="mt-3 text-4xl font-semibold leading-none sm:text-5xl">Shoes built for every step.</h2>
              <p className="mt-4 max-w-md text-sm leading-6 text-neutral-600">Explore sports, casual and professional footwear with size-by-size stock availability.</p>
              <button type="button" onClick={() => navigateToCategory('footwear')} className="mt-6 w-fit rounded-full bg-black px-6 py-3 text-xs font-bold text-white">DISCOVER FOOTWEAR</button>
            </div>
            <button type="button" onClick={() => navigateToProduct(footwearProducts[0].modelCode)} className="group relative min-h-[360px] overflow-hidden bg-white">
              <img src={footwearProducts[0].images[0]} alt={footwearProducts[0].name} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
              <span className="absolute bottom-5 left-5 rounded-full bg-white px-4 py-2 text-[10px] font-bold text-black">{footwearProducts[0].name} · {footwearProducts[0].modelCode}</span>
            </button>
          </section>
        )}

        <LogoMarquee logos={siteSettings.certificationLogos} />

        <section className="relative min-h-[520px] overflow-hidden sm:min-h-[700px]">
          <div className="absolute left-0 top-7 h-4 w-1/3 bg-[repeating-linear-gradient(135deg,#f5a900_0,#f5a900_8px,transparent_8px,transparent_16px)]" />
          <button type="button" onClick={() => navigate('category:workwear')} className="relative flex min-h-[520px] w-full items-center justify-center overflow-hidden sm:min-h-[700px]">
            <video key={siteSettings.workwearVideoUrl} autoPlay muted loop playsInline preload="metadata" poster={siteSettings.workwearVideoPosterUrl} className="absolute inset-0 h-full w-full scale-110 object-cover">
              <source src={siteSettings.workwearVideoUrl} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/15" />
            <img src="https://static.gorfactory.es/images/home/Logo_WRK_color.svg" alt="Roly Work" className="relative z-10 w-2/3 max-w-[600px] drop-shadow-[0_4px_30px_rgba(255,255,255,.45)]" />
          </button>
          <div className="absolute bottom-7 right-0 h-4 w-1/3 bg-[repeating-linear-gradient(135deg,#f5a900_0,#f5a900_8px,transparent_8px,transparent_16px)]" />
        </section>
      </div>

      <section className="bg-black px-6 py-12 text-white sm:px-12">
        <div className="mx-auto max-w-[1320px]">
          <p className="mx-auto max-w-4xl text-center text-xs leading-5 text-neutral-300">{siteSettings.workwearBanner.description}</p>
          <div className="mt-10 grid grid-cols-2 gap-x-10 gap-y-5 sm:grid-cols-4">
            {['RWK Footwear', 'Hi-Viz', 'Fireproof', 'Industry', 'HORECA', 'Food industry', 'Health & Aesthetics', 'Basics'].map((label) => (
              <button key={label} type="button" onClick={() => navigate('category:workwear')} className="border-b border-neutral-600 pb-3 text-left text-sm hover:border-white">{label}</button>
            ))}
          </div>
          <button type="button" onClick={() => navigate(siteSettings.workwearBanner.target)} className="mt-10 block w-full overflow-hidden bg-neutral-950">
            <img src={siteSettings.workwearBanner.imageUrl} alt={siteSettings.workwearBanner.title} className="max-h-[440px] w-full object-cover" />
          </button>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] px-2 py-12 sm:px-3">
        <ProductRail title="Featured in Workwear" products={featuredWorkwearProducts} intervalMs={siteSettings.productCarouselIntervalMs} onProduct={navigateToProduct} />
      </div>
    </div>
  );
};

const ProductRail: React.FC<{ title: string; products: Product[]; intervalMs: number; onProduct: (modelCode: string) => void }> = ({ title, products, intervalMs, onProduct }) => {
  const railRef = useRef<HTMLDivElement>(null);
  const move = (direction: 1 | -1) => {
    const rail = railRef.current;
    if (!rail) return;
    const atEnd = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 12;
    const atStart = rail.scrollLeft <= 12;
    if (direction === 1 && atEnd) rail.scrollTo({ left: 0, behavior: 'smooth' });
    else if (direction === -1 && atStart) rail.scrollTo({ left: rail.scrollWidth, behavior: 'smooth' });
    else rail.scrollBy({ left: direction * Math.max(rail.clientWidth * 0.72, 260), behavior: 'smooth' });
  };

  useEffect(() => {
    if (products.length < 2 || intervalMs < 1500) return undefined;
    const timer = window.setInterval(() => move(1), intervalMs);
    return () => window.clearInterval(timer);
  }, [products.length, intervalMs]);

  if (products.length === 0) return null;
  return (
    <section className="pb-12">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-medium sm:text-2xl">{title}</h2>
        <div className="flex gap-2">
          <button type="button" onClick={() => move(-1)} aria-label={`Previous ${title} products`} className="rounded-full border border-neutral-300 p-2 hover:border-black"><ChevronLeft className="h-4 w-4" /></button>
          <button type="button" onClick={() => move(1)} aria-label={`Next ${title} products`} className="rounded-full border border-neutral-300 p-2 hover:border-black"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
      <div ref={railRef} className="flex snap-x snap-mandatory gap-1 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {products.map((product) => (
          <button key={product.id} type="button" onClick={() => onProduct(product.modelCode)} className="group w-[48%] shrink-0 snap-start text-left sm:w-[31.8%] lg:w-[19.7%]">
            <div className="aspect-[.78/1] overflow-hidden bg-[#f1f1f1]"><img src={product.images[0] || FALLBACK_IMAGE} alt={product.name} loading="lazy" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} className="h-full w-full object-cover mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.025]" /></div>
            <div className="flex items-baseline gap-1 pt-3 text-xs"><strong>{product.name}</strong><span className="text-neutral-500">{product.modelCode.replace(/^[A-Z]+/, '') || product.modelCode}</span></div>
          </button>
        ))}
      </div>
    </section>
  );
};

const VideoFeatureCarousel: React.FC<{ slides: HomeVideoSlide[]; activeIndex: number; onIndex: (index: number) => void; onNavigate: (target: string) => void }> = ({ slides, activeIndex, onIndex, onNavigate }) => {
  const slide = slides[activeIndex % slides.length];
  const move = (direction: 1 | -1) => onIndex((activeIndex + direction + slides.length) % slides.length);
  return (
    <section className="relative mb-12 min-h-[360px] overflow-hidden bg-black sm:min-h-[620px]">
      <video key={slide.videoUrl} autoPlay muted loop playsInline preload="metadata" poster={slide.posterUrl} className="absolute inset-0 h-full w-full object-cover"><source src={slide.videoUrl} type="video/mp4" /></video>
      <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/5 to-black/10" />
      <button type="button" onClick={() => onNavigate(slide.target)} className={`absolute inset-0 z-10 flex flex-col items-start justify-end p-[7%] text-left ${slide.textColor === 'dark' ? 'text-black' : 'text-white'}`}>
        <h2 className="max-w-2xl text-4xl font-semibold leading-none sm:text-6xl">{slide.title}</h2>
        <p className="mt-3 max-w-lg text-sm">{slide.description}</p>
        <span className="mt-5 rounded-full bg-white px-5 py-2 text-[10px] font-bold text-black">{slide.ctaLabel}</span>
      </button>
      {slides.length > 1 && <><button type="button" onClick={() => move(-1)} aria-label="Previous video" className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-3"><ChevronLeft className="h-5 w-5" /></button><button type="button" onClick={() => move(1)} aria-label="Next video" className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/85 p-3"><ChevronRight className="h-5 w-5" /></button></>}
    </section>
  );
};

const LogoMarquee: React.FC<{ logos: string[] }> = ({ logos }) => (
  <section className="overflow-hidden border-y border-neutral-100 py-8" aria-label="Certifications and partners">
    <div className="roly-logo-marquee flex w-max items-center gap-14">
      {[...logos, ...logos].map((logo, index) => <img key={`${logo}-${index}`} src={logo} alt={`Certification ${(index % Math.max(logos.length, 1)) + 1}`} className="h-12 w-24 shrink-0 object-contain grayscale transition hover:grayscale-0 sm:h-16 sm:w-32" />)}
    </div>
  </section>
);

const EditorialCard: React.FC<{
  card: HomeContentCard;
  onClick: () => void;
  className?: string;
  showButton?: boolean;
}> = ({ card, onClick, className = '', showButton = false }) => (
  <button type="button" onClick={onClick} className={`group relative overflow-hidden bg-neutral-100 text-left ${className}`}>
    <img src={card.imageUrl || FALLBACK_IMAGE} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]" />
    <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
    <div className="absolute bottom-0 left-0 p-4 text-white sm:p-6">
      <h3 className="text-lg font-semibold sm:text-2xl">{card.title}</h3>
      {card.description && <p className="mt-1 max-w-sm text-xs text-white/85">{card.description}</p>}
      {showButton && (
        <span className="mt-4 inline-block rounded-full bg-white px-4 py-2 text-[10px] font-bold text-black">
          {card.ctaLabel || 'DISCOVER'}
        </span>
      )}
    </div>
  </button>
);

const CampaignBanner: React.FC<{ card: HomeContentCard; onClick: () => void; contain?: boolean }> = ({ card, onClick, contain = false }) => (
  <button type="button" onClick={onClick} className="group relative block min-h-[260px] w-full overflow-hidden bg-neutral-100 text-left sm:min-h-[420px]">
    <img
      src={card.imageUrl || FALLBACK_IMAGE}
      alt=""
      className={`absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.01] ${contain ? 'object-contain' : 'object-cover'}`}
    />
    {!contain && <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-transparent" />}
    {!contain && (
      <div className="absolute bottom-[13%] left-[7%] max-w-sm text-white">
        <h2 className="text-3xl font-semibold leading-none sm:text-5xl">{card.title}</h2>
        <p className="mt-3 text-xs sm:text-sm">{card.description}</p>
        <span className="mt-5 inline-block rounded-full bg-white px-5 py-2 text-[10px] font-bold text-black">
          {card.ctaLabel || 'START'}
        </span>
      </div>
    )}
  </button>
);
