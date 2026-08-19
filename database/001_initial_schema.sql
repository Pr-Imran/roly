-- ROLY commerce starter schema
-- MySQL 8.0+. Select the target database before running this migration.
-- No password or hardcoded administrator is inserted by this file.

SET NAMES utf8mb4;
SET time_zone = '+00:00';

CREATE TABLE IF NOT EXISTS schema_migrations (
  version VARCHAR(100) PRIMARY KEY,
  applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('client', 'vendor', 'logistics_admin', 'super_admin') NOT NULL DEFAULT 'client',
  status ENUM('pending_verification', 'active', 'invited', 'suspended') NOT NULL DEFAULT 'pending_verification',
  email_verified_at TIMESTAMP NULL,
  is_bootstrap_owner BOOLEAN NOT NULL DEFAULT FALSE,
  bootstrap_owner_slot TINYINT GENERATED ALWAYS AS (IF(is_bootstrap_owner, 1, NULL)) STORED,
  mfa_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  password_changed_at TIMESTAMP NULL,
  last_login_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_users_email (email),
  UNIQUE KEY uq_single_bootstrap_owner (bootstrap_owner_slot),
  INDEX idx_users_role_status (role, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_sessions (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  token_hash CHAR(64) NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_sessions_token_hash (token_hash),
  INDEX idx_sessions_user_expiry (user_id, expires_at),
  CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS role_change_audit (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id CHAR(36) NOT NULL,
  target_user_id CHAR(36) NOT NULL,
  old_role VARCHAR(32) NOT NULL,
  new_role VARCHAR(32) NOT NULL,
  reason VARCHAR(500) NULL,
  request_id VARCHAR(100) NULL,
  ip_address VARCHAR(45) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_role_audit_target_time (target_user_id, created_at),
  CONSTRAINT fk_role_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id),
  CONSTRAINT fk_role_audit_target FOREIGN KEY (target_user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vendors (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(64) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(64) NULL,
  country CHAR(2) NULL,
  commission_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
  status ENUM('active', 'pending', 'suspended') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_vendors_code (code)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS user_vendor_access (
  user_id CHAR(36) NOT NULL,
  vendor_id CHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, vendor_id),
  CONSTRAINT fk_user_vendor_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_vendor_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id CHAR(36) PRIMARY KEY,
  parent_id CHAR(36) NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(160) NOT NULL,
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_categories_slug (slug),
  INDEX idx_categories_parent_visible_sort (parent_id, visible, sort_order),
  CONSTRAINT fk_categories_parent FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE,
  CONSTRAINT chk_categories_not_own_parent CHECK (parent_id IS NULL OR parent_id <> id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS menu_items (
  id CHAR(36) PRIMARY KEY,
  parent_id CHAR(36) NULL,
  category_id CHAR(36) NULL,
  label VARCHAR(255) NOT NULL,
  target VARCHAR(500) NOT NULL,
  source ENUM('category', 'custom') NOT NULL DEFAULT 'custom',
  visible BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_menu_parent_visible_sort (parent_id, visible, sort_order),
  CONSTRAINT fk_menu_parent FOREIGN KEY (parent_id) REFERENCES menu_items(id) ON DELETE CASCADE,
  CONSTRAINT fk_menu_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
  id CHAR(36) PRIMARY KEY,
  vendor_id CHAR(36) NULL,
  category_id CHAR(36) NOT NULL,
  subcategory_id CHAR(36) NULL,
  model_code VARCHAR(64) NOT NULL,
  name VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NULL,
  description TEXT NOT NULL,
  composition TEXT NULL,
  features JSON NULL,
  weight_gsm INT UNSIGNED NULL,
  gender ENUM('Men', 'Women', 'Unisex', 'Kids') NOT NULL DEFAULT 'Unisex',
  price_unit DECIMAL(12,2) NOT NULL,
  price_pack DECIMAL(12,2) NOT NULL,
  price_box DECIMAL(12,2) NOT NULL,
  pack_quantity INT UNSIGNED NOT NULL DEFAULT 1,
  box_quantity INT UNSIGNED NOT NULL DEFAULT 1,
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  status ENUM('draft', 'active', 'archived') NOT NULL DEFAULT 'draft',
  is_eco BOOLEAN NOT NULL DEFAULT FALSE,
  is_new BOOLEAN NOT NULL DEFAULT FALSE,
  is_high_vis BOOLEAN NOT NULL DEFAULT FALSE,
  is_workwear BOOLEAN NOT NULL DEFAULT FALSE,
  is_outlet BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_products_model_code (model_code),
  INDEX idx_products_catalog (category_id, subcategory_id, status),
  CONSTRAINT fk_products_vendor FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE SET NULL,
  CONSTRAINT fk_products_category FOREIGN KEY (category_id) REFERENCES categories(id),
  CONSTRAINT fk_products_subcategory FOREIGN KEY (subcategory_id) REFERENCES categories(id),
  CONSTRAINT chk_products_prices CHECK (price_unit >= 0 AND price_pack >= 0 AND price_box >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_media (
  id CHAR(36) PRIMARY KEY,
  product_id CHAR(36) NOT NULL,
  color_code VARCHAR(32) NULL,
  object_key VARCHAR(700) NOT NULL,
  public_url VARCHAR(1000) NOT NULL,
  format ENUM('webp', 'avif', 'jpeg', 'png') NOT NULL,
  width_px INT UNSIGNED NOT NULL,
  height_px INT UNSIGNED NOT NULL,
  size_bytes BIGINT UNSIGNED NOT NULL,
  alt_text VARCHAR(500) NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_media_product_color_sort (product_id, color_code, sort_order),
  CONSTRAINT fk_media_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_variants (
  id CHAR(36) PRIMARY KEY,
  product_id CHAR(36) NOT NULL,
  sku VARCHAR(100) NOT NULL,
  color_name VARCHAR(100) NOT NULL,
  color_code VARCHAR(32) NOT NULL,
  color_hex VARCHAR(10) NOT NULL,
  size VARCHAR(32) NOT NULL,
  ean VARCHAR(32) NULL,
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_variants_sku (sku),
  UNIQUE KEY uq_variants_product_color_size (product_id, color_code, size),
  CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inventory_stock (
  variant_id CHAR(36) PRIMARY KEY,
  on_hand INT NOT NULL DEFAULT 0,
  reserved INT NOT NULL DEFAULT 0,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_inventory_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
  CONSTRAINT chk_inventory_nonnegative CHECK (on_hand >= 0 AND reserved >= 0 AND reserved <= on_hand)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS stock_movements (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  variant_id CHAR(36) NOT NULL,
  actor_user_id CHAR(36) NULL,
  movement_type ENUM('receipt', 'adjustment', 'reservation', 'release', 'dispatch', 'return', 'damage') NOT NULL,
  on_hand_delta INT NOT NULL DEFAULT 0,
  reserved_delta INT NOT NULL DEFAULT 0,
  reference_type VARCHAR(50) NULL,
  reference_id CHAR(36) NULL,
  reason VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_stock_movement_variant_time (variant_id, created_at),
  CONSTRAINT fk_stock_movement_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id),
  CONSTRAINT fk_stock_movement_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS addresses (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  title VARCHAR(100) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  vat_number VARCHAR(64) NULL,
  contact_person VARCHAR(255) NOT NULL,
  street VARCHAR(500) NOT NULL,
  city VARCHAR(150) NOT NULL,
  postal_code VARCHAR(32) NOT NULL,
  country_code CHAR(2) NOT NULL,
  phone VARCHAR(64) NULL,
  is_default_delivery BOOLEAN NOT NULL DEFAULT FALSE,
  is_default_billing BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_addresses_user (user_id),
  CONSTRAINT fk_addresses_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS orders (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  order_number VARCHAR(64) NOT NULL,
  client_reference VARCHAR(128) NULL,
  status ENUM('Pending', 'Processing', 'Dispatched', 'Delivered', 'Invoiced', 'Cancelled') NOT NULL DEFAULT 'Pending',
  payment_status ENUM('Paid', 'Pending 30 Days', 'Pending Payment', 'Expired', 'Refunded') NOT NULL DEFAULT 'Pending Payment',
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  subtotal DECIMAL(14,2) NOT NULL,
  tax_rate DECIMAL(7,4) NOT NULL,
  tax_amount DECIMAL(14,2) NOT NULL,
  shipping_cost DECIMAL(14,2) NOT NULL DEFAULT 0,
  payment_fee DECIMAL(14,2) NOT NULL DEFAULT 0,
  total_amount DECIMAL(14,2) NOT NULL,
  billing_address_snapshot JSON NOT NULL,
  shipping_address_snapshot JSON NOT NULL,
  notes TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_orders_number (order_number),
  INDEX idx_orders_user_time (user_id, created_at),
  INDEX idx_orders_status_time (status, created_at),
  CONSTRAINT fk_orders_user FOREIGN KEY (user_id) REFERENCES users(id),
  CONSTRAINT chk_orders_totals CHECK (subtotal >= 0 AND tax_amount >= 0 AND shipping_cost >= 0 AND payment_fee >= 0 AND total_amount >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS order_items (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  variant_id CHAR(36) NULL,
  sku_snapshot VARCHAR(100) NOT NULL,
  product_name_snapshot VARCHAR(255) NOT NULL,
  color_snapshot VARCHAR(100) NOT NULL,
  size_snapshot VARCHAR(32) NOT NULL,
  quantity INT UNSIGNED NOT NULL,
  unit_price DECIMAL(14,2) NOT NULL,
  line_total DECIMAL(14,2) NOT NULL,
  customization_snapshot JSON NULL,
  INDEX idx_order_items_order (order_id),
  CONSTRAINT fk_order_items_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT fk_order_items_variant FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE SET NULL,
  CONSTRAINT chk_order_items_values CHECK (quantity > 0 AND unit_price >= 0 AND line_total >= 0)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  provider VARCHAR(100) NOT NULL,
  provider_reference VARCHAR(255) NULL,
  status ENUM('created', 'authorized', 'paid', 'failed', 'expired', 'refunded', 'partially_refunded') NOT NULL DEFAULT 'created',
  amount DECIMAL(14,2) NOT NULL,
  currency CHAR(3) NOT NULL,
  idempotency_key VARCHAR(255) NOT NULL,
  paid_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_payments_idempotency (idempotency_key),
  INDEX idx_payments_order (order_id),
  CONSTRAINT fk_payments_order FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_webhook_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(100) NOT NULL,
  provider_event_id VARCHAR(255) NOT NULL,
  payload_hash CHAR(64) NOT NULL,
  processed_at TIMESTAMP NULL,
  error_message VARCHAR(1000) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_webhook_provider_event (provider, provider_event_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS shipments (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  carrier VARCHAR(150) NOT NULL,
  tracking_number VARCHAR(255) NULL,
  total_boxes INT UNSIGNED NOT NULL DEFAULT 0,
  gross_weight_kg DECIMAL(10,3) NULL,
  status ENUM('preparing', 'dispatched', 'delivered', 'returned') NOT NULL DEFAULT 'preparing',
  dispatched_at TIMESTAMP NULL,
  delivered_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_shipments_order (order_id),
  INDEX idx_shipments_tracking (tracking_number),
  CONSTRAINT fk_shipments_order FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS documents (
  id CHAR(36) PRIMARY KEY,
  order_id CHAR(36) NOT NULL,
  document_type ENUM('invoice', 'packing_list', 'delivery_note', 'credit_note') NOT NULL,
  document_number VARCHAR(100) NOT NULL,
  status ENUM('draft', 'final') NOT NULL DEFAULT 'draft',
  data_snapshot JSON NOT NULL,
  object_key VARCHAR(700) NULL,
  sha256 CHAR(64) NULL,
  finalized_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_documents_type_number (document_type, document_number),
  INDEX idx_documents_order_type (order_id, document_type),
  CONSTRAINT fk_documents_order FOREIGN KEY (order_id) REFERENCES orders(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS site_settings (
  setting_key VARCHAR(160) PRIMARY KEY,
  setting_value JSON NOT NULL,
  updated_by CHAR(36) NULL,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_site_settings_actor FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  actor_user_id CHAR(36) NULL,
  action VARCHAR(160) NOT NULL,
  target_type VARCHAR(100) NULL,
  target_id VARCHAR(100) NULL,
  before_summary JSON NULL,
  after_summary JSON NULL,
  request_id VARCHAR(100) NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(512) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_actor_time (actor_user_id, created_at),
  INDEX idx_audit_target_time (target_type, target_id, created_at),
  CONSTRAINT fk_audit_actor FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO schema_migrations (version) VALUES ('001_initial_schema');

