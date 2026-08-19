import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, Globe2, Menu, Search, ShoppingBag, Star, UserRound, X } from 'lucide-react';
import { ActivePage, useStore } from '../context/StoreContext';
import { Language } from '../types';

const LANGUAGES: Language[] = ['EN', 'ES', 'FR', 'DE', 'IT', 'PT'];

export const Header: React.FC = () => {
  const {
    siteSettings,
    products,
    searchQuery,
    setSearchQuery,
    navigateToProduct,
    navigateToCategory,
    setActivePage,
    language,
    setLanguage,
    displayPrices,
    setDisplayPrices,
    favorites,
    cartItemCount,
    cartTotal,
    clientProfile,
    currentUser,
  } = useStore();
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const searchBoxRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query.length < 2) return [];
    return products.filter((product) =>
      [product.modelCode, product.name, product.category, product.description]
        .some((value) => value.toLowerCase().includes(query)),
    ).slice(0, 6);
  }, [products, searchQuery]);

  useEffect(() => {
    const closeSearch = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) setSearchOpen(false);
    };
    document.addEventListener('mousedown', closeSearch);
    return () => document.removeEventListener('mousedown', closeSearch);
  }, []);

  const navigate = (target: string) => {
    const [kind, value] = target.split(':');
    if (kind === 'category' && value) navigateToCategory(value);
    if (kind === 'product' && value) navigateToProduct(value);
    if (kind === 'page' && value) setActivePage(value as ActivePage);
    setMobileMenuOpen(false);
    setAccountOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const selectResult = (modelCode: string) => {
    navigateToProduct(modelCode);
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white text-[#1d1d1b]">
      <div className="hidden border-b border-neutral-100 px-5 py-1.5 text-[10px] text-neutral-500 md:flex md:items-center md:justify-between">
        <span>{siteSettings.headerNotice}</span>
        <div className="flex items-center gap-5">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input type="checkbox" checked={displayPrices} onChange={(event) => setDisplayPrices(event.target.checked)} className="accent-black" />
            Display prices
          </label>
          <span>{clientProfile.company}</span>
        </div>
      </div>

      <div className="flex h-[70px] items-center gap-4 px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={() => setMobileMenuOpen((open) => !open)} className="p-1 lg:hidden" aria-label="Toggle menu">
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <button type="button" onClick={() => navigate('page:home')} className="shrink-0 text-left" aria-label="Home">
          {siteSettings.logoUrl ? (
            <img src={siteSettings.logoUrl} alt={siteSettings.brandName} className="h-7 w-auto max-w-36 object-contain" />
          ) : (
            <span className="text-[27px] font-black leading-none tracking-[-0.08em]">{siteSettings.brandName}<sup className="ml-1 text-[8px] tracking-normal">®</sup></span>
          )}
        </button>

        <div ref={searchBoxRef} className="relative mx-auto hidden w-full max-w-xl md:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            onFocus={() => setSearchOpen(true)}
            placeholder="Search..."
            className="h-10 w-full rounded-full border border-neutral-300 bg-neutral-100/70 pl-11 pr-4 text-xs outline-none transition focus:border-neutral-500 focus:bg-white"
          />
          {searchOpen && searchQuery.trim().length >= 2 && (
            <div className="absolute left-0 right-0 top-12 overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-2xl">
              {results.length > 0 ? results.map((product) => (
                <button key={product.id} type="button" onClick={() => selectResult(product.modelCode)} className="flex w-full items-center gap-3 border-b border-neutral-100 p-3 text-left last:border-0 hover:bg-neutral-50">
                  <img src={product.images[0]} alt="" className="h-12 w-10 bg-neutral-100 object-cover" />
                  <span className="min-w-0 flex-1">
                    <strong className="block truncate text-xs">{product.name}</strong>
                    <span className="text-[10px] text-neutral-500">{product.modelCode} · {product.category}</span>
                  </span>
                </button>
              )) : <p className="p-5 text-center text-xs text-neutral-500">No matching products</p>}
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <button type="button" onClick={() => setSearchOpen((open) => !open)} className="p-2 md:hidden" aria-label="Search"><Search className="h-5 w-5" /></button>
          <div className="relative block">
            <button type="button" onClick={() => setLanguageOpen((open) => !open)} className="flex items-center gap-1 p-1 text-[10px] font-semibold sm:p-2" aria-label="Language">
              <Globe2 className="hidden h-4 w-4 sm:block" /><span data-no-translate>{language}</span><ChevronDown className="h-3 w-3" />
            </button>
            {languageOpen && (
              <div className="absolute right-0 top-10 grid min-w-24 overflow-hidden rounded-lg border border-neutral-200 bg-white py-1 shadow-xl">
                {LANGUAGES.map((item) => <button key={item} type="button" data-no-translate onClick={() => { setLanguage(item); setLanguageOpen(false); }} className={`px-4 py-2 text-left text-xs hover:bg-neutral-100 ${item === language ? 'font-bold' : ''}`}>{item}</button>)}
              </div>
            )}
          </div>
          <button type="button" onClick={() => setActivePage('client_area')} className="relative p-2" aria-label="Favourites">
            <Star className="h-5 w-5" />
            {favorites.length > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[8px] text-white">{favorites.length}</span>}
          </button>
          <div className="relative">
            <button type="button" onClick={() => setAccountOpen((open) => !open)} className="p-2" aria-label="Account"><UserRound className="h-5 w-5" /></button>
            {accountOpen && (
              <div className="absolute right-0 top-11 w-56 overflow-hidden rounded-xl border border-neutral-200 bg-white py-2 text-xs shadow-2xl">
                <div className="border-b border-neutral-100 px-4 py-3"><strong className="block">{currentUser.company}</strong><span className="text-[10px] text-neutral-500">{currentUser.email}</span></div>
                <button type="button" onClick={() => navigate('page:client_area')} className="w-full px-4 py-2.5 text-left hover:bg-neutral-50">Client area</button>
                {currentUser.role === 'super_admin' && <button type="button" onClick={() => navigate('page:admin')} className="w-full px-4 py-2.5 text-left font-semibold hover:bg-neutral-50">Super Admin</button>}
              </div>
            )}
          </div>
          <button type="button" onClick={() => setActivePage('cart')} className="relative flex items-center gap-2 p-2" aria-label="Cart">
            <ShoppingBag className="h-5 w-5" />
            <span className="hidden text-[10px] lg:block">{displayPrices ? `${cartTotal.toFixed(2)} ${siteSettings.currency}` : 'Cart'}</span>
            {cartItemCount > 0 && <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[8px] text-white">{cartItemCount}</span>}
          </button>
        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-neutral-100 p-3 md:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search products" className="w-full rounded-full bg-neutral-100 py-2.5 pl-10 pr-4 text-xs outline-none" />
          </div>
          {searchQuery.trim().length >= 2 && results.map((product) => <button key={product.id} type="button" onClick={() => selectResult(product.modelCode)} className="block w-full border-b border-neutral-100 p-3 text-left text-xs"><strong>{product.name}</strong> <span className="text-neutral-500">{product.modelCode}</span></button>)}
        </div>
      )}

      <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} border-t border-neutral-100 lg:block`}>
        <div className="flex max-h-[70vh] flex-col overflow-y-auto px-4 lg:flex-row lg:items-center lg:justify-center lg:overflow-visible lg:px-6">
          {siteSettings.headerNavigation.filter((item) => item.visible).map((item) => (
            <div key={item.id} className="group relative border-b border-neutral-100 lg:border-0">
              <button type="button" onClick={() => navigate(item.target)} className="flex w-full items-center justify-between gap-1 px-3 py-3 text-left text-[11px] transition-colors hover:bg-neutral-50 lg:py-3.5">
                {item.label}{item.children?.some((child) => child.visible) && <ChevronDown className="h-3 w-3 transition-transform group-hover:rotate-180" />}
              </button>
              {item.children?.some((child) => child.visible) && (
                <div className="grid bg-neutral-50 pb-2 lg:invisible lg:absolute lg:left-1/2 lg:top-full lg:z-50 lg:min-w-64 lg:-translate-x-1/2 lg:rounded-b-lg lg:border lg:border-neutral-200 lg:bg-white lg:py-2 lg:opacity-0 lg:shadow-2xl lg:transition lg:group-hover:visible lg:group-hover:opacity-100 lg:group-focus-within:visible lg:group-focus-within:opacity-100">
                  {item.children.filter((child) => child.visible).map((child) => (
                    <button key={child.id} type="button" onClick={() => navigate(child.target)} className="px-6 py-2.5 text-left text-[11px] text-neutral-600 hover:bg-neutral-100 hover:text-black lg:px-4">
                      {child.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  );
};
