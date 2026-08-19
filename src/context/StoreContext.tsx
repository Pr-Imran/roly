import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Proposal, StockNotice, Address, ClientProfile, MySQLConfig, Language, SiteSettings, Vendor, UserRole, CommerceSettings, AppUser, CatalogCategory } from '../types';
import { buildCategoryNavigation, CATEGORIES, MOCK_PRODUCTS } from '../data/mockProducts';
import { MOCK_ORDERS, MOCK_PROPOSALS, MOCK_STOCK_NOTICES, MOCK_ADDRESSES, MOCK_CLIENT_PROFILE } from '../data/mockClientData';

export type ActivePage = 
  | 'home'
  | 'category'
  | 'product_detail'
  | 'customizer'
  | 'cart'
  | 'checkout'
  | 'order_tracking'
  | 'client_area'
  | 'admin'
  | 'catalogs'
  | 'sizes_guide'
  | 'glossary'
  | 'faq'
  | 'cookies'
  | 'disclaimer'
  | 'contact_us'
  | 'visit_us'
  | 'quality'
  | 'stock_search'
  | 'contact'
  | 'claim_policy'
  | 'privacy_policy'
  | 'terms';

export type ClientAreaTab = 
  | 'documents'
  | '347_report'
  | 'stock_notice'
  | 'favourite_orders'
  | 'marketing'
  | 'addresses'
  | 'contact'
  | 'account_config'
  | 'youroly';

export type DocumentSubTab = 
  | 'proposals'
  | 'orders'
  | 'invoices'
  | 'expirations'
  | 'payments'
  | 'delivery_notes'
  | 'packing_list';

