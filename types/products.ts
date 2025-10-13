// ==========================================
// PRODUCT TYPES & INTERFACES
// ==========================================

export type ProductStatus = 'draft' | 'active' | 'low_stock' | 'out_of_stock' | 'discontinued' | 'archived'
export type ProductType = 'physical' | 'digital' | 'service' | 'bundle'
export type TaxBehavior = 'inclusive' | 'exclusive' | 'none'

export type InventoryTracking = 'none' | 'simple' | 'variants' | 'batch' | 'serial'
export type StockStatus = 'in_stock' | 'low_stock' | 'out_of_stock' | 'on_order' | 'discontinued'

export type VariantType = 'size' | 'color' | 'material' | 'style' | 'custom'

export type SupplierStatus = 'active' | 'inactive' | 'blocked'
export type PurchaseOrderStatus = 'draft' | 'sent' | 'confirmed' | 'partial' | 'received' | 'cancelled'

export type PriceType = 'fixed' | 'variable' | 'tiered' | 'dynamic'

// ==========================================
// MAIN INTERFACES
// ==========================================

export interface Product {
  id: string
  tenantId: string

  // Basic Info
  name: string
  slug: string
  sku: string
  barcode?: string
  description: string

  // Type & Status
  type: ProductType
  status: ProductStatus

  // Categorization
  categoryId?: string
  categoryName?: string
  tags: string[]
  brand?: string

  // Pricing
  basePrice: number
  costPrice: number
  salePrice?: number
  currency: string
  priceType: PriceType
  priceTiers?: PriceTier[]

  // Tax
  taxable: boolean
  taxRate?: number
  taxBehavior: TaxBehavior

  // Inventory
  inventoryTracking: InventoryTracking
  trackQuantity: boolean
  currentStock: number
  minStockLevel: number
  maxStockLevel: number
  reorderPoint: number
  reorderQuantity: number

  // Variants
  hasVariants: boolean
  variantOptions?: VariantOption[]
  variants?: ProductVariant[]

  // Physical Properties
  weight?: number
  weightUnit?: 'kg' | 'lb' | 'g' | 'oz'
  dimensions?: Dimensions
  isShippable: boolean
  shippingClass?: string

  // Images
  images: ProductImage[]
  thumbnailUrl?: string

  // Suppliers
  primarySupplierId?: string
  suppliers: ProductSupplier[]

  // Bundling (for bundle products)
  bundleItems?: BundleItem[]

  // Digital Product Specific
  downloadUrl?: string
  downloadLimit?: number
  licenseKey?: string

  // Metrics
  totalSold: number
  totalRevenue: number
  averageRating?: number
  reviewsCount: number

  // SEO
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]

  // Visibility
  isPublished: boolean
  isFeatured: boolean
  isVisible: boolean

  // Custom Fields
  customFields?: Record<string, any>

  // Timestamps
  createdAt: string
  updatedAt: string
  publishedAt?: string
  discontinuedAt?: string
}

export interface Dimensions {
  length: number
  width: number
  height: number
  unit: 'cm' | 'in' | 'm' | 'ft'
}

export interface ProductImage {
  id: string
  url: string
  thumbnailUrl?: string
  altText?: string
  order: number
  isPrimary: boolean
}

export interface PriceTier {
  id: string
  minQuantity: number
  maxQuantity?: number
  price: number
  discountPercentage?: number
}

export interface VariantOption {
  id: string
  name: string // e.g., "Size", "Color"
  type: VariantType
  values: string[] // e.g., ["S", "M", "L"] or ["Red", "Blue"]
}

export interface ProductVariant {
  id: string
  productId: string

  // Variant Info
  sku: string
  barcode?: string
  name: string // e.g., "Red - Large"

  // Options (e.g., { "Color": "Red", "Size": "Large" })
  options: Record<string, string>

  // Pricing
  price: number
  costPrice: number
  salePrice?: number

  // Stock
  currentStock: number
  reservedStock: number
  availableStock: number

  // Physical
  weight?: number
  dimensions?: Dimensions

  // Image
  imageUrl?: string

  // Status
  isActive: boolean
  isDefault: boolean

  // Metrics
  totalSold: number

  createdAt: string
  updatedAt: string
}

export interface BundleItem {
  productId: string
  productName: string
  quantity: number
  canCustomize: boolean
}

export interface ProductCategory {
  id: string
  tenantId: string

  name: string
  slug: string
  description?: string

  // Hierarchy
  parentId?: string
  path: string // materialized path: "Electronics/Computers/Laptops"
  level: number

  // Image
  imageUrl?: string

  // SEO
  metaTitle?: string
  metaDescription?: string

  // Visibility
  isVisible: boolean
  order: number

  // Metrics
  productsCount: number

  createdAt: string
  updatedAt: string
}

export interface Inventory {
  id: string
  productId: string
  variantId?: string
  warehouseId?: string

  // Quantities
  onHand: number // physical count
  available: number // available to sell
  reserved: number // allocated to orders
  incoming: number // on purchase orders
  damaged: number
  lost: number

  // Location
  binLocation?: string
  aisle?: string
  shelf?: string

