'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, X, Package, DollarSign, Hash, Truck,
  Image, Upload, Edit, Trash2, Archive, AlertTriangle,
  CheckCircle, Tag, Monitor, HardDrive, Printer, Scanner,
  Cpu, Mouse, Keyboard, Headphones, Camera, Box, Plus, Minus
} from 'lucide-react'

// Mock product data
const mockProduct = {
  id: 'prod1',
  name: 'Dell UltraSharp 27" Monitor',
  category: 'Monitor',
  type: 'hardware',
  serialNumber: 'DL-MON-2024-001',
  vendor: 'Dell Technologies',
  vendorId: 'v1',
  purchasePrice: 599.99,
  sellingPrice: 899.99,
  stock: 12,
  minStock: 5,
  maxStock: 50,
  warranty: '3 years',
  status: 'in_stock',
  condition: 'new',
  location: 'Warehouse A - Shelf B2',
  description: 'Professional 27-inch 4K UHD monitor with excellent color accuracy and multiple connectivity options.',
  sku: 'DELL-MON-27-4K',
  barcode: '1234567890123',
  weight: 5.2,
  dimensions: {
    length: 24.1,
    width: 8.3,
    height: 14.3
  },
  specifications: {
    size: '27 inches',
    resolution: '4K UHD (3840 x 2160)',
    refreshRate: '60Hz',
    connectivity: 'HDMI, DisplayPort, USB-C',
    panelType: 'IPS',
    brightness: '350 nits'
  },
  images: [],
  tags: ['Professional', '4K', 'IPS'],
  notes: 'Popular item with high demand. Order more when stock reaches minimum level.',
  createdAt: '2024-01-15',
  lastModified: '2024-03-20'
}