export type AdminTab = 
  | 'dashboard'
  | 'products'
  | 'orders'
  | 'invoices'
  | 'inventory'
  | 'commerce_settings'
  | 'branding_settings'
  | 'site_content'
  | 'users_roles'
  | 'vendors'
  | 'db_setup'
  | 'image_optimizer';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'ROLY',
  brandTagline: 'Casual wear, sportswear and work clothing',
  siteTitle: 'Casual wear, sportswear, work clothing and trainers | Roly',
  companyName: 'GOR FACTORY S.A.',
  taxId: 'ES-A78901234',
  address: 'Ctra. Santomera - Abanilla km 8.8, 30620 Fortuna, Murcia (Spain)',
  supportPhone: '+34 968 68 70 00',
  supportEmail: 'info@gorfactory.com',
  currency: '€',
  vatRate: 21,
  headerNotice: 'Hi, welcome to Roly',
  heroHeadline: 'Attitude. Origin. Inspiration.',
  heroSubhead: 'Discover our latest collection',
  heroDescription: 'Casual wear, sportswear, work clothing and trainers designed for every day.',
  footerDescription: 'Every year we work on the innovation and improvement of our collections, combining design, comfort and durability.',
  footerCopyrightText: 'All rights reserved.',
  primaryColor: '#f5a900',
  allowMultiVendor: true,
  logoUrl: '',
  faviconUrl: '',
  headerNavigation: [
    ...buildCategoryNavigation(CATEGORIES),
    { id: 'nav-customizer', label: 'Customizer/Printing', target: 'page:customizer', visible: true, source: 'custom' },
    { id: 'nav-catalogue', label: 'Catalogue', target: 'page:catalogs', visible: true, source: 'custom' },
    { id: 'nav-outlet', label: 'Outlet', target: 'category:outlet', visible: true, source: 'custom' },
  ],
  heroSlides: [
    {
      id: 'hero-back-to-school',
      eyebrow: 'BACK TO SCHOOL!',
      title: 'Start the school year with everything ready',
      description: 'Roly & Stamina have everything the little ones need to start the year with strength and energy.',
      imageUrl: 'https://static.gorfactory.es/images/home/VER_ESCRITORIO_VUEL_ALCOLE.jpg',
      target: 'category:featured_roly',
      ctaLabel: 'DISCOVER',
      textColor: 'light',
      showContent: true,
    },
    {
      id: 'hero-exhibitions',
      eyebrow: '',
      title: 'Upcoming Exhibitions 2026',
      description: '',
      imageUrl: 'https://static.gorfactory.es/images/home/Ferias_Septiembre_PC.jpg',
      target: 'page:contact',
      ctaLabel: '',
      textColor: 'light',
      showContent: false,
    },
    {
      id: 'hero-attitude',
      eyebrow: 'NEW COLLECTION',
      title: 'Attitude. Origin. Inspiration.',
      description: 'Discover our new collection',
      imageUrl: 'https://static.gorfactory.es/images/home/Banners_novedades_2026.jpg',
      videoUrl: 'https://static.gorfactory.es/images/home/ROLY_Intro_2026.mp4?v=2',
      target: 'category:novelty_roly',
      ctaLabel: 'NOVELTIES',
      textColor: 'light',
      showContent: true,
    },
  ],
  audienceCards: [
    { id: 'audience-men', title: 'Men', description: '', imageUrl: 'https://static.gorfactory.es/images/home/Banner_hombre_2026_04.jpg', target: 'category:t_shirts' },
    { id: 'audience-women', title: 'Women', description: '', imageUrl: 'https://static.gorfactory.es/images/home/Banner_mujer_2026_04.jpg', target: 'category:t_shirts' },
    { id: 'audience-children', title: 'Children', description: '', imageUrl: 'https://static.gorfactory.es/images/home/Banner_ninos_2026_04.jpg', target: 'category:t_shirts' },
  ],
  latestBanners: [
    { id: 'latest-catalogues', title: 'New catalogues. Unlimited.', description: 'Explore every Roly collection.', imageUrl: 'https://static.gorfactory.es/images/home/Banners_catalogo_2026.jpg', target: 'page:catalogs', ctaLabel: 'DISCOVER' },
    { id: 'latest-novelties', title: 'Novelties', description: 'Meet the newest silhouettes and colours.', imageUrl: 'https://static.gorfactory.es/images/home/Banners_novedades_2026.jpg', target: 'category:novelty_roly', ctaLabel: 'DISCOVER' },
  ],
  storyCards: [
    { id: 'story-sport', title: 'Sport collection', description: 'T-shirts, technical polo shirts, sports sets, windbreakers, trousers. All you need for training.', imageUrl: 'https://static.gorfactory.es/images/home/Banner_sportcollection_2026_04.jpg', target: 'category:sports' },
    { id: 'story-jackets', title: 'Jackets', description: 'Clothing for the coldest time of the year. Gilets, softshells, jackets and raincoats.', imageUrl: 'https://static.gorfactory.es/images/home/Banner_abrigos_2026_04.jpg', target: 'category:coats' },
    { id: 'story-shirts', title: 'T-shirts and polo shirts', description: 'Find your favourite short or long-sleeve polo or t-shirt to wear all year round.', imageUrl: 'https://static.gorfactory.es/images/home/Banner_camisetas_2026_04.jpg', target: 'category:t_shirts' },
  ],
  customizerBanner: {
    id: 'banner-customizer',
    title: '3D Quote generator',
    description: 'Create your designs, view them in real time and place your order instantly.',
    imageUrl: 'https://static.gorfactory.es/images/home/Banner_cotizadorAbril_2026.jpg',
    target: 'page:customizer',
    ctaLabel: 'START',
  },
  showCustomizerBanner: false,
  workwearBanner: {
    id: 'banner-workwear',
    title: 'ROLY WORK',
    description: 'Uniforms and workwear built for safe, comfortable performance.',
    imageUrl: 'https://static.gorfactory.es/images/home/Banner_WRK_Footwear_2026.jpg',
    target: 'category:workwear',
    ctaLabel: 'DISCOVER ROLY WORK',
  },
  brandVideoSlides: [
    {
      id: 'video-roly-2026',
      title: 'Attitude. Origin. Inspiration.',
      description: 'Discover the collection in motion.',
      videoUrl: 'https://static.gorfactory.es/images/home/ROLY_Intro_2026.mp4',
      posterUrl: 'https://static.gorfactory.es/images/home/Banners_novedades_2026.jpg',
      target: 'category:novelty_roly',
      ctaLabel: 'DISCOVER ROLY',
      textColor: 'light',
    },
    {
      id: 'video-workwear-2026',
      title: 'Uniforms made to perform.',
      description: 'Safety, comfort and movement for every working day.',
      videoUrl: 'https://static.gorfactory.es/images/home/Workwear_Intro_2026_2.mp4',
      posterUrl: 'https://static.gorfactory.es/images/home/Banner_WRK_Footwear_2026.jpg',
      target: 'category:workwear',
      ctaLabel: 'DISCOVER WORKWEAR',
      textColor: 'light',
    },
  ],
  workwearVideoUrl: 'https://static.gorfactory.es/images/home/Workwear_Intro_2026_2.mp4',
  workwearVideoPosterUrl: 'https://static.gorfactory.es/images/home/Banner_WRK_Footwear_2026.jpg',
  featuredRolyProductCodes: ['CA6681', 'PO6638', 'SU1104', 'CQ6439', 'RD6665', 'PE0001'],
  featuredWorkwearProductCodes: ['HV9300', 'PA9205', 'RD6665', 'BA9092'],
  productCarouselIntervalMs: 4200,
  certificationLogos: [
    'https://static.gorfactory.es/images/home/Iconos/ILO.png',
    'https://static.gorfactory.es/images/home/Iconos/ISO%2014001.png',
    'https://static.gorfactory.es/images/home/Iconos/OEKO%20TEX%20100.png',
    'https://static.gorfactory.es/images/home/Iconos/GOTS.png',
    'https://static.gorfactory.es/images/home/Iconos/AEO.png',
    'https://static.gorfactory.es/images/home/Iconos/ISO%209001.png',
  ],
  footerColumns: [
    { id: 'footer-service', title: 'SERVICE', links: [
      { id: 'footer-catalog', label: 'Virtual catalog', target: 'page:catalogs', visible: true },
      { id: 'footer-sizes', label: 'Size guide', target: 'page:sizes_guide', visible: true },
      { id: 'footer-faq', label: 'Frequently asked questions', target: 'page:faq', visible: true },
    ] },
    { id: 'footer-company', title: 'COMPANY', links: [
      { id: 'footer-quality', label: 'Quality and certifications', target: 'page:quality', visible: true },
      { id: 'footer-contact', label: 'Contact us', target: 'page:contact', visible: true },
      { id: 'footer-admin', label: 'Super Admin', target: 'page:admin', visible: true },
    ] },
    { id: 'footer-legal', title: 'LEGAL', links: [
      { id: 'footer-privacy', label: 'Privacy policy', target: 'page:privacy_policy', visible: true },
      { id: 'footer-terms', label: 'Terms and conditions', target: 'page:terms', visible: true },
      { id: 'footer-cookies', label: 'Cookies', target: 'page:cookies', visible: true },
    ] },
  ],
};