  // Batch/Serial (if tracked)
  batchNumber?: string
  serialNumbers?: string[]
  expiryDate?: string
  manufactureDate?: string

  // Valuation
  unitCost: number
  totalValue: number

  // Last Activity
  lastCountDate?: string
  lastMovementDate?: string
  lastRestockDate?: string

  createdAt: string
  updatedAt: string
}

export interface InventoryMovement {
  id: string
  productId: string
  variantId?: string
  warehouseId?: string

  // Movement
  type: 'purchase' | 'sale' | 'adjustment' | 'transfer' | 'return' | 'damage' | 'loss'
  quantity: number // positive for increase, negative for decrease

  // Before/After
  quantityBefore: number
  quantityAfter: number

  // Reference
  referenceType?: 'order' | 'purchase_order' | 'adjustment'
  referenceId?: string
  referenceNumber?: string

  // Cost
  unitCost?: number
  totalValue?: number

  // Details
  reason?: string
  notes?: string

  // User
  userId: string
  userName: string

  createdAt: string
}

export interface Warehouse {
  id: string
  tenantId: string

  name: string
  code: string
  type: 'main' | 'satellite' | 'dropship' | 'virtual'

  // Address
  address: string
  city: string
  state: string
  postalCode: string
  country: string

  // Contact
  managerName?: string
  email?: string
  phone?: string

  // Capacity
  totalCapacity?: number
  usedCapacity?: number
  capacityUnit?: string

  // Status
  isActive: boolean
  isDefault: boolean

  // Metrics
  productsCount: number
  totalValue: number

  createdAt: string
  updatedAt: string
}

export interface Supplier {
  id: string
  tenantId: string

  // Basic Info
  name: string
  companyName?: string
  code?: string

  status: SupplierStatus
  rating?: number

  // Contact
  email: string
  phone?: string
  website?: string

  // Address
  address?: string
  city?: string
  state?: string
  postalCode?: string
  country?: string

  // Primary Contact
  contactPersonName?: string
  contactPersonEmail?: string
  contactPersonPhone?: string

  // Terms
  paymentTerms: number // days
  currency: string
  taxId?: string

  // Lead Times
  leadTimeDays: number
  minimumOrderValue?: number

  // Metrics
  totalOrders: number
  totalSpent: number
  onTimeDeliveryRate: number
  qualityScore?: number

  // Relationships
  products: string[] // product IDs

  // Notes
  notes?: string

  // Timestamps
  createdAt: string
  updatedAt: string
  lastOrderDate?: string
}

export interface ProductSupplier {
  supplierId: string
  supplierName: string
  supplierCode?: string

  // Pricing
  supplierSku?: string
  costPrice: number
  currency: string

  // Terms
  leadTimeDays: number
  minimumOrderQuantity: number

  // Priority
  isPrimary: boolean
  priority: number

  // Status
  isActive: boolean

  lastOrderDate?: string
}

export interface PurchaseOrder {
  id: string
  tenantId: string
  supplierId: string

  // Order Info
  orderNumber: string
  status: PurchaseOrderStatus

  // Financial
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  currency: string

  // Items
  items: PurchaseOrderItem[]

  // Dates
  orderDate: string
  expectedDeliveryDate?: string
  deliveredDate?: string

  // Shipping
  shippingAddress?: string
  shippingMethod?: string
  trackingNumber?: string

  // Payment
  paymentTerms: number
  paymentStatus: 'pending' | 'partial' | 'paid'
  paidAmount: number

  // Notes
  notes?: string
  internalNotes?: string

  // Documents
  documentUrl?: string

  // Receiving
  receivedBy?: string
  receivedAt?: string
  receivingNotes?: string

  // User
  createdBy: string
  createdByName: string

  createdAt: string
  updatedAt: string
  sentAt?: string
  confirmedAt?: string
}

export interface PurchaseOrderItem {
  id: string
  productId: string
  variantId?: string

  productName: string
  sku: string

  quantity: number
  receivedQuantity: number
  pendingQuantity: number

  unitPrice: number
  total: number

  taxRate?: number
  taxAmount?: number

  notes?: string
}

export interface StockAdjustment {
  id: string
  warehouseId?: string

  reason: 'count' | 'damage' | 'loss' | 'found' | 'correction' | 'other'
  description: string

  // Items adjusted
  items: StockAdjustmentItem[]

  // Approval
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected'
  approvedBy?: string
  approvedAt?: string

  // User
  createdBy: string
  createdByName: string

  createdAt: string
  updatedAt: string
}

export interface StockAdjustmentItem {
  productId: string
  variantId?: string
  productName: string

  expectedQuantity: number
  actualQuantity: number
  difference: number

  reason?: string
}

export interface ProductAnalytics {
  productId: string

  // Sales
  unitsSold: number
  unitsSoldThisMonth: number
  revenue: number
  revenueThisMonth: number
  averageOrderValue: number

  // Inventory
  turnoverRate: number
  daysInStock: number
  stockoutDays: number

  // Profitability
  grossProfit: number
  grossMargin: number
  roi: number

  // Trends
  salesByMonth: MonthlyMetric[]
  stockByMonth: MonthlyMetric[]
}

export interface MonthlyMetric {
  month: string
  value: number
}
