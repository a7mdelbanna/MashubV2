'use client'

import { useState } from 'react'
import { Package, TrendingDown, AlertTriangle, TrendingUp, Search, Filter, Calendar, ArrowUpDown } from 'lucide-react'

interface InventoryItem {
  id: string
  productName: string
  sku: string
  category: string
  stock: number
  threshold: number
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
  value: number
  lastUpdated: string
}

const mockInventory: InventoryItem[] = [
  { id: 'i1', productName: 'Enterprise License', sku: 'ENT-001', category: 'Software', stock: 150, threshold: 50, status: 'in_stock', value: 299, lastUpdated: '2024-03-01' },
  { id: 'i2', productName: 'Professional Services', sku: 'SVC-001', category: 'Services', stock: 0, threshold: 0, status: 'in_stock', value: 0, lastUpdated: '2024-03-02' },
  { id: 'i3', productName: 'Hardware Device', sku: 'HW-001', category: 'Hardware', stock: 15, threshold: 20, status: 'low_stock', value: 599, lastUpdated: '2024-02-28' },
  { id: 'i4', productName: 'Cloud Storage', sku: 'CLD-001', category: 'SaaS', stock: 0, threshold: 0, status: 'in_stock', value: 49, lastUpdated: '2024-03-03' },
  { id: 'i5', productName: 'Premium Support', sku: 'SUP-001', category: 'Services', stock: 0, threshold: 0, status: 'in_stock', value: 199, lastUpdated: '2024-03-01' }
]

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const stats = {
    totalItems: inventory.filter(i => i.stock > 0).length,
    lowStock: inventory.filter(i => i.status === 'low_stock').length,
    outOfStock: inventory.filter(i => i.status === 'out_of_stock').length,
    totalValue: inventory.reduce((sum, i) => sum + (i.stock * i.value), 0)
  }

  const filteredInventory = inventory.filter(i =>
    filterStatus === 'all' || i.status === filterStatus
  )

  return (
    <div className="p-8 max-w-[1400px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Inventory Management</h1>
          <p className="text-gray-400">Track and manage product stock levels</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.totalItems}</p>
          <p className="text-sm text-gray-400">Items in Stock</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.lowStock}</p>
          <p className="text-sm text-gray-400">Low Stock</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingDown className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.outOfStock}</p>
          <p className="text-sm text-gray-400">Out of Stock</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(stats.totalValue / 1000).toFixed(0)}k</p>
          <p className="text-sm text-gray-400">Inventory Value</p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredInventory.map((item) => (
          <div key={item.id} className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-white">{item.productName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.status === 'in_stock' ? 'bg-green-500/20 text-green-400' :
                    item.status === 'low_stock' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {item.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>SKU: {item.sku}</span>
                  <span>•</span>
                  <span>{item.category}</span>
                  <span>•</span>
                  <span>Updated {new Date(item.lastUpdated).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-white mb-1">{item.stock}</p>
                <p className="text-sm text-gray-400">units</p>
                {item.threshold > 0 && (
                  <p className="text-xs text-gray-500 mt-1">Threshold: {item.threshold}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