export const DEFAULT_COMMERCE_SETTINGS: CommerceSettings = {
  orderPrefix: 'ROLY',
  lowStockThreshold: 25,
  stockHoldMinutes: 30,
  allowBackorders: false,
  taxInclusivePricing: false,
  requireTermsAcceptance: true,
  operationsEmail: 'orders@gorfactory.com',
  paymentMethods: [
    {
      id: 'sepa_30',
      name: 'SEPA B2B Direct Debit (30 Days Net)',
      description: 'Approved business accounts are charged on 30-day terms.',
      enabled: true,
      type: 'invoice',
      provider: 'SEPA',
      feePercent: 0,
      credentialsConfigured: true,
    },
    {
      id: 'credit_card',
      name: 'Corporate Credit / Debit Card',
      description: 'Instant authorization using the configured payment provider.',
      enabled: true,
      type: 'gateway',
      provider: 'Redsys / 3D Secure',
      publicKey: '',
      webhookUrl: '/api/payments/webhook',
      feePercent: 0,
      credentialsConfigured: false,
    },
    {
      id: 'bank_transfer',
      name: 'Bank Wire Pre-payment',
      description: 'The order is released after payment confirmation.',
      enabled: true,
      type: 'bank_transfer',
      provider: 'Bank transfer',
      instructions: 'Use the order number as the bank transfer reference.',
      feePercent: 0,
      credentialsConfigured: true,
    },
  ],
  shippingMethods: [
    { id: 'gls_express', name: 'GLS Express EuroFreight', description: 'Tracked door-to-door delivery.', enabled: true, carrier: 'GLS Logistics EuroFreight', price: 12.5, freeAbove: 250, estimatedDays: '1–2 business days' },
    { id: 'dhl_pallet', name: 'DHL EuroConnect Pallet', description: 'Bulk pallet delivery for high-volume orders.', enabled: true, carrier: 'DHL EuroConnect Pallet', price: 45, freeAbove: 1000, estimatedDays: '2–4 business days' },
    { id: 'alicante_pickup', name: 'Central Hub Pickup', description: 'Collect from the configured warehouse.', enabled: true, carrier: 'Customer pickup', price: 0, freeAbove: 0, estimatedDays: 'Ready in 1 business day' },
  ],
};

export const DEFAULT_VENDORS: Vendor[] = [
  {
    id: 'ven-1',
    name: 'Gor Factory Direct (Alicante Hub)',
    code: 'GOR-01',
    email: 'hub@gorfactory.com',
    phone: '+34 968 68 70 00',
    country: 'Spain',
    rating: 4.9,
    commissionRate: 5.0,
    status: 'active',
    totalProducts: 142,
    totalSales: 842000,
    joinedDate: '2022-01-15',
  },
  {
    id: 'ven-2',
    name: 'TexPrint Iberia Screen & Embroidery Labs',
    code: 'TXP-02',
    email: 'production@texprint.es',
    phone: '+34 963 12 34 56',
    country: 'Spain',
    rating: 4.8,
    commissionRate: 8.5,
    status: 'active',
    totalProducts: 48,
    totalSales: 210500,
    joinedDate: '2023-04-10',
  },
  {
    id: 'ven-3',
    name: 'EcoThreads Organic Apparel Co.',
    code: 'ECO-03',
    email: 'contact@ecothreads.pt',
    phone: '+351 22 987 654',
    country: 'Portugal',
    rating: 5.0,
    commissionRate: 7.0,
    status: 'active',
    totalProducts: 36,
    totalSales: 165000,
    joinedDate: '2024-02-20',
  },
  {
    id: 'ven-4',
    name: 'Nordic WRK & Safety Uniforms',
    code: 'NDK-04',
    email: 'b2b@nordicwrk.se',
    phone: '+46 31 555 0192',
    country: 'Sweden',
    rating: 4.7,
    commissionRate: 9.0,
    status: 'active',
    totalProducts: 29,
    totalSales: 198400,
    joinedDate: '2024-08-01',
  },
];

