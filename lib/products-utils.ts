/**
 * MasHub V2 - Products Utility Functions
 *
 * Core utility functions for product management, inventory tracking,
 * variant handling, and product analytics
 */

import {
  Product,
  ProductStatus,
  ProductType,
  StockStatus,
  ProductVariant,
  Inventory,
  PurchaseOrder,
  PurchaseOrderStatus,
  ProductAnalytics
} from '@/types/products'

// ==================== STATUS & TYPE FORMATTING ====================

/**
 * Get status badge color class for products
 */
export function getProductStatusColor(status: ProductStatus): string {
  const colors: Record<ProductStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    active: 'bg-green-100 text-green-700',
    low_stock: 'bg-yellow-100 text-yellow-700',
    out_of_stock: 'bg-red-100 text-red-700',
    discontinued: 'bg-gray-400 text-white',
    archived: 'bg-gray-100 text-gray-500'
  }
  return colors[status]
}

/**
 * Get stock status badge color
 */
export function getStockStatusColor(status: StockStatus): string {
  const colors: Record<StockStatus, string> = {
    in_stock: 'bg-green-100 text-green-700',
    low_stock: 'bg-yellow-100 text-yellow-700',
    out_of_stock: 'bg-red-100 text-red-700',
    on_order: 'bg-blue-100 text-blue-700',
    discontinued: 'bg-gray-400 text-white'
  }
  return colors[status]
}

/**
 * Get purchase order status color
 */
export function getPurchaseOrderStatusColor(status: PurchaseOrderStatus): string {
  const colors: Record<PurchaseOrderStatus, string> = {
    draft: 'bg-gray-100 text-gray-700',
    sent: 'bg-blue-100 text-blue-700',
    confirmed: 'bg-purple-100 text-purple-700',
    partial: 'bg-yellow-100 text-yellow-700',
    received: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700'
  }
  return colors[status]
}

/**
 * Format product status display text
 */
export function formatProductStatus(status: ProductStatus): string {
  const labels: Record<ProductStatus, string> = {
    draft: 'Draft',
    active: 'Active',
    low_stock: 'Low Stock',
    out_of_stock: 'Out of Stock',
    discontinued: 'Discontinued',
    archived: 'Archived'
  }
  return labels[status]
}

// ==================== STOCK MANAGEMENT ====================

/**
 * Calculate available stock (on hand - reserved)
 */
export function calculateAvailableStock(onHand: number, reserved: number): number {
  return Math.max(0, onHand - reserved)
}

/**
 * Get stock status based on current levels
 */
export function getStockStatus(product: Product): StockStatus {
  if (product.status === 'discontinued') return 'discontinued'
  if (!product.trackQuantity) return 'in_stock'

  if (product.currentStock === 0) return 'out_of_stock'
  if (product.currentStock <= product.reorderPoint) return 'low_stock'

  return 'in_stock'
}

/**
 * Check if product needs reordering
 */
export function needsReorder(product: Product): boolean {
  if (!product.trackQuantity) return false
  return product.currentStock <= product.reorderPoint
}

/**
 * Calculate reorder quantity
 */
export function calculateReorderQuantity(product: Product): number {
  if (!needsReorder(product)) return 0

  const deficit = product.maxStockLevel - product.currentStock
  return Math.max(product.reorderQuantity, deficit)
}

/**
 * Calculate stock value
 */
export function calculateStockValue(quantity: number, costPrice: number): number {
  return quantity * costPrice
}

/**
 * Calculate days of stock remaining
 */
export function calculateDaysOfStock(currentStock: number, avgDailySales: number): number {
  if (avgDailySales === 0) return 999 // Infinite stock if no sales
  return Math.floor(currentStock / avgDailySales)
}

/**
 * Format stock quantity display
 */
export function formatStockQuantity(quantity: number, unit: string = 'units'): string {
  if (quantity === 0) return 'Out of stock'
  if (quantity === 1) return `1 ${unit}`
  return `${quantity} ${unit}s`
}