const categoryIcons = {
  'Monitor': Monitor,
  'Scanner': Scanner,
  'Mouse': Mouse,
  'Printer': Printer,
  'Keyboard': Keyboard,
  'Camera': Camera,
  'Storage': HardDrive,
  'Computer': Cpu,
  'Audio': Headphones
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('basic')
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    name: mockProduct.name,
    category: mockProduct.category,
    type: mockProduct.type,
    serialNumber: mockProduct.serialNumber,
    vendor: mockProduct.vendor,
    purchasePrice: mockProduct.purchasePrice,
    sellingPrice: mockProduct.sellingPrice,
    stock: mockProduct.stock,
    minStock: mockProduct.minStock,
    maxStock: mockProduct.maxStock,
    warranty: mockProduct.warranty,
    status: mockProduct.status,
    condition: mockProduct.condition,
    location: mockProduct.location,
    description: mockProduct.description,
    sku: mockProduct.sku,
    barcode: mockProduct.barcode,
    weight: mockProduct.weight,
    dimensions: mockProduct.dimensions,
    specifications: mockProduct.specifications,
    tags: mockProduct.tags,
    notes: mockProduct.notes
  })

  const categories = [
    'Monitor', 'Scanner', 'Mouse', 'Printer', 'Keyboard', 'Camera',
    'Storage', 'Computer', 'Audio', 'Networking', 'Software', 'Accessories'
  ]

  const vendors = [
    'Dell Technologies', 'HP Inc.', 'Logitech', 'Brother Industries',
    'Canon', 'Epson', 'Microsoft', 'Apple', 'Lenovo', 'ASUS'
  ]

  const statusOptions = [
    { value: 'in_stock', label: 'In Stock', color: 'text-green-400' },
    { value: 'low_stock', label: 'Low Stock', color: 'text-yellow-400' },
    { value: 'out_of_stock', label: 'Out of Stock', color: 'text-red-400' },
    { value: 'discontinued', label: 'Discontinued', color: 'text-gray-400' },
    { value: 'on_order', label: 'On Order', color: 'text-blue-400' }
  ]

  const conditionOptions = [
    'new', 'refurbished', 'used', 'damaged'
  ]

  const availableTags = [
    'Professional', '4K', 'IPS', 'Gaming', 'Wireless', 'USB-C',
    'High-Performance', 'Ergonomic', 'Portable', 'Energy Efficient'
  ]

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: Package },
    { id: 'pricing', label: 'Pricing & Stock', icon: DollarSign },
    { id: 'details', label: 'Specifications', icon: Edit },
    { id: 'inventory', label: 'Inventory & Location', icon: Box },
    { id: 'settings', label: 'Settings & Actions', icon: AlertTriangle }
  ]

  const handleSave = () => {
    console.log('Updating product:', formData)
    router.push(`/dashboard/products/${params.id}`)
  }

  const handleDelete = () => {
    setIsDeleting(true)
    setTimeout(() => {
      router.push('/dashboard/products')
    }, 1000)
  }

  const updateSpecification = (key: string, value: string) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [key]: value
      }
    })
  }

  const updateDimension = (key: string, value: number) => {
    setFormData({
      ...formData,
      dimensions: {
        ...formData.dimensions,
        [key]: value
      }
    })
  }

  const toggleTag = (tag: string) => {
    const tags = formData.tags
    if (tags.includes(tag)) {
      setFormData({
        ...formData,
        tags: tags.filter(t => t !== tag)
      })
    } else {
      setFormData({
        ...formData,
        tags: [...tags, tag]
      })
    }
  }

  const Icon = categoryIcons[formData.category as keyof typeof categoryIcons] || Package

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/products/${params.id}`}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Product</h1>
            <p className="text-gray-400">Update product information and specifications</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push(`/dashboard/products/${params.id}`)}
            className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2"
          >
            <X className="h-4 w-4" />
            <span>Cancel</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-4">
          <nav className="space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>

          {/* Product Preview */}
          <div className="mt-6 pt-6 border-t border-gray-800">
            <h3 className="text-sm font-medium text-gray-400 mb-3">Product Preview</h3>
            <div className="p-4 rounded-lg bg-gray-800/30">
              <div className="flex items-center space-x-3 mb-3">
                <Icon className="h-8 w-8 text-purple-400" />
                <div>
                  <p className="text-white font-medium text-sm">{formData.name}</p>
                  <p className="text-xs text-gray-400">{formData.serialNumber}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Stock</span>
                  <span className="text-white">{formData.stock}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Price</span>
                  <span className="text-green-400">${formData.sellingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status</span>
                  <span className={statusOptions.find(s => s.value === formData.status)?.color}>
                    {statusOptions.find(s => s.value === formData.status)?.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    <option value="hardware">Hardware</option>
                    <option value="software">Software</option>
                    <option value="accessory">Accessory</option>
                    <option value="consumable">Consumable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Serial Number</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.serialNumber}
                      onChange={(e) => setFormData({ ...formData, serialNumber: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Vendor</label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    {vendors.map(vendor => (
                      <option key={vendor} value={vendor}>{vendor}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Barcode</label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Product Images</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-32 rounded-xl bg-gray-800 border-2 border-dashed border-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <Image className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-xs text-gray-500">No Images</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors flex items-center space-x-2">
                      <Upload className="h-4 w-4" />
                      <span>Upload Images</span>
                    </button>
                    <p className="text-xs text-gray-500">Support: JPG, PNG, WebP (Max 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Pricing & Stock Tab */}
          {activeTab === 'pricing' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Pricing & Stock Management</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Purchase Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.purchasePrice}
                      onChange={(e) => setFormData({ ...formData, purchasePrice: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Selling Price</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.01"
                      value={formData.sellingPrice}
                      onChange={(e) => setFormData({ ...formData, sellingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Current Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Minimum Stock Level</label>
                  <input
                    type="number"
                    value={formData.minStock}
                    onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Maximum Stock Level</label>
                  <input
                    type="number"
                    value={formData.maxStock}
                    onChange={(e) => setFormData({ ...formData, maxStock: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Warranty Period</label>
                  <input
                    type="text"
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    placeholder="e.g., 3 years, 1 year, 6 months"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Condition</label>
                  <select
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    {conditionOptions.map(condition => (
                      <option key={condition} value={condition}>
                        {condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  >
                    {statusOptions.map(status => (
                      <option key={status.value} value={status.value}>{status.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-800/30">
                <h3 className="text-lg font-medium text-white mb-3">Pricing Analysis</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Profit Margin</p>
                    <p className="text-lg font-bold text-green-400">
                      {((formData.sellingPrice - formData.purchasePrice) / formData.sellingPrice * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Profit per Unit</p>
                    <p className="text-lg font-bold text-white">
                      ${(formData.sellingPrice - formData.purchasePrice).toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Total Stock Value</p>
                    <p className="text-lg font-bold text-blue-400">
                      ${(formData.stock * formData.purchasePrice).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Specifications Tab */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Specifications & Details</h2>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                  <div className="relative">
                    <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                      placeholder="e.g., Warehouse A - Shelf B2"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Dimensions (cm)</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Length</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.dimensions.length}
                      onChange={(e) => updateDimension('length', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Width</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.dimensions.width}
                      onChange={(e) => updateDimension('width', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Height</label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.dimensions.height}
                      onChange={(e) => updateDimension('height', parseFloat(e.target.value) || 0)}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-4">Technical Specifications</h3>
                <div className="space-y-4">
                  {Object.entries(formData.specifications).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 gap-4 items-center">
                      <label className="text-sm font-medium text-gray-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </label>
                      <div className="col-span-2">
                        <input
                          type="text"
                          value={value}
                          onChange={(e) => updateSpecification(key, e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Additional notes or comments about this product"
                />
              </div>
            </div>
          )}

          {/* Inventory & Location Tab */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Inventory Management</h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 rounded-xl bg-gray-800/30">
                  <h3 className="text-lg font-medium text-white mb-4">Stock Levels</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Current Stock</span>
                      <span className="text-2xl font-bold text-white">{formData.stock}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Minimum Level</span>
                      <span className="text-yellow-400 font-medium">{formData.minStock}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Maximum Level</span>
                      <span className="text-blue-400 font-medium">{formData.maxStock}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-4">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500"
                        style={{
                          width: `${Math.min((formData.stock / formData.maxStock) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-xl bg-gray-800/30">
                  <h3 className="text-lg font-medium text-white mb-4">Value Analysis</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Purchase Value</span>
                      <span className="text-white font-medium">
                        ${(formData.stock * formData.purchasePrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Selling Value</span>
                      <span className="text-green-400 font-medium">
                        ${(formData.stock * formData.sellingPrice).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Potential Profit</span>
                      <span className="text-blue-400 font-medium">
                        ${(formData.stock * (formData.sellingPrice - formData.purchasePrice)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-gray-800/30">
                <h3 className="text-lg font-medium text-white mb-3">Stock Alerts</h3>
                <div className="space-y-3">
                  {formData.stock <= formData.minStock && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="text-yellow-400 font-medium">Low Stock Alert</p>
                        <p className="text-sm text-gray-400">Current stock is at or below minimum level</p>
                      </div>
                    </div>
                  )}

                  {formData.stock === 0 && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                      <AlertTriangle className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="text-red-400 font-medium">Out of Stock</p>
                        <p className="text-sm text-gray-400">This product is currently out of stock</p>
                      </div>
                    </div>
                  )}

                  {formData.stock > formData.minStock && formData.stock < formData.maxStock && (
                    <div className="flex items-center space-x-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="text-green-400 font-medium">Stock Level Healthy</p>
                        <p className="text-sm text-gray-400">Stock levels are within normal range</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Settings & Actions Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white mb-6">Product Settings & Actions</h2>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-4">Product Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => {
                    const isSelected = formData.tags.includes(tag)
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                          isSelected
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
                        }`}
                      >
                        <Tag className="h-3 w-3 inline mr-1" />
                        {tag}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-center">
                    <Package className="h-6 w-6 text-blue-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Create Purchase Order</p>
                    <p className="text-xs text-gray-400">Restock this product</p>
                  </button>

                  <button className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-center">
                    <Edit className="h-6 w-6 text-green-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Update Stock</p>
                    <p className="text-xs text-gray-400">Adjust stock levels</p>
                  </button>

                  <button className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-center">
                    <Truck className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Move Location</p>
                    <p className="text-xs text-gray-400">Change storage location</p>
                  </button>

                  <button className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-center">
                    <DollarSign className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                    <p className="text-white font-medium">Price History</p>
                    <p className="text-xs text-gray-400">View price changes</p>
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-800 pt-6">
                <h3 className="text-lg font-medium text-white mb-4 flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  Danger Zone
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
                    <div>
                      <p className="text-white font-medium">Archive Product</p>
                      <p className="text-sm text-gray-400">Hide this product from active inventory</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg border border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 transition-colors flex items-center space-x-2">
                      <Archive className="h-4 w-4" />
                      <span>Archive</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                    <div>
                      <p className="text-white font-medium">Delete Product</p>
                      <p className="text-sm text-gray-400">Permanently delete this product and all associated data</p>
                    </div>
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}