export const DEFAULT_USERS: AppUser[] = [
  { id: 'owner-1', name: 'Platform Owner', email: 'owner@local.invalid', company: 'ROLY Platform', role: 'super_admin', status: 'active', isBootstrapOwner: true, createdAt: '2026-01-01', lastLogin: new Date().toISOString() },
  { id: 'admin-1', name: 'Operations Administrator', email: 'admin@local.invalid', company: 'ROLY Operations', role: 'super_admin', status: 'active', isBootstrapOwner: false, createdAt: '2026-02-01' },
  { id: 'client-1', name: 'María López', email: 'maria@example.com', company: 'Textiles Europa S.L.', role: 'client', status: 'active', isBootstrapOwner: false, createdAt: '2026-05-12' },
  { id: 'vendor-user-1', name: 'Factory Manager', email: 'factory@example.com', company: 'Gor Factory Direct', role: 'vendor', status: 'active', isBootstrapOwner: false, createdAt: '2026-04-03' },
  { id: 'logistics-1', name: 'Warehouse Operator', email: 'warehouse@example.com', company: 'ROLY Logistics', role: 'logistics_admin', status: 'active', isBootstrapOwner: false, createdAt: '2026-06-20' },
];

interface StoreContextType {
  // Navigation
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedCategorySlug: string;
  setSelectedCategorySlug: (slug: string) => void;
  selectedSubcategorySlug: string;
  setSelectedSubcategorySlug: (slug: string) => void;
  selectedModelCode: string;
  setSelectedModelCode: (code: string) => void;
  clientAreaTab: ClientAreaTab;
  setClientAreaTab: (tab: ClientAreaTab) => void;
  documentSubTab: DocumentSubTab;
  setDocumentSubTab: (subTab: DocumentSubTab) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  trackedOrderId: string;
  setTrackedOrderId: (id: string) => void;

  // Roles & Super Admin
  userRole: UserRole;
  currentUser: AppUser;
  users: AppUser[];
  registerClient: (user: Pick<AppUser, 'name' | 'email' | 'company'> & { password: string }) => boolean;
  resetUserPassword: (userId: string, password: string) => boolean;
  updateUserRole: (userId: string, role: UserRole) => boolean;
  updateUserStatus: (userId: string, status: AppUser['status']) => boolean;

  // Categories are the source for the public parent/submenu tree
  catalogCategories: CatalogCategory[];
  setCatalogCategories: React.Dispatch<React.SetStateAction<CatalogCategory[]>>;
  syncNavigationFromCategories: (categories?: CatalogCategory[]) => void;

  // Site Settings & White-Label Customization
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  resetSiteSettings: () => void;
  commerceSettings: CommerceSettings;
  updateCommerceSettings: (settings: CommerceSettings) => void;

  // Vendors
  vendors: Vendor[];
  setVendors: React.Dispatch<React.SetStateAction<Vendor[]>>;
  addVendor: (vendor: Omit<Vendor, 'id' | 'totalProducts' | 'totalSales' | 'joinedDate'>) => void;
  updateVendorStatus: (vendorId: string, status: 'active' | 'pending' | 'suspended') => void;

