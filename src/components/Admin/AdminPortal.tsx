import React, { useEffect, useState } from 'react';
import { useStore, AdminTab } from '../../context/StoreContext';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  FileText, 
  Database, 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  RefreshCw, 
  Upload, 
  Download, 
  Sliders, 
  Printer, 
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Server,
  Users,
  Building,
  Crown,
  CreditCard,
  Warehouse,
  X
} from 'lucide-react';
import { ColorSwatch, Product } from '../../types';
import { BrandingSettingsTab } from './BrandingSettingsTab';
import { VendorsTab } from './VendorsTab';
import { CommerceSettingsTab } from './CommerceSettingsTab';
import { SiteContentTab } from './SiteContentTab';
import { UserRolesTab } from './UserRolesTab';

const DEFAULT_SIZES = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const BIG_SIZE_NAMES = new Set(['XL', 'XXL', 'XXXL', '2XL', '3XL', '4XL', '5XL']);
const isBigSize = (size: string) => BIG_SIZE_NAMES.has(size.trim().toUpperCase().replace(/\s+/g, ''));
const variantSku = (modelCode: string, size: string) => `${modelCode.trim().toUpperCase().replace(/-BIG$/i, '')}${isBigSize(size) ? '-BIG' : ''}`;

export const AdminPortal: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    products,
    setProducts,
    orders,
    setOrders,
    mysqlConfig,
    testMySQLConnection,
    openDocumentModal,
    siteSettings,
    vendors,
    currentUser,
    catalogCategories,
    showToast,
  } = useStore();

  // Product Editor Form Modal State
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isNewProductModalOpen, setIsNewProductModalOpen] = useState(false);

  // Form fields
  const [formModelCode, setFormModelCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formVendorId, setFormVendorId] = useState('');
  const [formCategory, setFormCategory] = useState(catalogCategories[0]?.name || 'Uncategorized');
  const [formGsm, setFormGsm] = useState(150);
  const [formComposition, setFormComposition] = useState('100% single jersey cotton');
  const [formGender, setFormGender] = useState<'Unisex' | 'Men' | 'Women' | 'Kids'>('Unisex');
  const [formPriceUnit, setFormPriceUnit] = useState(2.50);
  const [formPricePack, setFormPricePack] = useState(2.10);
  const [formPriceBox, setFormPriceBox] = useState(1.85);
  const [formPackQty, setFormPackQty] = useState(10);
  const [formBoxQty, setFormBoxQty] = useState(100);
  const [formColors, setFormColors] = useState<ColorSwatch[]>([
    { name: '01 White', code: '01', hex: '#FFFFFF' },
    { name: '02 Black', code: '02', hex: '#1C1C1C' },
    { name: '60 Navy', code: '60', hex: '#1E293B' },
  ]);
  const [formImages, setFormImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'
  ]);
  const [formSizes, setFormSizes] = useState<string[]>(['S', 'M', 'L', 'XL', '2XL']);
  const [formStockMatrix, setFormStockMatrix] = useState<Record<string, Record<string, number>>>({});
  const [newSize, setNewSize] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [formFeatures, setFormFeatures] = useState('High durability\nOeko-Tex Standard 100\nReinforced seams\nRemovable label');
  const [formFlags, setFormFlags] = useState({ isEco: false, isNew: true, isHighVis: false, isWorkwear: false, isOutlet: false, oekoTexCertified: true });

  useEffect(() => {
    if (!isNewProductModalOpen) return undefined;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNewProductModalOpen(false);
    };
    document.addEventListener('keydown', closeOnEscape);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = previousOverflow;
    };
  }, [isNewProductModalOpen]);

  // MySQL Form State
  const [dbName, setDbName] = useState(mysqlConfig.database);
  const [isTestingDb, setIsTestingDb] = useState(false);

  // Storage Optimization stats
  const [optimizedImageCount, setOptimizedImageCount] = useState(48);
  const [savedMegabytes, setSavedMegabytes] = useState(38.4);

  const openNewProductModal = () => {
    setEditingProduct(null);
    setFormModelCode(`CA${Math.floor(1000 + Math.random() * 9000)}`);
    setFormName('NEW ROLY MODEL');
    setFormSubtitle('High-performance textile garment');
    setFormCategory(catalogCategories[0]?.name || 'Uncategorized');
    setFormGsm(180);
    setFormComposition('100% Combed ring-spun cotton');
    setFormGender('Unisex');
    setFormPriceUnit(3.50);
    setFormPricePack(2.95);
    setFormPriceBox(2.60);
    setFormPackQty(10);
    setFormBoxQty(100);
    setFormDescription('');
    setFormVendorId('');
    setFormFeatures('High durability\nOeko-Tex Standard 100\nReinforced seams\nRemovable label');
    setFormFlags({ isEco: false, isNew: true, isHighVis: false, isWorkwear: false, isOutlet: false, oekoTexCertified: true });
    const colors: ColorSwatch[] = [
      { name: '01 White', code: '01', hex: '#FFFFFF', image: '' },
      { name: '02 Black', code: '02', hex: '#1C1C1C', image: '' },
    ];
    const sizes = ['S', 'M', 'L', 'XL', '2XL'];
    setFormColors(colors);
    setFormSizes(sizes);
    setFormImages(['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80']);
    setFormStockMatrix(Object.fromEntries(colors.map((color) => [color.name, Object.fromEntries(sizes.map((size) => [size, 0]))])));
    setIsNewProductModalOpen(true);
  };

  const openEditProductModal = (product: Product) => {
    setEditingProduct(product);
    setFormModelCode(product.modelCode);
    setFormName(product.name);
    setFormSubtitle(product.subtitle || '');
    setFormDescription(product.description || '');
    setFormVendorId(product.vendorId || '');
    setFormCategory(product.category);
    setFormGsm(product.weightGsm);
    setFormComposition(product.composition);
    setFormGender(product.gender);
    setFormPriceUnit(product.priceUnit);
    setFormPricePack(product.pricePack);
    setFormPriceBox(product.priceBox);
    setFormPackQty(product.packQuantity);
    setFormBoxQty(product.boxQuantity);
    setFormColors(product.colors);
    setFormImages(product.images);
    setFormSizes(product.sizes);
    setFormStockMatrix(product.stockMatrix);
    setFormFeatures(product.features.join('\n'));
    setFormFlags({
      isEco: Boolean(product.isEco),
      isNew: Boolean(product.isNew),
      isHighVis: Boolean(product.isHighVis),
      isWorkwear: Boolean(product.isWorkwear),
      isOutlet: Boolean(product.isOutlet),
      oekoTexCertified: Boolean(product.oekoTexCertified),
    });
    setIsNewProductModalOpen(true);
  };

  const setColorField = (index: number, field: keyof ColorSwatch, value: string) => {
    setFormColors((colors) => {
      const previousName = colors[index]?.name;
      const updated = colors.map((color, colorIndex) => colorIndex === index ? { ...color, [field]: value } : color);
      if (field === 'name' && previousName && previousName !== value) {
        setFormStockMatrix((matrix) => {
          const next = { ...matrix, [value]: matrix[previousName] || {} };
          delete next[previousName];
          return next;
        });
      }
      return updated;
    });
  };

  const setVariantStock = (colorName: string, size: string, stock: number) => {
    setFormStockMatrix((matrix) => ({
      ...matrix,
      [colorName]: { ...matrix[colorName], [size]: Math.max(0, stock || 0) },
    }));
  };

  const handleSaveProduct = () => {
    if (!formModelCode || !formName) {
      showToast('Model code and name are required', 'warning');
      return;
    }

    const cleanModelCode = formModelCode.trim().toUpperCase();
    if (products.some((product) => product.modelCode.toUpperCase() === cleanModelCode && product.id !== editingProduct?.id)) {
      showToast(`Model code ${cleanModelCode} is already in use`, 'warning');
      return;
    }
    if (formColors.length === 0 || formSizes.length === 0) {
      showToast('Add at least one colour and one size', 'warning');
      return;
    }

    const catObj = catalogCategories.find(c => c.name === formCategory) || catalogCategories[0];
    if (!catObj) {
      showToast('Create at least one category before saving a product', 'error');
      return;
    }
    const stockMatrix = Object.fromEntries(formColors.map((color) => [
      color.name,
      Object.fromEntries(formSizes.map((size) => [size, formStockMatrix[color.name]?.[size] || 0])),
    ]));
    const variantSkus = Object.fromEntries(formColors.map((color) => [
      color.name,
      Object.fromEntries(formSizes.map((size) => [size, variantSku(cleanModelCode, size)])),
    ]));

    const selectedVendor = vendors.find(v => v.id === formVendorId);

    const newProd: Product = {
      id: editingProduct ? editingProduct.id : cleanModelCode,
      modelCode: cleanModelCode,
      name: formName,
      subtitle: formSubtitle,
      category: formCategory,
      categorySlug: catObj.slug,
      description: formDescription || `${formName} - ${formSubtitle}. Certified for commercial printing and wholesale distribution.`,
      features: formFeatures.split('\n').map((feature) => feature.trim()).filter(Boolean),
      composition: formComposition,
      weightGsm: formGsm,
      gender: formGender,
      sizes: formSizes,
      colors: formColors,
      images: formImages,
      priceUnit: formPriceUnit,
      pricePack: formPricePack,
      priceBox: formPriceBox,
      packQuantity: formPackQty,
      boxQuantity: formBoxQty,
      stockMatrix,
      variantSkus,
      ...formFlags,
      cartonDimensions: '54 x 36 x 34 cm (16 kg)',
      vendorId: formVendorId || undefined,
      vendorName: selectedVendor?.name || undefined,
    };

    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? newProd : p));
      showToast(`Product ${cleanModelCode} updated successfully!`, 'success');
    } else {
      setProducts(prev => [newProd, ...prev]);
      showToast(`Product ${cleanModelCode} added to catalog!`, 'success');
    }

    setIsNewProductModalOpen(false);
  };

  const handleDeleteProduct = (id: string, code: string) => {
    if (confirm(`Are you sure you want to delete model ${code}?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast(`Model ${code} removed from database`, 'info');
    }
  };

  const handleUpdateOrderStatus = (orderId: string, status: any) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    showToast(`Order status updated to ${status}`, 'success');
  };

  const handleSaveMySQL = async () => {
    setIsTestingDb(true);
    await testMySQLConnection({ database: dbName });
    setIsTestingDb(false);
  };

  // Generate downloadable schema.sql script
  const handleDownloadSchemaSql = () => {
    const sqlContent = `-- ========================================================
-- ROLY B2B E-COMMERCE DATABASE INITIALIZATION SCHEMA (MySQL 8.0+)
-- Generated for GOR FACTORY S.A. Distribution Portal
-- ========================================================

CREATE DATABASE IF NOT EXISTS \`${dbName}\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`${dbName}\`;

-- Table 1: Categories
CREATE TABLE IF NOT EXISTS \`categories\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`slug\` VARCHAR(128) NOT NULL UNIQUE,
  \`parent_id\` VARCHAR(64) NULL,
  \`visible\` BOOLEAN DEFAULT TRUE,
  \`sort_order\` INT DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (\`parent_id\`) REFERENCES \`categories\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 2: Products & Technical Specs
CREATE TABLE IF NOT EXISTS \`products\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`model_code\` VARCHAR(32) NOT NULL UNIQUE,
  \`name\` VARCHAR(255) NOT NULL,
  \`subtitle\` VARCHAR(255),
  \`category_id\` VARCHAR(64),
  \`subcategory_id\` VARCHAR(64),
  \`composition\` TEXT,
  \`weight_gsm\` INT DEFAULT 150,
  \`gender\` ENUM('Unisex', 'Men', 'Women', 'Kids') DEFAULT 'Unisex',
  \`price_unit\` DECIMAL(10,2) NOT NULL,
  \`price_pack\` DECIMAL(10,2) NOT NULL,
  \`price_box\` DECIMAL(10,2) NOT NULL,
  \`pack_quantity\` INT DEFAULT 10,
  \`box_quantity\` INT DEFAULT 100,
  \`carton_dimensions\` VARCHAR(128),
  \`oeko_tex\` BOOLEAN DEFAULT TRUE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_category\` (\`category_id\`),
  INDEX \`idx_model\` (\`model_code\`)
) ENGINE=InnoDB;

-- Table 3: Product Color Variations & Optimized Images
CREATE TABLE IF NOT EXISTS \`product_variations\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`color_name\` VARCHAR(100) NOT NULL,
  \`color_code\` VARCHAR(20) NOT NULL,
  \`color_hex\` VARCHAR(10) NOT NULL,
  \`image_webp_optimized\` VARCHAR(512),
  \`storage_kb\` INT DEFAULT 45,
  FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Table 4: Stock Inventory Matrix (Alicante Central Hub)
CREATE TABLE IF NOT EXISTS \`inventory_stock\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`product_id\` VARCHAR(64) NOT NULL,
  \`color_code\` VARCHAR(20) NOT NULL,
  \`size\` VARCHAR(20) NOT NULL,
  \`variant_sku\` VARCHAR(64) NOT NULL,
  \`stock_count\` INT DEFAULT 0,
  \`reserved_count\` INT DEFAULT 0,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY \`unique_stock_item\` (\`product_id\`, \`color_code\`, \`size\`),
  INDEX \`idx_variant_sku\` (\`variant_sku\`)
) ENGINE=InnoDB;

-- Table 5: Orders & B2B Invoices Ledger
CREATE TABLE IF NOT EXISTS \`orders\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`order_number\` VARCHAR(64) NOT NULL UNIQUE,
  \`delivery_note_number\` VARCHAR(64),
  \`invoice_number\` VARCHAR(64),
  \`packing_list_number\` VARCHAR(64),
  \`client_reference\` VARCHAR(128),
  \`client_vat\` VARCHAR(32) NOT NULL,
  \`status\` ENUM('Pending', 'Processing', 'Dispatched', 'Delivered', 'Invoiced', 'Cancelled') DEFAULT 'Processing',
  \`payment_status\` ENUM('Paid', 'Pending 30 Days', 'Pending Payment', 'Expired', 'Refunded') DEFAULT 'Pending Payment',
  \`payment_method_id\` VARCHAR(64),
  \`subtotal\` DECIMAL(12,2) NOT NULL,
  \`shipping_cost\` DECIMAL(12,2) DEFAULT 0,
  \`payment_fee\` DECIMAL(12,2) DEFAULT 0,
  \`tax_amount\` DECIMAL(12,2) NOT NULL,
  \`total_amount\` DECIMAL(12,2) NOT NULL,
  \`total_pieces\` INT NOT NULL,
  \`total_boxes\` INT NOT NULL,
  \`gross_weight_kg\` DECIMAL(8,2) NOT NULL,
  \`carrier\` VARCHAR(128),
  \`tracking_number\` VARCHAR(128),
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 6: Administratively configured payment and shipping methods
CREATE TABLE IF NOT EXISTS \`commerce_methods\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`method_type\` ENUM('payment', 'shipping') NOT NULL,
  \`name\` VARCHAR(255) NOT NULL,
  \`provider\` VARCHAR(255),
  \`enabled\` BOOLEAN DEFAULT FALSE,
  \`public_config_json\` JSON,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Table 7: Application users. Registration must always write role='client'.
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` VARCHAR(64) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(255) NOT NULL UNIQUE,
  \`company\` VARCHAR(255) NOT NULL,
  \`password_hash\` VARCHAR(255) NOT NULL,
  \`role\` ENUM('client', 'vendor', 'logistics_admin', 'super_admin') NOT NULL DEFAULT 'client',
  \`status\` ENUM('active', 'invited', 'suspended') NOT NULL DEFAULT 'active',
  \`is_bootstrap_owner\` BOOLEAN NOT NULL DEFAULT FALSE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  \`last_login_at\` TIMESTAMP NULL,
  INDEX \`idx_user_role_status\` (\`role\`, \`status\`)
) ENGINE=InnoDB;

-- Seed exactly one protected owner in a server-side migration using deployment
-- environment values and a strong Argon2id/bcrypt hash. Never put its password here.

CREATE TABLE IF NOT EXISTS \`role_change_audit\` (
  \`id\` BIGINT AUTO_INCREMENT PRIMARY KEY,
  \`actor_user_id\` VARCHAR(64) NOT NULL,
  \`target_user_id\` VARCHAR(64) NOT NULL,
  \`old_role\` VARCHAR(32) NOT NULL,
  \`new_role\` VARCHAR(32) NOT NULL,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX \`idx_role_audit_target\` (\`target_user_id\`, \`created_at\`)
) ENGINE=InnoDB;

-- Completed schema export. Ready for MySQL execution.
`;
    const blob = new Blob([sqlContent], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `roly_schema_${dbName}.sql`;
    a.click();
    showToast('Downloaded MySQL schema script: roly_schema.sql', 'success');
  };

  // Image optimization simulation
  const handleSimulateCompression = () => {
    setOptimizedImageCount(prev => prev + 12);
    setSavedMegabytes(prev => Math.round((prev + 14.8) * 10) / 10);
    showToast('Optimized 12 garment images to WebP (-74% storage footprint)!', 'success');
  };

  if (currentUser.role !== 'super_admin' || currentUser.status !== 'active') {
    return <div className="mx-auto my-20 max-w-xl rounded-xl border border-red-200 bg-red-50 p-8 text-center"><ShieldCheck className="mx-auto h-8 w-8 text-red-600" /><h1 className="mt-3 text-xl font-black">Super Admin access required</h1><p className="mt-2 text-sm text-red-800">Your account does not have permission to open this management area.</p></div>;
  }

  return (
    <div className="w-full bg-[#f8f8f8] min-h-screen pb-20 font-sans">
      {/* Admin Top Header */}
      <div className="bg-neutral-950 text-white py-4 px-4 sm:px-8 border-b border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <span className="text-xl sm:text-2xl font-black font-sans tracking-tight uppercase">
              {siteSettings.brandName}
            </span>
            <span className="text-xs bg-yellow-400 text-black font-black px-2.5 py-1 rounded-sm uppercase tracking-wider flex items-center space-x-1">
              <Crown className="w-3.5 h-3.5 text-black" />
              <span>Super Admin ERP & Platform Master</span>
            </span>
          </div>

          {/* Right Controls: signed-in owner & MySQL indicator */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="flex items-center space-x-2 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-md">
              <span className="text-neutral-400 font-semibold">Signed in:</span>
              <strong className="text-yellow-400">{currentUser.name} · {currentUser.role.replace('_', ' ')}</strong>
            </div>

            {/* MySQL Live Indicator */}
            <div className="flex items-center space-x-1.5 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-md">
              <span className={`w-2 h-2 rounded-full ${mysqlConfig.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="font-mono text-gray-300">
                MySQL: {mysqlConfig.host}:{mysqlConfig.port}/{mysqlConfig.database}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <div className="flex flex-col md:flex-row gap-6">
          
          {/* Left Admin Navigation */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 shadow-2xs overflow-hidden text-xs font-semibold">
              
              <div className="px-4 py-2.5 bg-neutral-100/80 border-b border-gray-200 text-[10px] uppercase font-black text-neutral-500 tracking-wider">
                Management Console
              </div>

              <button
                onClick={() => setAdminTab('dashboard')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'dashboard' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard & Metrics</span>
              </button>

              <button
                onClick={() => setAdminTab('branding_settings')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'branding_settings' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Sliders className="w-4 h-4 text-yellow-500" />
                <span>Branding & Site Texts</span>
              </button>

              <button
                onClick={() => setAdminTab('site_content')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'site_content' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-purple-500" />
                <span>Pages, Menus & Media</span>
              </button>

              <button
                onClick={() => setAdminTab('users_roles')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'users_roles' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Users & Roles</span>
              </button>

              <button
                onClick={() => setAdminTab('vendors')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'vendors' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Users className="w-4 h-4 text-purple-500" />
                <span>Vendors & Factories ({vendors.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('products')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'products' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Product Variations ({products.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('inventory')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'inventory' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Warehouse className="w-4 h-4 text-emerald-500" />
                <span>Stock & Variant SKUs</span>
              </button>

              <button
                onClick={() => setAdminTab('orders')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'orders' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Processing ({orders.length})</span>
              </button>

              <button
                onClick={() => setAdminTab('invoices')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'invoices' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Invoicing & Tax Engine</span>
              </button>

              <button
                onClick={() => setAdminTab('commerce_settings')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'commerce_settings' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-sky-500" />
                <span>Payments & Delivery</span>
              </button>

              <button
                onClick={() => setAdminTab('db_setup')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors border-b border-gray-100 ${
                  adminTab === 'db_setup' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Database className="w-4 h-4 text-sky-500" />
                <span>MySQL Database Setup</span>
              </button>

              <button
                onClick={() => setAdminTab('image_optimizer')}
                className={`w-full text-left px-4 py-3 flex items-center space-x-2.5 transition-colors ${
                  adminTab === 'image_optimizer' ? 'bg-black text-white font-bold' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span>Image Storage Optimizer</span>
              </button>
            </div>
          </aside>

          {/* Main Admin Tab View */}
          <main className="flex-1 bg-white rounded-xl border border-gray-200 p-6 shadow-2xs">
            
            {/* TAB: BRANDING & SITE TEXTS */}
            {adminTab === 'branding_settings' && (
              <BrandingSettingsTab />
            )}

            {adminTab === 'site_content' && (
              <SiteContentTab />
            )}

            {adminTab === 'users_roles' && (
              <UserRolesTab />
            )}

            {/* TAB: VENDORS */}
            {adminTab === 'vendors' && (
              <VendorsTab />
            )}

            {adminTab === 'commerce_settings' && (
              <CommerceSettingsTab />
            )}
            
            {/* TAB 1: DASHBOARD */}
            {adminTab === 'dashboard' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">ERP & Wholesale Overview</h2>
                  <p className="text-xs text-gray-500">Real-time status of wholesale operations, stock levels, and revenue.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-500 uppercase font-semibold text-[10px]">Monthly Sales Volume</span>
                    <p className="text-2xl font-bold font-mono text-gray-900 mt-1">118,450.00 €</p>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                      <TrendingUp className="w-3 h-3" /> +14.2% vs last month
                    </span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-500 uppercase font-semibold text-[10px]">Active B2B Orders</span>
                    <p className="text-2xl font-bold font-mono text-gray-900 mt-1">{orders.length} Active</p>
                    <span className="text-[10px] text-blue-600 font-bold mt-1 block">In fulfillment pipeline</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-500 uppercase font-semibold text-[10px]">Catalog Model Codes</span>
                    <p className="text-2xl font-bold font-mono text-gray-900 mt-1">{products.length} Models</p>
                    <span className="text-[10px] text-gray-500 mt-1 block">Across 9 main collections</span>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-gray-500 uppercase font-semibold text-[10px]">Warehouse Units in Stock</span>
                    <p className="text-2xl font-bold font-mono text-emerald-700 mt-1">1,480,200 pcs</p>
                    <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Alicante Central Logistics</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-bold text-sm text-gray-900">Recent Wholesale Orders & Dispatches</h3>
                    <button
                      onClick={() => setAdminTab('orders')}
                      className="text-xs text-black hover:underline font-bold"
                    >
                      View all orders →
                    </button>
                  </div>

                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200">
                        <th className="py-2.5 px-3">Order Number</th>
                        <th className="py-2.5 px-3">Client Reference</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3">Items</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-gray-50">
                          <td className="py-2.5 px-3 font-mono font-bold">{o.orderNumber}</td>
                          <td className="py-2.5 px-3 text-gray-600">{o.reference}</td>
                          <td className="py-2.5 px-3">{o.date}</td>
                          <td className="py-2.5 px-3 font-semibold">{o.totalPieces} pcs</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                              {o.status}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono font-bold">{o.total.toFixed(2)} €</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTS & VARIATION CONTROL */}
            {adminTab === 'products' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Product Variation & Data Entry Management</h2>
                    <p className="text-xs text-gray-500">Add new garment references, configure color swatches, size matrices, and wholesale box/pack pricing.</p>
                  </div>
                  <button
                    onClick={openNewProductModal}
                    className="px-4 py-2 bg-black hover:bg-neutral-800 text-white text-xs font-bold rounded-md flex items-center space-x-1.5 shadow-xs transition-colors shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Model</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200">
                        <th className="py-3 px-3">Code / Image</th>
                        <th className="py-3 px-3">Model Name & Category</th>
                        <th className="py-3 px-3">Fabric & Weight</th>
                        <th className="py-3 px-3">Colors</th>
                        <th className="py-3 px-3 text-right">Box Rate</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-gray-50">
                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-2">
                              <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded border border-gray-200" />
                              <span className="font-mono font-bold text-gray-900">{p.modelCode}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-gray-900">{p.name}</p>
                            <p className="text-gray-500 text-[11px]">{p.category} ({p.gender})</p>
                          </td>
                          <td className="py-3 px-3">
                            <p className="text-gray-700">{p.weightGsm} g/m²</p>
                            <p className="text-gray-500 text-[11px] truncate max-w-xs">{p.composition}</p>
                          </td>
                          <td className="py-3 px-3">
                            <div className="flex items-center space-x-1">
                              {p.colors.slice(0, 4).map((c, i) => (
                                <span key={i} className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: c.hex }} title={c.name} />
                              ))}
                              {p.colors.length > 4 && <span className="text-[10px] text-gray-500 font-semibold">+{p.colors.length - 4}</span>}
                            </div>
                          </td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-gray-900">
                            {p.priceBox.toFixed(2)} €
                          </td>
                          <td className="py-3 px-3 text-right space-x-2">
                            <button
                              onClick={() => openEditProductModal(p)}
                              className="text-blue-600 hover:underline font-bold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(p.id, p.modelCode)}
                              className="text-red-600 hover:underline font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {adminTab === 'inventory' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Stock entry and generated variant SKUs</h2>
                  <p className="text-xs text-gray-500">Stock is controlled for every colour and size. XL, XXL/2XL, XXXL/3XL and larger variants automatically receive the <strong>-BIG</strong> SKU suffix.</p>
                </div>
                <div className="grid gap-3">
                  {products.map((product) => {
                    const variants = product.colors.length * product.sizes.length;
                    const totalStock = Object.values(product.stockMatrix).reduce((total, sizes) => total + Object.values(sizes).reduce((sum, stock) => sum + stock, 0), 0);
                    const bigSkus = product.sizes.filter(isBigSize).map((size) => variantSku(product.modelCode, size));
                    return (
                      <div key={product.id} className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-4 text-xs sm:flex-row sm:items-center">
                        <img src={product.images[0]} alt="" className="h-16 w-14 rounded bg-neutral-100 object-cover" />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2"><strong className="text-sm">{product.name}</strong><code className="rounded bg-neutral-100 px-2 py-1">{product.modelCode}</code></div>
                          <p className="mt-1 text-neutral-500">{variants} variants · {totalStock.toLocaleString()} units · {product.colors.length} colours</p>
                          {bigSkus.length > 0 && <p className="mt-1 text-[10px] text-amber-700">Big-size SKU: <strong className="font-mono">{bigSkus[0]}</strong> ({product.sizes.filter(isBigSize).join(', ')})</p>}
                        </div>
                        <button type="button" onClick={() => openEditProductModal(product)} className="rounded-md bg-black px-4 py-2 font-bold text-white">Edit stock & variants</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 3: ORDER PROCESSING */}
            {adminTab === 'orders' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Processing & Logistics Fulfillment</h2>
                  <p className="text-xs text-gray-500">Update fulfillment status, print delivery notes, packing lists, and trigger tax invoices.</p>
                </div>

                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-white transition-all text-xs space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-200 pb-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-base text-gray-900">{ord.orderNumber}</span>
                            <span className="text-gray-500">({ord.reference})</span>
                          </div>
                          <p className="text-gray-500">Date: {ord.date} • Destination: <strong>{ord.shippingAddress.companyName} ({ord.shippingAddress.city})</strong></p>
                        </div>

                        {/* Status dropdown */}
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-700">Status:</span>
                          <select
                            value={ord.status}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-white border border-gray-300 rounded px-2.5 py-1 font-bold text-xs outline-none"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Dispatched">Dispatched</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Invoiced">Invoiced</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <select
                            value={ord.paymentStatus}
                            onChange={(event) => {
                              setOrders((current) => current.map((order) => order.id === ord.id ? { ...order, paymentStatus: event.target.value as typeof order.paymentStatus } : order));
                              showToast(`Payment for ${ord.orderNumber} updated`, 'success');
                            }}
                            className="bg-white border border-gray-300 rounded px-2.5 py-1 font-bold text-xs outline-none"
                            aria-label="Payment status"
                          >
                            <option value="Pending Payment">Pending payment</option>
                            <option value="Pending 30 Days">Pending 30 days</option>
                            <option value="Paid">Paid</option>
                            <option value="Expired">Expired</option>
                            <option value="Refunded">Refunded</option>
                          </select>
                        </div>
                      </div>

                      {/* Items row */}
                      <div className="flex flex-wrap gap-3 py-1">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="bg-white border border-gray-200 rounded p-2 flex items-center space-x-2">
                            <img src={it.image} alt={it.productName} className="w-8 h-8 object-cover rounded" />
                            <div>
                              <span className="font-bold text-gray-900 block">{it.modelCode}</span>
                              <span className="text-[10px] text-gray-500">{it.totalQuantity} pcs ({it.colorName})</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-3 rounded-md border border-gray-200 bg-white p-3 sm:grid-cols-2">
                        <label className="text-[10px] font-bold uppercase text-gray-500">Carrier
                          <input value={ord.carrier || ''} onChange={(event) => setOrders((current) => current.map((order) => order.id === ord.id ? { ...order, carrier: event.target.value } : order))} className="mt-1 w-full rounded border border-gray-300 px-2.5 py-1.5 text-xs font-normal text-gray-900" />
                        </label>
                        <label className="text-[10px] font-bold uppercase text-gray-500">Tracking number
                          <input value={ord.trackingNumber || ''} onChange={(event) => setOrders((current) => current.map((order) => order.id === ord.id ? { ...order, trackingNumber: event.target.value } : order))} className="mt-1 w-full rounded border border-gray-300 px-2.5 py-1.5 text-xs font-mono font-normal text-gray-900" />
                        </label>
                        <p className="text-[11px] text-gray-600"><strong>Payment:</strong> {ord.paymentMethodName || 'Legacy order'} · {ord.paymentStatus}</p>
                        <p className="text-[11px] text-gray-600"><strong>Customer notes:</strong> {ord.notes || 'None'}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-200">
                        <div className="space-x-4">
                          <span>Total: <strong className="font-mono text-sm text-gray-900">{ord.total.toFixed(2)} €</strong></span>
                          <span>Logistics: <strong>{ord.totalBoxes || 12} boxes</strong> ({ord.grossWeightKg} kg)</span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => openDocumentModal('packing_list', ord)}
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded"
                          >
                            Packing List
                          </button>
                          <button
                            onClick={() => openDocumentModal('delivery_note', ord)}
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded"
                          >
                            Delivery Note
                          </button>
                          <button
                            onClick={() => openDocumentModal('invoice', ord)}
                            className="px-3 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold rounded flex items-center space-x-1"
                          >
                            <Printer className="w-3 h-3" />
                            <span>Print Invoice (PDF)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: INVOICING & TAX ENGINE */}
            {adminTab === 'invoices' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Invoicing & Tax Control Center</h2>
                  <p className="text-xs text-gray-500">On-demand corporate tax invoices with VAT calculations, SEPA reconciliation, and exportable ledger.</p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 flex justify-between items-center text-xs">
                  <div>
                    <span className="text-gray-500 uppercase font-semibold text-[10px]">Total Invoiced Q3 2026</span>
                    <p className="text-xl font-bold font-mono text-gray-900 mt-0.5">24,840.50 €</p>
                    <span className="text-[11px] text-gray-600">VAT Collected (21%): <strong>5,216.50 €</strong></span>
                  </div>
                  <button
                    onClick={() => showToast('Invoicing CSV ledger exported', 'success')}
                    className="px-4 py-2 bg-black text-white font-bold rounded-md hover:bg-neutral-800"
                  >
                    Export Invoicing Ledger (CSV)
                  </button>
                </div>

                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-gray-50 text-gray-700 font-semibold border-y border-gray-200">
                      <th className="py-2.5 px-3">Invoice Number</th>
                      <th className="py-2.5 px-3">Order Number</th>
                      <th className="py-2.5 px-3">Client VAT / CIF</th>
                      <th className="py-2.5 px-3">Tax Base</th>
                      <th className="py-2.5 px-3">IVA (21%)</th>
                      <th className="py-2.5 px-3 text-right">Total Invoice</th>
                      <th className="py-2.5 px-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-gray-50">
                        <td className="py-3 px-3 font-mono font-bold text-gray-900">{ord.invoiceNumber || `INV-2026-${ord.id}`}</td>
                        <td className="py-3 px-3 font-mono text-gray-700">{ord.orderNumber}</td>
                        <td className="py-3 px-3 font-mono text-gray-600">ESB98765432</td>
                        <td className="py-3 px-3 font-mono">{ord.subtotal.toFixed(2)} €</td>
                        <td className="py-3 px-3 font-mono text-gray-600">{ord.taxAmount.toFixed(2)} €</td>
                        <td className="py-3 px-3 font-mono font-bold text-right text-gray-900">{ord.total.toFixed(2)} €</td>
                        <td className="py-3 px-3 text-right">
                          <button
                            onClick={() => openDocumentModal('invoice', ord)}
                            className="text-black font-bold hover:text-red-600 flex items-center space-x-1 justify-end"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            <span>Print PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 5: MYSQL DATABASE SETUP */}
            {adminTab === 'db_setup' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <Database className="w-5 h-5 text-sky-600" />
                    <h2 className="text-xl font-bold text-gray-900">MySQL Configuration & Schema Export</h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    On Namecheap, PHP connects to MySQL using server-only <code>api/config.php</code>. This page calls <code>/api/health.php</code>; database credentials never enter the browser.
                  </p>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4 text-xs">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1.5fr]">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Schema filename label:</label>
                      <input
                        type="text"
                        value={dbName}
                        onChange={(e) => setDbName(e.target.value)}
                        placeholder="roly_b2b_ecommerce"
                        className="w-full bg-white border border-gray-300 rounded px-3 py-2 font-mono font-bold"
                      />
                    </div>
                    <div className="rounded-lg border border-sky-200 bg-sky-50 p-4 leading-5 text-sky-900">
                      <strong className="block">Namecheap setup</strong>
                      Create the cPanel database/user, import <code>database/001_initial_schema.sql</code>, then copy <code>dist/api/config.example.php</code> to <code>public_html/api/config.php</code> and add the credentials there.
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center space-x-2">
                      <button
                        disabled={isTestingDb}
                        onClick={handleSaveMySQL}
                        className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold rounded-md flex items-center space-x-2 cursor-pointer"
                      >
                        {isTestingDb ? (
                          <span>Testing Connection...</span>
                        ) : (
                          <>
                            <Server className="w-4 h-4 text-emerald-400" />
                            <span>Test Hosted PHP → MySQL</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={handleDownloadSchemaSql}
                        className="px-4 py-2.5 bg-white border border-gray-300 hover:border-black text-gray-800 font-bold rounded-md flex items-center space-x-1.5 cursor-pointer"
                      >
                        <Download className="w-4 h-4 text-gray-600" />
                        <span>Download schema.sql DDL</span>
                      </button>
                    </div>

                    <span className="text-[11px] text-gray-500">
                      Status: <strong className={mysqlConfig.connected ? 'text-emerald-700' : 'text-amber-700'}>{mysqlConfig.connected ? 'Hosted API connected' : 'Not connected — configure api/config.php'}</strong>
                    </span>
                  </div>
                </div>

                {/* Schema Structure Preview */}
                <div className="bg-neutral-900 text-neutral-300 p-5 rounded-lg text-xs font-mono space-y-2">
                  <div className="flex justify-between items-center text-white border-b border-neutral-800 pb-2">
                    <span className="font-bold">Tables included in the downloadable starter schema:</span>
                    <span className="text-[10px] text-yellow-400">Engine: InnoDB • UTF8MB4</span>
                  </div>
                  <p>✓ `categories` (editable parent/submenu hierarchy and visibility)</p>
                  <p>✓ `users` & `role_change_audit` (client-default registration and protected role administration)</p>
                  <p>✓ `products` (200+ models, composition, GSM weights, certifications)</p>
                  <p>✓ `product_variations` (Color swatches, optimized WebP images)</p>
                  <p>✓ `inventory_stock` (Stock breakdown by Alicante automated hub)</p>
                  <p>✓ `orders` & `invoices` (B2B wholesale order ledger, delivery notes)</p>
                </div>
              </div>
            )}

            {/* TAB 6: IMAGE STORAGE OPTIMIZER */}
            {adminTab === 'image_optimizer' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-xl font-bold text-gray-900">Garment Image Storage Optimization Engine</h2>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Automatically converts, compresses and downsamples high-res garment photography into lightweight WebP format to minimize server storage and accelerate mobile catalog speed.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
                    <span className="text-emerald-800 font-bold uppercase text-[10px]">Optimized Garment Assets</span>
                    <p className="text-2xl font-black font-mono text-emerald-900 mt-1">{optimizedImageCount} images</p>
                    <span className="text-[10px] text-emerald-700">100% WebP with lossless alpha</span>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                    <span className="text-blue-800 font-bold uppercase text-[10px]">Storage Saved</span>
                    <p className="text-2xl font-black font-mono text-blue-900 mt-1">{savedMegabytes} MB Saved</p>
                    <span className="text-[10px] text-blue-700">-76% vs raw PNG/JPEG</span>
                  </div>

                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                    <span className="text-purple-800 font-bold uppercase text-[10px]">Average Loading Latency</span>
                    <p className="text-2xl font-black font-mono text-purple-900 mt-1">32 ms</p>
                    <span className="text-[10px] text-purple-700">CDN cached edge delivery</span>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-xs space-y-4">
                  <h3 className="font-bold text-gray-900 text-sm">Batch Image Optimizer Simulator</h3>
                  <p className="text-gray-600">
                    Upload catalog lookbooks or uncompressed photos. The optimizer automatically generates 800x800 packshots and 160x160 thumbnails while preserving fabric texture.
                  </p>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handleSimulateCompression}
                      className="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold rounded-md flex items-center space-x-2 cursor-pointer"
                    >
                      <RefreshCw className="w-4 h-4 text-yellow-400" />
                      <span>Run Optimization Routine</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* New / Edit Product Modal */}
      {isNewProductModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsNewProductModalOpen(false);
          }}
        >
          <div className="relative bg-white rounded-xl shadow-2xl max-w-6xl w-full my-8 p-6 text-xs space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="sticky -top-6 z-10 flex items-center justify-between border-b border-gray-200 bg-white pb-3 pt-1">
              <h3 className="text-base font-bold text-gray-900">
                {editingProduct ? `Edit Model ${editingProduct.modelCode}` : 'Add New Roly Apparel Model'}
              </h3>
              <button type="button" onClick={() => setIsNewProductModalOpen(false)} className="rounded-full border border-neutral-200 p-2 text-neutral-500 hover:border-black hover:text-black" aria-label="Close product editor" title="Close">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Model Code (e.g. CA6681):</label>
                <input
                  type="text"
                  value={formModelCode}
                  onChange={(e) => setFormModelCode(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-bold font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Product Name (e.g. ATOMIC 150):</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-bold"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block font-semibold text-gray-700 mb-1">Assigned Vendor / Factory Hub:</label>
                <select
                  value={formVendorId}
                  onChange={(e) => setFormVendorId(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-semibold text-neutral-900 bg-white"
                >
                  <option value="">-- Central Hub / Gor Factory Direct --</option>
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.country})</option>
                  ))}
                </select>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block font-semibold text-gray-700 mb-1">Subtitle / Short Tagline:</label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div className="col-span-2">
                <label className="block font-semibold text-gray-700 mb-1">Detailed Commercial Description:</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Comprehensive technical and styling details for catalog and invoice..."
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 resize-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Category:</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-semibold"
                >
                  {catalogCategories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Gender:</label>
                <select
                  value={formGender}
                  onChange={(e) => setFormGender(e.target.value as any)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-semibold"
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Fabric Weight (GSM):</label>
                <input
                  type="number"
                  value={formGsm}
                  onChange={(e) => setFormGsm(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Composition:</label>
                <input
                  type="text"
                  value={formComposition}
                  onChange={(e) => setFormComposition(e.target.value)}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Single Unit Price (€):</label>
                <input
                  type="number"
                  step="0.01"
                  value={formPriceUnit}
                  onChange={(e) => setFormPriceUnit(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Pack Price (€):</label>
                <input
                  type="number"
                  step="0.01"
                  value={formPricePack}
                  onChange={(e) => setFormPricePack(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Box Wholesale Price (€):</label>
                <input
                  type="number"
                  step="0.01"
                  value={formPriceBox}
                  onChange={(e) => setFormPriceBox(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono font-bold text-emerald-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Box Quantity (pcs):</label>
                <input
                  type="number"
                  value={formBoxQty}
                  onChange={(e) => setFormBoxQty(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Pack Quantity (pcs):</label>
                <input
                  type="number"
                  min="1"
                  value={formPackQty}
                  onChange={(e) => setFormPackQty(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded px-2.5 py-1.5 font-mono"
                />
              </div>
            </div>

            <section className="rounded-lg border border-gray-200 p-4 space-y-3">
              <h4 className="font-black text-sm text-gray-900">Features, labels & collections</h4>
              <textarea rows={4} value={formFeatures} onChange={(event) => setFormFeatures(event.target.value)} placeholder="One product feature per line" className="w-full rounded border border-gray-300 px-3 py-2 text-xs" />
              <div className="flex flex-wrap gap-4">
                {([
                  ['isNew', 'New arrival'], ['isEco', 'Eco'], ['isWorkwear', 'Workwear'], ['isHighVis', 'High visibility'], ['isOutlet', 'Outlet'], ['oekoTexCertified', 'Oeko-Tex certified'],
                ] as const).map(([key, label]) => <label key={key} className="flex items-center gap-2 font-semibold"><input type="checkbox" checked={formFlags[key]} onChange={(event) => setFormFlags((flags) => ({ ...flags, [key]: event.target.checked }))} className="accent-black" />{label}</label>)}
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h4 className="font-black text-sm text-gray-900">Sizes & automatic SKU rules</h4>
                  <p className="text-[11px] text-gray-500">Large sizes automatically use <code className="font-bold text-amber-700">{formModelCode.trim().toUpperCase().replace(/-BIG$/i, '') || 'MODEL'}-BIG</code>.</p>
                </div>
                <div className="flex gap-2">
                  <input value={newSize} onChange={(event) => setNewSize(event.target.value.toUpperCase())} placeholder="Custom size" className="w-28 rounded border border-gray-300 px-2.5 py-1.5 font-mono" />
                  <button type="button" onClick={() => {
                    const size = newSize.trim().toUpperCase();
                    if (size && !formSizes.includes(size)) setFormSizes((sizes) => [...sizes, size]);
                    setNewSize('');
                  }} className="rounded bg-black px-3 py-1.5 font-bold text-white">Add</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_SIZES.map((size) => (
                  <button key={size} type="button" onClick={() => setFormSizes((sizes) => sizes.includes(size) ? sizes.filter((item) => item !== size) : [...sizes, size])} className={`rounded-full border px-3 py-1.5 font-bold ${formSizes.includes(size) ? 'border-black bg-black text-white' : 'border-gray-300 bg-white'}`}>
                    {size}{isBigSize(size) ? ' · BIG' : ''}
                  </button>
                ))}
                {formSizes.filter((size) => !DEFAULT_SIZES.includes(size)).map((size) => <button key={size} type="button" onClick={() => setFormSizes((sizes) => sizes.filter((item) => item !== size))} className="rounded-full border border-black bg-black px-3 py-1.5 font-bold text-white">{size}{isBigSize(size) ? ' · BIG' : ''} ×</button>)}
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div><h4 className="font-black text-sm text-gray-900">Colours & colour-specific images</h4><p className="text-[11px] text-gray-500">Each colour can use its own packshot; the gallery below provides additional product photography.</p></div>
                <button type="button" onClick={() => {
                  const number = formColors.length + 1;
                  const color: ColorSwatch = { name: `${number.toString().padStart(2, '0')} New colour`, code: number.toString().padStart(2, '0'), hex: '#999999', image: '' };
                  setFormColors((colors) => [...colors, color]);
                  setFormStockMatrix((matrix) => ({ ...matrix, [color.name]: Object.fromEntries(formSizes.map((size) => [size, 0])) }));
                }} className="flex items-center gap-1 rounded bg-black px-3 py-2 font-bold text-white"><Plus className="h-3.5 w-3.5" /> Add colour</button>
              </div>
              <div className="space-y-2">
                {formColors.map((color, index) => (
                  <div key={`${color.code}-${index}`} className="grid gap-2 rounded-md bg-gray-50 p-3 sm:grid-cols-[46px_1fr_90px_90px_2fr_30px] sm:items-center">
                    <input type="color" value={color.hex} onChange={(event) => setColorField(index, 'hex', event.target.value)} className="h-9 w-11 rounded border border-gray-300 bg-white p-1" aria-label="Colour" />
                    <input value={color.name} onChange={(event) => setColorField(index, 'name', event.target.value)} placeholder="Colour display name" className="rounded border border-gray-300 px-2.5 py-2 font-semibold" />
                    <input value={color.code} onChange={(event) => setColorField(index, 'code', event.target.value)} placeholder="Code" className="rounded border border-gray-300 px-2.5 py-2 font-mono" />
                    <input value={color.hex} onChange={(event) => setColorField(index, 'hex', event.target.value)} placeholder="#000000" className="rounded border border-gray-300 px-2.5 py-2 font-mono" />
                    <input value={color.image || ''} onChange={(event) => setColorField(index, 'image', event.target.value)} placeholder="Colour image URL" className="rounded border border-gray-300 px-2.5 py-2" />
                    <button type="button" onClick={() => {
                      setFormColors((colors) => colors.filter((_, colorIndex) => colorIndex !== index));
                      setFormStockMatrix((matrix) => { const next = { ...matrix }; delete next[color.name]; return next; });
                    }} className="text-red-600" aria-label="Remove colour"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-lg border border-gray-200 p-4 space-y-3">
              <h4 className="font-black text-sm text-gray-900">Product image gallery</h4>
              <div className="grid gap-2 sm:grid-cols-2">
                {formImages.map((url, index) => (
                  <div key={`${url}-${index}`} className="flex items-center gap-2 rounded-md bg-gray-50 p-2">
                    <img src={url} alt="" className="h-12 w-10 rounded bg-white object-cover" />
                    <input value={url} onChange={(event) => setFormImages((images) => images.map((image, imageIndex) => imageIndex === index ? event.target.value : image))} className="min-w-0 flex-1 rounded border border-gray-300 px-2 py-1.5" />
                    <button type="button" onClick={() => setFormImages((images) => images.filter((_, imageIndex) => imageIndex !== index))} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                ))}
              </div>
              <div className="flex gap-2"><input value={newImageUrl} onChange={(event) => setNewImageUrl(event.target.value)} placeholder="Paste an image URL" className="min-w-0 flex-1 rounded border border-gray-300 px-3 py-2" /><button type="button" onClick={() => { if (newImageUrl.trim()) setFormImages((images) => [...images, newImageUrl.trim()]); setNewImageUrl(''); }} className="rounded bg-black px-4 py-2 font-bold text-white">Add image</button></div>
            </section>

            <section className="rounded-lg border border-gray-200 p-4 space-y-3">
              <div><h4 className="font-black text-sm text-gray-900">Stock entry matrix</h4><p className="text-[11px] text-gray-500">Enter the available quantity for every colour/size variation. The generated SKU is shown below each size.</p></div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-center">
                  <thead><tr><th className="border border-gray-200 bg-gray-50 px-3 py-2 text-left">Colour</th>{formSizes.map((size) => <th key={size} className="border border-gray-200 bg-gray-50 px-2 py-2"><span className="block font-black">{size}</span><code className={`text-[9px] ${isBigSize(size) ? 'text-amber-700' : 'text-gray-400'}`}>{variantSku(formModelCode || 'MODEL', size)}</code></th>)}</tr></thead>
                  <tbody>{formColors.map((color) => <tr key={color.name}><th className="border border-gray-200 px-3 py-2 text-left"><span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full border" style={{ backgroundColor: color.hex }} />{color.name}</span></th>{formSizes.map((size) => <td key={size} className="border border-gray-200 p-1.5"><input type="number" min="0" value={formStockMatrix[color.name]?.[size] || 0} onChange={(event) => setVariantStock(color.name, size, Number(event.target.value))} className="w-20 rounded border border-gray-300 px-2 py-1.5 text-center font-mono" /></td>)}</tr>)}</tbody>
                </table>
              </div>
            </section>

            <div className="pt-4 border-t border-gray-200 flex justify-end space-x-2">
              <button
                onClick={() => setIsNewProductModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProduct}
                className="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-bold rounded"
              >
                Save Product Model
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