// ==================== PRICING & FINANCIAL ====================

/**
 * Format currency amount
 */
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

/**
 * Calculate profit margin
 */
export function calculateProfitMargin(salePrice: number, costPrice: number): number {
  if (salePrice === 0) return 0
  return Math.round(((salePrice - costPrice) / salePrice) * 100)
}

/**
 * Calculate markup percentage
 */
export function calculateMarkup(salePrice: number, costPrice: number): number {
  if (costPrice === 0) return 0
  return Math.round(((salePrice - costPrice) / costPrice) * 100)
}

/**
 * Get price after discount
 */
export function getPriceAfterDiscount(basePrice: number, discountPercentage: number): number {
  return basePrice * (1 - discountPercentage / 100)
}

/**
 * Calculate tiered price based on quantity
 */
export function calculateTieredPrice(product: Product, quantity: number): number {
  if (!product.priceTiers || product.priceTiers.length === 0) {
    return product.basePrice * quantity
  }

  // Find applicable tier
  const tier = product.priceTiers
    .filter(t => quantity >= t.minQuantity && (!t.maxQuantity || quantity <= t.maxQuantity))
    .sort((a, b) => b.minQuantity - a.minQuantity)[0]

  const price = tier ? tier.price : product.basePrice
  return price * quantity
}

/**
 * Calculate total price including tax
 */
export function calculatePriceWithTax(basePrice: number, taxRate: number): number {
  return basePrice * (1 + taxRate / 100)
}

// ==================== VARIANT MANAGEMENT ====================

/**
 * Check if product has variants
 */
export function hasVariants(product: Product): boolean {
  return product.hasVariants && !!product.variants && product.variants.length > 0
}

/**
 * Get variant by SKU
 */
export function getVariantBySKU(product: Product, sku: string): ProductVariant | undefined {
  return product.variants?.find(v => v.sku === sku)
}

/**
 * Get default variant
 */
export function getDefaultVariant(product: Product): ProductVariant | undefined {
  return product.variants?.find(v => v.isDefault)
}

/**
 * Get active variants
 */
export function getActiveVariants(product: Product): ProductVariant[] {
  return product.variants?.filter(v => v.isActive) || []
}

/**
 * Calculate total stock across all variants
 */
export function calculateTotalVariantStock(variants: ProductVariant[]): number {
  return variants.reduce((total, variant) => total + variant.currentStock, 0)
}

/**
 * Format variant name from options
 */
export function formatVariantName(options: Record<string, string>): string {
  return Object.values(options).join(' / ')
}

/**
 * Check if variant is in stock
 */
export function isVariantInStock(variant: ProductVariant): boolean {
  return variant.availableStock > 0
}

// ==================== INVENTORY OPERATIONS ====================

/**
 * Calculate inventory turnover rate
 */
export function calculateInventoryTurnover(
  costOfGoodsSold: number,
  avgInventoryValue: number
): number {
  if (avgInventoryValue === 0) return 0
  return costOfGoodsSold / avgInventoryValue
}

/**
 * Calculate days in inventory
 */
export function calculateDaysInInventory(turnoverRate: number): number {
  if (turnoverRate === 0) return 0
  return Math.round(365 / turnoverRate)
}

/**
 * Check if inventory is expired
 */
export function isInventoryExpired(inventory: Inventory): boolean {
  if (!inventory.expiryDate) return false
  return new Date(inventory.expiryDate) < new Date()
}

/**
 * Get days until expiry
 */
