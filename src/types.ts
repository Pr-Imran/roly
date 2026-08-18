export type Language = 'EN' | 'ES' | 'FR' | 'DE' | 'IT' | 'PT';

export type UserRole = 'super_admin' | 'vendor' | 'client' | 'logistics_admin';

export interface SiteSettings {
  brandName: string; // e.g. "ROLY" or custom
  brandTagline: string;
  siteTitle: string;
  companyName: string; // e.g. "GOR FACTORY S.A."
  taxId: string; // e.g. "ES-A78901234"
  address: string;
  supportPhone: string;
  supportEmail: string;
  currency: string; // e.g. "€"
  vatRate: number; // e.g. 21
  headerNotice: string;
  heroHeadline: string;
  heroSubhead: string;
  heroDescription: string;
  footerDescription: string;
  primaryColor: string;
  allowMultiVendor: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  code: string;
  email: string;
  phone: string;
  country: string;
  rating: number;
  commissionRate: number; // e.g. 8.5%
  status: 'active' | 'pending' | 'suspended';
  totalProducts: number;
  totalSales: number;
  joinedDate: string;
}

export interface ColorSwatch {
  name: string;
  code: string; // e.g. "01 White"
  hex: string;
  image?: string;
}

export interface SizeStock {
  size: string; // e.g. "XS", "S", "M", "L", "XL", "2XL", "3XL"
  stock: number;
  ean?: string;
}

export interface Product {
  id: string;
  modelCode: string; // e.g. "CA6681", "PO6638"
  name: string;
  subtitle?: string;
  category: string;
  categorySlug: string;
  subCategory?: string;
  description: string;
  features: string[];
  composition: string;
  weightGsm: number; // e.g. 150, 190, 280
  gender: 'Men' | 'Women' | 'Unisex' | 'Kids';
  sizes: string[];
  colors: ColorSwatch[];
  images: string[];
  pricePack: number; // Price per unit when buying in pack
  priceBox: number; // Price per unit when buying in box (discounted)
  priceUnit: number; // Standard single unit price
  boxQuantity: number; // e.g. 50 or 100 pcs per box
  packQuantity: number; // e.g. 5 or 10 pcs per pack
  stockMatrix: Record<string, Record<string, number>>; // colorName -> size -> stockCount
  isEco?: boolean;
  isNew?: boolean;
  isHighVis?: boolean;
  isWorkwear?: boolean;
  isOutlet?: boolean;
  cartonDimensions?: string;
  oekoTexCertified?: boolean;
  vendorId?: string;
  vendorName?: string;
}

export interface CartItem {
  productId: string;
  modelCode: string;
  productName: string;
  image: string;
  colorName: string;
  colorHex: string;
  sizeBreakdown: Record<string, number>; // size -> quantity
  totalQuantity: number;
  unitPrice: number;
  totalPrice: number;
  vendorId?: string;
  customization?: {
    technique: string;
    placement: string;
    logoUrl?: string;
    customText?: string;
    additionalCostPerUnit: number;
  };
}

export interface Address {
  id: string;
  title: string;
  isDefaultDelivery?: boolean;
  isDefaultBilling?: boolean;
  companyName: string;
  vatNumber: string;
  contactPerson: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "#402059213"
  deliveryNoteNumber?: string; // e.g. "#82212130"
  invoiceNumber?: string; // e.g. "INV-2026-08942"
  packingListNumber?: string; // e.g. "PL-210021432"
  reference: string; // Client reference e.g. "PROJECT-ALPHA"
  date: string;
  status: 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Invoiced' | 'Cancelled';
  paymentStatus: 'Paid' | 'Pending 30 Days' | 'Expired';
  dueDate?: string;
  items: CartItem[];
  subtotal: number;
  taxRate: number; // e.g. 0.21 for 21% VAT
  taxAmount: number;
  shippingCost: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  carrier?: string;
  trackingNumber?: string;
  totalBoxes?: number;
  totalPacks?: number;
  totalPieces: number;
  grossWeightKg: number;
  vendorId?: string;
}

export interface Proposal {
  id: string;
  proposalNumber: string;
  reference: string;
  date: string;
  validUntil: string;
  status: 'Open' | 'Accepted' | 'Expired';
  total: number;
  itemsCount: number;
}

export interface StockNotice {
  id: string;
  modelCode: string;
  productName: string;
  colorName: string;
  size: string;
  requestedDate: string;
  expectedDate: string;
  quantityRequested: number;
  status: 'Waiting' | 'Available' | 'Notified';
}

export interface MySQLConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl: boolean;
  connected: boolean;
  lastTested?: string;
  isInitialized: boolean;
  firstTimeSetupCompleted: boolean;
  tablePrefix: string;
}

export interface ClientProfile {
  name: string;
  clientCode: string;
  company: string;
  vatNumber: string;
  email: string;
  phone: string;
  salesRepresentative: {
    name: string;
    email: string;
    phone: string;
    skype: string;
    branch: string;
  };
  discountTier: string;
  creditLimit: number;
  availableCredit: number;
}