  // Settings & Preferences
  language: Language;
  setLanguage: (lang: Language) => void;
  displayPrices: boolean;
  setDisplayPrices: (display: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Catalog & Data
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  proposals: Proposal[];
  setProposals: React.Dispatch<React.SetStateAction<Proposal[]>>;
  stockNotices: StockNotice[];
  setStockNotices: React.Dispatch<React.SetStateAction<StockNotice[]>>;
  addresses: Address[];
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
  clientProfile: ClientProfile;
  setClientProfile: React.Dispatch<React.SetStateAction<ClientProfile>>;
  favorites: string[];
  toggleFavorite: (modelCode: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  updateCartItemQuantity: (index: number, size: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Invoice & Packing List Modal
  activeDocumentModal: {
    isOpen: boolean;
    type: 'invoice' | 'packing_list' | 'delivery_note' | 'proposal';
    order?: Order;
    proposal?: Proposal;
  };
  openDocumentModal: (type: 'invoice' | 'packing_list' | 'delivery_note' | 'proposal', order?: Order, proposal?: Proposal) => void;
  closeDocumentModal: () => void;

  // MySQL Setup & Config
  mysqlConfig: MySQLConfig;
  setMysqlConfig: React.Dispatch<React.SetStateAction<MySQLConfig>>;
  testMySQLConnection: (config: Partial<MySQLConfig>) => Promise<boolean>;
  showDbSetupModal: boolean;
  setShowDbSetupModal: (show: boolean) => void;
  showFirstTimeWizard: boolean;
  setShowFirstTimeWizard: (show: boolean) => void;
  completeFirstTimeMySQLSetup: (config: Partial<MySQLConfig>) => Promise<void>;

  // Sales Representative Modal
  showSalesRepModal: boolean;
  setShowSalesRepModal: (show: boolean) => void;

  // Notification Toast
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;

  // Helper route jump
  navigateToProduct: (modelCode: string) => void;
  navigateToCategory: (slug: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('t_shirts');
  const [selectedSubcategorySlug, setSelectedSubcategorySlug] = useState<string>('');
  const [selectedModelCode, setSelectedModelCode] = useState<string>('CA6681');
  const [clientAreaTab, setClientAreaTab] = useState<ClientAreaTab>('documents');
  const [documentSubTab, setDocumentSubTab] = useState<DocumentSubTab>('packing_list');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [trackedOrderId, setTrackedOrderId] = useState<string>('ord-1');
  const [catalogCategories, setCatalogCategories] = useState<CatalogCategory[]>(() => {
    const saved = localStorage.getItem('roly_catalog_categories');
    try { return saved ? JSON.parse(saved) : CATEGORIES; } catch { return CATEGORIES; }
  });
  const [users, setUsers] = useState<AppUser[]>(() => {
    const saved = localStorage.getItem('roly_users');
    try {
      const parsed = saved ? JSON.parse(saved) as AppUser[] : DEFAULT_USERS;
      const withOwner = parsed.some((user) => user.isBootstrapOwner) ? parsed : [DEFAULT_USERS[0], ...parsed];
      return withOwner.some((user) => user.id === 'admin-1') ? withOwner : [withOwner[0], DEFAULT_USERS[1], ...withOwner.slice(1)];
    } catch { return DEFAULT_USERS; }
  });
  const currentUser = users.find((user) => user.isBootstrapOwner) || DEFAULT_USERS[0];
  const userRole = currentUser.role;

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('roly_language');
    return saved && ['EN', 'ES', 'FR', 'DE', 'IT', 'PT'].includes(saved) ? saved as Language : 'EN';
  });
  const setLanguage = (nextLanguage: Language) => {
    setLanguageState(nextLanguage);
    localStorage.setItem('roly_language', nextLanguage);
  };
  const [displayPrices, setDisplayPrices] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('roly_site_settings');
    if (!saved) return DEFAULT_SITE_SETTINGS;

    try {
      const parsed = JSON.parse(saved) as Partial<SiteSettings>;
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        headerNavigation: (() => {
          const savedNavigation = parsed.headerNavigation || [];
          const requiredNavigation = DEFAULT_SITE_SETTINGS.headerNavigation.map((defaultItem) => {
            const savedItem = savedNavigation.find((item) => item.id === defaultItem.id || item.target === defaultItem.target);
            return savedItem ? { ...defaultItem, ...savedItem, children: savedItem.children || defaultItem.children } : defaultItem;
          });
          const categoryTargets = new Set(CATEGORIES.map((category) => `category:${category.slug}`));
          const customNavigation = savedNavigation.filter((item) => !DEFAULT_SITE_SETTINGS.headerNavigation.some((defaultItem) => defaultItem.id === item.id || defaultItem.target === item.target) && !categoryTargets.has(item.target));
          return [...requiredNavigation, ...customNavigation];
        })(),
        heroSlides: (() => {
          const obsoleteHeroIds = new Set(['hero-workwear', 'hero-summer-workwear']);
          const savedSlides = (parsed.heroSlides || []).filter((slide) => !obsoleteHeroIds.has(slide.id));
          const requiredSlides = DEFAULT_SITE_SETTINGS.heroSlides.map((defaultSlide) => {
            const savedSlide = savedSlides.find((slide) => slide.id === defaultSlide.id);
            return savedSlide ? { ...defaultSlide, ...savedSlide } : defaultSlide;
          });
          const customSlides = savedSlides.filter((slide) => !DEFAULT_SITE_SETTINGS.heroSlides.some((defaultSlide) => defaultSlide.id === slide.id));
          const slides = [...requiredSlides, ...customSlides];
          if (slides[0]?.imageUrl && slides[1]?.imageUrl && slides[0].imageUrl === slides[1].imageUrl) {
            slides[0] = { ...slides[0], imageUrl: DEFAULT_SITE_SETTINGS.heroSlides[0].imageUrl };
            slides[1] = { ...slides[1], imageUrl: DEFAULT_SITE_SETTINGS.heroSlides[1].imageUrl };
          }
          return slides;
        })(),
        audienceCards: parsed.audienceCards || DEFAULT_SITE_SETTINGS.audienceCards,
        latestBanners: parsed.latestBanners || DEFAULT_SITE_SETTINGS.latestBanners,
        storyCards: parsed.storyCards || DEFAULT_SITE_SETTINGS.storyCards,
        customizerBanner: { ...DEFAULT_SITE_SETTINGS.customizerBanner, ...parsed.customizerBanner },
        showCustomizerBanner: parsed.showCustomizerBanner ?? DEFAULT_SITE_SETTINGS.showCustomizerBanner,
        workwearBanner: { ...DEFAULT_SITE_SETTINGS.workwearBanner, ...parsed.workwearBanner },
        brandVideoSlides: parsed.brandVideoSlides || DEFAULT_SITE_SETTINGS.brandVideoSlides,
        workwearVideoUrl: parsed.workwearVideoUrl || DEFAULT_SITE_SETTINGS.workwearVideoUrl,
        workwearVideoPosterUrl: parsed.workwearVideoPosterUrl || DEFAULT_SITE_SETTINGS.workwearVideoPosterUrl,
        featuredRolyProductCodes: parsed.featuredRolyProductCodes || DEFAULT_SITE_SETTINGS.featuredRolyProductCodes,
        featuredWorkwearProductCodes: parsed.featuredWorkwearProductCodes || DEFAULT_SITE_SETTINGS.featuredWorkwearProductCodes,
        productCarouselIntervalMs: parsed.productCarouselIntervalMs || DEFAULT_SITE_SETTINGS.productCarouselIntervalMs,
        certificationLogos: parsed.certificationLogos || DEFAULT_SITE_SETTINGS.certificationLogos,
        footerColumns: parsed.footerColumns || DEFAULT_SITE_SETTINGS.footerColumns,
      };
    } catch {
      return DEFAULT_SITE_SETTINGS;
    }
  });
  const [commerceSettings, setCommerceSettings] = useState<CommerceSettings>(() => {
    const saved = localStorage.getItem('roly_commerce_settings');
    if (!saved) return DEFAULT_COMMERCE_SETTINGS;
    try {
      const parsed = JSON.parse(saved) as Partial<CommerceSettings>;
      return {
        ...DEFAULT_COMMERCE_SETTINGS,
        ...parsed,
        paymentMethods: parsed.paymentMethods || DEFAULT_COMMERCE_SETTINGS.paymentMethods,
        shippingMethods: parsed.shippingMethods || DEFAULT_COMMERCE_SETTINGS.shippingMethods,
      };
    } catch {
      return DEFAULT_COMMERCE_SETTINGS;
    }
  });

  // Vendors
  const [vendors, setVendors] = useState<Vendor[]>(() => {
    const saved = localStorage.getItem('roly_vendors');
    return saved ? JSON.parse(saved) : DEFAULT_VENDORS;
  });

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('roly_products');
    return saved ? JSON.parse(saved) : MOCK_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('roly_orders');
    return saved ? JSON.parse(saved) : MOCK_ORDERS;
  });

  const [proposals, setProposals] = useState<Proposal[]>(MOCK_PROPOSALS);
  const [stockNotices, setStockNotices] = useState<StockNotice[]>(MOCK_STOCK_NOTICES);
  const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);
  const [clientProfile, setClientProfile] = useState<ClientProfile>(MOCK_CLIENT_PROFILE);
  const [favorites, setFavorites] = useState<string[]>(['CA6681', 'PO6638']);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('roly_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeDocumentModal, setActiveDocumentModal] = useState<{
    isOpen: boolean;
    type: 'invoice' | 'packing_list' | 'delivery_note' | 'proposal';
    order?: Order;
    proposal?: Proposal;
  }>({
    isOpen: false,
    type: 'packing_list',
  });

  const [mysqlConfig, setMysqlConfig] = useState<MySQLConfig>(() => {
    const saved = localStorage.getItem('roly_mysql_config');
    if (saved) {
      try { return { ...JSON.parse(saved), connected: false, isInitialized: false }; } catch { /* use safe demo defaults below */ }
    }
    return {
      host: 'localhost',
      port: 3306,
      database: 'roly_b2b_ecommerce',
      user: 'roly_admin',
      password: '••••••••••••',
      ssl: true,
      connected: false,
      isInitialized: false,
      firstTimeSetupCompleted: false,
      tablePrefix: 'roly_',
      lastTested: new Date().toISOString(),
    };
  });

  // Check if first-time MySQL setup wizard is required
  const [showFirstTimeWizard, setShowFirstTimeWizard] = useState<boolean>(() => {
    const isDone = localStorage.getItem('roly_first_time_mysql_done');
    return isDone !== 'true';
  });

  const [showDbSetupModal, setShowDbSetupModal] = useState<boolean>(false);
  const [showSalesRepModal, setShowSalesRepModal] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('roly_site_settings', JSON.stringify(siteSettings));
    document.title = siteSettings.siteTitle;
    document.documentElement.style.setProperty('--color-primary', siteSettings.primaryColor);

    const existingFavicon = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
    if (siteSettings.faviconUrl) {
      const favicon = existingFavicon || document.createElement('link');
      favicon.rel = 'icon';
      favicon.href = siteSettings.faviconUrl;
      if (!existingFavicon) document.head.appendChild(favicon);
    }
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('roly_commerce_settings', JSON.stringify(commerceSettings));
  }, [commerceSettings]);

  useEffect(() => {
    localStorage.setItem('roly_vendors', JSON.stringify(vendors));
  }, [vendors]);

  useEffect(() => {
    localStorage.setItem('roly_catalog_categories', JSON.stringify(catalogCategories));
  }, [catalogCategories]);

  useEffect(() => {
    localStorage.setItem('roly_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('roly_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('roly_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('roly_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('roly_mysql_config', JSON.stringify(mysqlConfig));
  }, [mysqlConfig]);

  const updateSiteSettings = (newSettings: Partial<SiteSettings>) => {
    setSiteSettings(prev => ({ ...prev, ...newSettings }));
    showToast('Branding and site texts updated across the entire platform!', 'success');
  };

  const resetSiteSettings = () => {
    setSiteSettings(DEFAULT_SITE_SETTINGS);
    showToast('Restored default ROLY branding and texts', 'info');
  };

  const updateCommerceSettings = (settings: CommerceSettings) => {
    setCommerceSettings(settings);
    showToast('Commerce, payment and delivery settings saved', 'success');
  };

  const addVendor = (vendorData: Omit<Vendor, 'id' | 'totalProducts' | 'totalSales' | 'joinedDate'>) => {
    const newVendor: Vendor = {
      ...vendorData,
      id: `ven-${Date.now()}`,
      totalProducts: 0,
      totalSales: 0,
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setVendors(prev => [newVendor, ...prev]);
    showToast(`Vendor ${vendorData.name} registered successfully!`, 'success');
  };

  const updateVendorStatus = (vendorId: string, status: 'active' | 'pending' | 'suspended') => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status } : v));
    showToast(`Vendor status updated to ${status}`, 'info');
  };

  const syncNavigationFromCategories = (categories: CatalogCategory[] = catalogCategories) => {
    const customLinks = siteSettings.headerNavigation.filter((item) => item.source !== 'category' && !item.categoryId);
    setSiteSettings((current) => ({ ...current, headerNavigation: [...buildCategoryNavigation(categories), ...customLinks] }));
    showToast('Main menu and submenus synced from categories', 'success');
  };

  const registerClient = (userData: Pick<AppUser, 'name' | 'email' | 'company'> & { password: string }): boolean => {
    const normalizedEmail = userData.email.trim().toLowerCase();
    if (users.some((user) => user.email.toLowerCase() === normalizedEmail)) {
      showToast('A user with this email already exists', 'error');
      return false;
    }
    if (userData.password.length < 8) {
      showToast('Password must contain at least 8 characters', 'error');
      return false;
    }
    const { password, ...safeUserData } = userData;
    void password; // Plain-text passwords must never enter localStorage or the user list.
    setUsers((current) => [...current, {
      ...safeUserData,
      email: normalizedEmail,
      id: `user-${Date.now()}`,
      role: 'client',
      status: 'active',
      isBootstrapOwner: false,
      passwordConfigured: true,
      createdAt: new Date().toISOString().split('T')[0],
    }]);
    showToast('User registered as Client. An administrator can change the role later.', 'success');
    return true;
  };

  const resetUserPassword = (userId: string, password: string): boolean => {
    const target = users.find((user) => user.id === userId);
    if (!target) return false;
    if (password.length < 8) {
      showToast('Password must contain at least 8 characters', 'error');
      return false;
    }
    setUsers((current) => current.map((user) => user.id === userId ? { ...user, passwordConfigured: true } : user));
    showToast(`Password reset prepared for ${target.name}. The production PHP API will store only its hash.`, 'success');
    return true;
  };

  const updateUserRole = (userId: string, role: UserRole): boolean => {
    const target = users.find((user) => user.id === userId);
    if (!target) return false;
    if (target.isBootstrapOwner) {
      showToast('The protected bootstrap owner cannot be demoted', 'error');
      return false;
    }
    if (role === 'super_admin' && !currentUser.isBootstrapOwner) {
      showToast('Only the bootstrap owner can grant Super Admin access', 'error');
      return false;
    }
    setUsers((current) => current.map((user) => user.id === userId ? { ...user, role } : user));
    showToast(`${target.name} is now ${role.replace('_', ' ')}`, 'success');
    return true;
  };

  const updateUserStatus = (userId: string, status: AppUser['status']): boolean => {
    const target = users.find((user) => user.id === userId);
    if (!target) return false;
    if (target.isBootstrapOwner) {
      showToast('The protected bootstrap owner cannot be suspended', 'error');
      return false;
    }
    setUsers((current) => current.map((user) => user.id === userId ? { ...user, status } : user));
    showToast(`${target.name} status changed to ${status}`, 'info');
    return true;
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const toggleFavorite = (modelCode: string) => {
    setFavorites(prev => {
      if (prev.includes(modelCode)) {
        showToast(`Removed model ${modelCode} from favourites`, 'info');
        return prev.filter(c => c !== modelCode);
      } else {
        showToast(`Added model ${modelCode} to favourites`, 'success');
        return [...prev, modelCode];
      }
    });
  };

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existingIdx = prev.findIndex(
        i => i.productId === item.productId && i.colorName === item.colorName && !i.customization
      );
      if (existingIdx > -1 && !item.customization) {
        const updated = [...prev];
        const current = updated[existingIdx];
        const newBreakdown = { ...current.sizeBreakdown };
        Object.entries(item.sizeBreakdown).forEach(([size, qty]) => {
          newBreakdown[size] = (newBreakdown[size] || 0) + qty;
        });
        const newTotalQty: number = (Object.values(newBreakdown) as number[]).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
        current.sizeBreakdown = newBreakdown;
        current.totalQuantity = newTotalQty;
        current.totalPrice = newTotalQty * current.unitPrice;
        return updated;
      }
      return [...prev, item];
    });
    showToast(`Added ${item.totalQuantity} pcs of ${item.modelCode} to cart!`, 'success');
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
    showToast('Item removed from cart', 'info');
  };

  const updateCartItemQuantity = (index: number, size: string, quantity: number) => {
    setCart(prev => {
      const updated = [...prev];
      const item = updated[index];
      if (!item) return prev;
      if (quantity <= 0) {
        delete item.sizeBreakdown[size];
      } else {
        item.sizeBreakdown[size] = quantity;
      }
      item.totalQuantity = (Object.values(item.sizeBreakdown) as number[]).reduce((a: number, b: number) => a + (Number(b) || 0), 0);
      item.totalPrice = item.totalQuantity * item.unitPrice;
      if (item.totalQuantity === 0) {
        return updated.filter((_, idx) => idx !== index);
      }
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.totalQuantity, 0);

  const openDocumentModal = (type: 'invoice' | 'packing_list' | 'delivery_note' | 'proposal', order?: Order, proposal?: Proposal) => {
    setActiveDocumentModal({
      isOpen: true,
      type,
      order: order || orders[0],
      proposal: proposal || proposals[0],
    });
  };

  const closeDocumentModal = () => {
    setActiveDocumentModal(prev => ({ ...prev, isOpen: false }));
  };

  const testMySQLConnection = async (config: Partial<MySQLConfig>): Promise<boolean> => {
    const apiBase = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '');
    try {
      const response = await fetch(`${apiBase}/health.php`, { headers: { Accept: 'application/json' }, credentials: 'same-origin' });
      const result = await response.json() as { ok?: boolean; database?: { connected?: boolean; migration?: string | null }; message?: string };
      if (!response.ok || !result.ok || !result.database?.connected) throw new Error(result.message || 'Database health check failed');
      setMysqlConfig(prev => ({
        ...prev,
        ...config,
        password: '',
        connected: true,
        isInitialized: Boolean(result.database?.migration),
        lastTested: new Date().toISOString(),
      }));
      showToast(`Hosting API connected to MySQL${result.database?.migration ? ` · ${result.database.migration}` : ''}`, 'success');
      return true;
    } catch (error) {
      setMysqlConfig(prev => ({ ...prev, connected: false, isInitialized: false, lastTested: new Date().toISOString() }));
      showToast(error instanceof Error ? error.message : 'Could not reach the hosting PHP API', 'error');
      return false;
    }
  };

  const completeFirstTimeMySQLSetup = async (config: Partial<MySQLConfig>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 900));
    setMysqlConfig(prev => ({
      ...prev,
      ...config,
      password: '',
      connected: false,
      isInitialized: false,
      firstTimeSetupCompleted: true,
      lastTested: new Date().toISOString(),
    }));
    localStorage.setItem('roly_first_time_mysql_done', 'true');
    setShowFirstTimeWizard(false);
    showToast('Configuration saved in demo mode. Use a backend migration to initialize MySQL.', 'info');
  };

  const navigateToProduct = (modelCode: string) => {
    setSelectedModelCode(modelCode);
    setActivePage('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (slug: string) => {
    const [categorySlug, subcategorySlug = ''] = slug.split('/');
    setSelectedCategorySlug(categorySlug);
    setSelectedSubcategorySlug(subcategorySlug);
    setActivePage('category');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <StoreContext.Provider
      value={{
        activePage,
        setActivePage,
        selectedCategorySlug,
        setSelectedCategorySlug,
        selectedSubcategorySlug,
        setSelectedSubcategorySlug,
        selectedModelCode,
        setSelectedModelCode,
        clientAreaTab,
        setClientAreaTab,
        documentSubTab,
        setDocumentSubTab,
        adminTab,
        setAdminTab,
        trackedOrderId,
        setTrackedOrderId,
        userRole,
        currentUser,
        users,
        registerClient,
        resetUserPassword,
        updateUserRole,
        updateUserStatus,
        catalogCategories,
        setCatalogCategories,
        syncNavigationFromCategories,
        siteSettings,
        updateSiteSettings,
        resetSiteSettings,
        commerceSettings,
        updateCommerceSettings,
        vendors,
        setVendors,
        addVendor,
        updateVendorStatus,
        language,
        setLanguage,
        displayPrices,
        setDisplayPrices,
        searchQuery,
        setSearchQuery,
        products,
        setProducts,
        orders,
        setOrders,
        proposals,
        setProposals,
        stockNotices,
        setStockNotices,
        addresses,
        setAddresses,
        clientProfile,
        setClientProfile,
        favorites,
        toggleFavorite,
        cart,
        addToCart,
        removeFromCart,
        updateCartItemQuantity,
        clearCart,
        cartTotal,
        cartItemCount,
        activeDocumentModal,
        openDocumentModal,
        closeDocumentModal,
        mysqlConfig,
        setMysqlConfig,
        testMySQLConnection,
        showDbSetupModal,
        setShowDbSetupModal,
        showFirstTimeWizard,
        setShowFirstTimeWizard,
        completeFirstTimeMySQLSetup,
        showSalesRepModal,
        setShowSalesRepModal,
        toast,
        showToast,
        navigateToProduct,
        navigateToCategory,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