export function getDaysUntilExpiry(expiryDate: string): number {
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diff = expiry.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

/**
 * Check if inventory is near expiry (within 30 days)
 */
export function isNearExpiry(inventory: Inventory): boolean {
  if (!inventory.expiryDate) return false
  const daysLeft = getDaysUntilExpiry(inventory.expiryDate)
  return daysLeft > 0 && daysLeft <= 30
}

// ==================== FILTERING & SORTING ====================

/**
 * Filter products by status
 */
export function filterProductsByStatus(products: Product[], statuses: ProductStatus[]): Product[] {
  return products.filter(p => statuses.includes(p.status))
}

/**
 * Get active products
 */
export function getActiveProducts(products: Product[]): Product[] {
  return filterProductsByStatus(products, ['active'])
}

/**
 * Get low stock products
 */
export function getLowStockProducts(products: Product[]): Product[] {
  return products.filter(p => needsReorder(p))
}

/**
 * Get out of stock products
 */
export function getOutOfStockProducts(products: Product[]): Product[] {
  return products.filter(p => p.trackQuantity && p.currentStock === 0)
}

/**
 * Sort products by name (A-Z)
 */
export function sortProductsByName(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Sort products by price (low to high)
 */
export function sortProductsByPrice(products: Product[], ascending: boolean = true): Product[] {
  return [...products].sort((a, b) => {
    const diff = a.basePrice - b.basePrice
    return ascending ? diff : -diff
  })
}

/**
 * Sort products by stock level (low to high)
 */
export function sortProductsByStock(products: Product[]): Product[] {
  return [...products].sort((a, b) => a.currentStock - b.currentStock)
}

/**
 * Sort products by total sales (high to low)
 */
export function sortProductsBySales(products: Product[]): Product[] {
  return [...products].sort((a, b) => b.totalSold - a.totalSold)
}

// ==================== SEARCH ====================

/**
 * Search products by name, SKU, or barcode
 */
export function searchProducts(products: Product[], query: string): Product[] {
  const lowercaseQuery = query.toLowerCase()

  return products.filter(product =>
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.sku.toLowerCase().includes(lowercaseQuery) ||
    product.barcode?.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery) ||
    product.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  )
}

// ==================== VALIDATION ====================

/**
 * Validate SKU format (alphanumeric with hyphens)
 */
export function isValidSKU(sku: string): boolean {
  const skuRegex = /^[A-Z0-9-]+$/i
  return skuRegex.test(sku)
}

/**
 * Validate barcode format (numeric, typically 8-13 digits)
 */
export function isValidBarcode(barcode: string): boolean {
  const barcodeRegex = /^[0-9]{8,13}$/
  return barcodeRegex.test(barcode)
}

/**
 * Validate price is positive
 */
export function isValidPrice(price: number): boolean {
  return price > 0
}

/**
 * Validate stock levels
 */
export function validateStockLevels(min: number, max: number, reorder: number): boolean {
  return min >= 0 && max >= min && reorder >= min && reorder <= max
}

// ==================== BUNDLE MANAGEMENT ====================

/**
 * Calculate bundle price
 */
export function calculateBundlePrice(product: Product, products: Product[]): number {
  if (!product.bundleItems) return product.basePrice

  return product.bundleItems.reduce((total, item) => {
    const bundleProduct = products.find(p => p.id === item.productId)
    if (!bundleProduct) return total
    return total + (bundleProduct.basePrice * item.quantity)
  }, 0)
}

/**
 * Check if bundle is in stock
 */
export function isBundleInStock(product: Product, products: Product[]): boolean {
  if (!product.bundleItems) return true

  return product.bundleItems.every(item => {
    const bundleProduct = products.find(p => p.id === item.productId)
    if (!bundleProduct) return false
    return bundleProduct.currentStock >= item.quantity
  })
}

// ==================== ANALYTICS ====================

/**
 * Calculate product performance score (0-100)
 */
export function calculateProductPerformance(product: Product): number {
  let score = 50 // Base score

  // Bonus for high sales
  if (product.totalSold > 100) score += 20
  else if (product.totalSold > 50) score += 10
  else if (product.totalSold > 10) score += 5

  // Bonus for good reviews
  if (product.averageRating) {
    if (product.averageRating >= 4.5) score += 20
    else if (product.averageRating >= 4.0) score += 15
    else if (product.averageRating >= 3.5) score += 10
    else if (product.averageRating >= 3.0) score += 5
    else score -= 10
  }

  // Bonus for high margin
  const margin = calculateProfitMargin(product.basePrice, product.costPrice)
  if (margin >= 50) score += 10
  else if (margin >= 30) score += 5

  // Penalty for out of stock
  if (product.status === 'out_of_stock') score -= 20

  return Math.max(0, Math.min(100, score))
}

/**
 * Get top selling products
 */
export function getTopSellingProducts(products: Product[], limit: number = 10): Product[] {
  return sortProductsBySales(products).slice(0, limit)
}

/**
 * Calculate revenue per product
 */
export function calculateProductRevenue(product: Product): number {
  return product.totalRevenue || (product.totalSold * product.basePrice)
}

/**
 * Calculate total inventory value
 */
export function calculateTotalInventoryValue(products: Product[]): number {
  return products.reduce((total, product) => {
    return total + calculateStockValue(product.currentStock, product.costPrice)
  }, 0)
}

/**
 * Generate product analytics summary
 */
export function generateProductAnalytics(products: Product[]): ProductAnalytics {
  const activeProducts = getActiveProducts(products)
  const lowStockProducts = getLowStockProducts(products)
  const outOfStockProducts = getOutOfStockProducts(products)

  const totalRevenue = products.reduce((sum, p) => sum + calculateProductRevenue(p), 0)
  const totalSold = products.reduce((sum, p) => sum + p.totalSold, 0)

  return {
    totalProducts: products.length,
    activeProducts: activeProducts.length,
    lowStockProducts: lowStockProducts.length,
    outOfStockProducts: outOfStockProducts.length,
    totalInventoryValue: calculateTotalInventoryValue(products),
    totalRevenue: totalRevenue,
    totalUnitsSold: totalSold,
    avgProductPrice: products.length > 0 ? products.reduce((sum, p) => sum + p.basePrice, 0) / products.length : 0,
    topSellingProducts: getTopSellingProducts(products, 5)
  }
}

// ==================== WEIGHT & DIMENSIONS ====================

/**
 * Convert weight to specified unit
 */
export function convertWeight(
  weight: number,
  fromUnit: 'kg' | 'lb' | 'g' | 'oz',
  toUnit: 'kg' | 'lb' | 'g' | 'oz'
): number {
  if (fromUnit === toUnit) return weight

  // Convert to kg first
  let kg: number
  switch (fromUnit) {
    case 'kg': kg = weight; break
    case 'g': kg = weight / 1000; break
    case 'lb': kg = weight * 0.453592; break
    case 'oz': kg = weight * 0.0283495; break
  }

  // Convert from kg to target unit
  switch (toUnit) {
    case 'kg': return kg
    case 'g': return kg * 1000
    case 'lb': return kg / 0.453592
    case 'oz': return kg / 0.0283495
  }
}

/**
 * Format dimensions display
 */
export function formatDimensions(
  length: number,
  width: number,
  height: number,
  unit: 'cm' | 'in' | 'm' | 'ft'
): string {
  return `${length} × ${width} × ${height} ${unit}`
}

/**
 * Calculate volume
 */
export function calculateVolume(length: number, width: number, height: number): number {
  return length * width * height
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Generate SKU from product name
 */
export function generateSKU(productName: string, variant?: string): string {
  const cleaned = productName.replace(/[^a-zA-Z0-9]/g, '').toUpperCase()
  const timestamp = Date.now().toString().slice(-4)
  const variantPart = variant ? `-${variant.substring(0, 3).toUpperCase()}` : ''
  return `${cleaned.substring(0, 6)}-${timestamp}${variantPart}`
}

/**
 * Check if product is digital
 */
export function isDigitalProduct(product: Product): boolean {
  return product.type === 'digital'
}

/**
 * Check if product is shippable
 */
export function isShippable(product: Product): boolean {
  return product.isShippable && product.type === 'physical'
}
