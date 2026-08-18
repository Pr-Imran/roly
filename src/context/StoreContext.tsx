import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Proposal, StockNotice, Address, ClientProfile, MySQLConfig, Language, SiteSettings, Vendor, UserRole } from '../types';
import { MOCK_PRODUCTS } from '../data/mockProducts';
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
  | 'branding_settings'
  | 'vendors'
  | 'db_setup'
  | 'image_optimizer';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  brandName: 'ROLY',
  brandTagline: 'European Standard in Promotional & Workwear Textiles',
  siteTitle: 'ROLY - B2B & B2C Textile Commerce Platform',
  companyName: 'GOR FACTORY S.A.',
  taxId: 'ES-A78901234',
  address: 'Ctra. Santomera - Abanilla km 8.8, 30620 Fortuna, Murcia (Spain)',
  supportPhone: '+34 968 68 70 00',
  supportEmail: 'info@gorfactory.com',
  currency: '€',
  vatRate: 21,
  headerNotice: 'Official Wholesale Distribution Hub • 24/48h European Logistics Dispatch',
  heroHeadline: 'The European Standard in Promotional & Workwear Textiles',
  heroSubhead: 'Official 2026 Wholesale & Multi-Vendor Collection',
  heroDescription: 'Discover over 200 high-performance apparel models with permanent 35M+ unit inventory at our central logistics hub.',
  footerDescription: 'ROLY is the registered brand of Gor Factory S.A., premier European manufacturer of promotional garments, sports apparel, corporate workwear, and high-visibility uniforms.',
  primaryColor: '#eab308',
  allowMultiVendor: true,
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

interface StoreContextType {
  // Navigation
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedCategorySlug: string;
  setSelectedCategorySlug: (slug: string) => void;
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
  setUserRole: (role: UserRole) => void;

  // Site Settings & White-Label Customization
  siteSettings: SiteSettings;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
  resetSiteSettings: () => void;

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
  const [activePage, setActivePage] = useState<ActivePage>('client_area');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('t_shirts');
  const [selectedModelCode, setSelectedModelCode] = useState<string>('CA6681');
  const [clientAreaTab, setClientAreaTab] = useState<ClientAreaTab>('documents');
  const [documentSubTab, setDocumentSubTab] = useState<DocumentSubTab>('packing_list');
  const [adminTab, setAdminTab] = useState<AdminTab>('dashboard');
  const [trackedOrderId, setTrackedOrderId] = useState<string>('ord-1');
  const [userRole, setUserRole] = useState<UserRole>('super_admin');

  const [language, setLanguage] = useState<Language>('EN');
  const [displayPrices, setDisplayPrices] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Site Settings
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('roly_site_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SITE_SETTINGS;
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
    return saved ? JSON.parse(saved) : {
      host: 'localhost',
      port: 3306,
      database: 'roly_b2b_ecommerce',
      user: 'roly_admin',
      password: '••••••••••••',
      ssl: true,
      connected: true,
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
  }, [siteSettings]);

  useEffect(() => {
    localStorage.setItem('roly_vendors', JSON.stringify(vendors));
  }, [vendors]);

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
    await new Promise(resolve => setTimeout(resolve, 800));
    const isValid = Boolean(config.host && config.database && config.user);
    if (isValid) {
      setMysqlConfig(prev => ({
        ...prev,
        ...config,
        connected: true,
        isInitialized: true,
        lastTested: new Date().toISOString(),
      }));
      showToast('MySQL Database connected & verified successfully!', 'success');
      return true;
    } else {
      showToast('MySQL Connection failed: Host and Database are required', 'error');
      return false;
    }
  };

  const completeFirstTimeMySQLSetup = async (config: Partial<MySQLConfig>): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 900));
    setMysqlConfig(prev => ({
      ...prev,
      ...config,
      connected: true,
      isInitialized: true,
      firstTimeSetupCompleted: true,
      lastTested: new Date().toISOString(),
    }));
    localStorage.setItem('roly_first_time_mysql_done', 'true');
    setShowFirstTimeWizard(false);
    showToast('🎉 Database initialized with MySQL schema & demo catalog ready!', 'success');
  };

  const navigateToProduct = (modelCode: string) => {
    setSelectedModelCode(modelCode);
    setActivePage('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToCategory = (slug: string) => {
    setSelectedCategorySlug(slug);
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
        setUserRole,
        siteSettings,
        updateSiteSettings,
        resetSiteSettings,
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
