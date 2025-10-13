'use client'

import { useState } from 'react'
import {
  Edit, Trash2, Plus, Search, MoreVertical, Eye, EyeOff,
  GripVertical, Check, X, AlertCircle
} from 'lucide-react'

export interface SettingsItem {
  id: string
  name: string
  slug?: string
  description?: string
  color?: string
  icon?: string
  isActive?: boolean
  isDefault?: boolean
  order?: number
  usageCount?: number
  [key: string]: any
}

interface SettingsItemListProps {
  items: SettingsItem[]
  title: string
  description?: string
  onAdd: () => void
  onEdit: (item: SettingsItem) => void
  onDelete: (id: string) => void
  onToggleActive?: (id: string) => void
  onReorder?: (items: SettingsItem[]) => void
  showColor?: boolean
  showUsage?: boolean
  showIcon?: boolean
  addButtonText?: string
  emptyMessage?: string
}

export default function SettingsItemList({
  items,
  title,
  description,
  onAdd,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
  showColor = false,
  showUsage = false,
  showIcon = false,
  addButtonText = 'Add New',
  emptyMessage = 'No items found'
}: SettingsItemListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const handleDragStart = (id: string) => {
    setDraggedItem(id)
  }

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem === targetId) return

    const draggedIndex = items.findIndex(item => item.id === draggedItem)
    const targetIndex = items.findIndex(item => item.id === targetId)

    const newItems = [...items]
    const [removed] = newItems.splice(draggedIndex, 1)
    newItems.splice(targetIndex, 0, removed)

    onReorder?.(newItems)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item.id))
    }
  }

  const handleDeleteSelected = () => {
    if (confirm(`Delete ${selectedItems.length} selected items?`)) {
      selectedItems.forEach(id => onDelete(id))
      setSelectedItems([])
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          {description && <p className="text-gray-400 text-sm mt-1">{description}</p>}
        </div>
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>{addButtonText}</span>
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-all"
          />
        </div>

        {selectedItems.length > 0 && (
          <button
            onClick={handleDeleteSelected}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete ({selectedItems.length})</span>
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="h-12 w-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">{emptyMessage}</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {/* Header */}
            <div className="px-6 py-3 bg-gray-800/50 flex items-center">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredItems.length}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
              />
              <div className="flex-1 ml-4 flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-400 w-1/3">Name</span>
                {showColor && <span className="text-sm font-medium text-gray-400 w-20">Color</span>}
                <span className="text-sm font-medium text-gray-400 flex-1">Description</span>
                {showUsage && <span className="text-sm font-medium text-gray-400 w-24">Usage</span>}
                <span className="text-sm font-medium text-gray-400 w-24">Status</span>
                <span className="text-sm font-medium text-gray-400 w-32">Actions</span>
              </div>
            </div>

            {/* Items */}
            {filteredItems.map((item) => (
              <div
                key={item.id}
                draggable={!!onReorder}
                onDragStart={() => handleDragStart(item.id)}
                onDragOver={(e) => handleDragOver(e, item.id)}
                onDragEnd={handleDragEnd}
                className={`px-6 py-4 flex items-center hover:bg-gray-800/30 transition-colors ${
                  draggedItem === item.id ? 'opacity-50' : ''
                } ${selectedItems.includes(item.id) ? 'bg-purple-500/10' : ''}`}
              >
                {onReorder && (
                  <GripVertical className="h-5 w-5 text-gray-600 mr-2 cursor-move" />
                )}
                <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedItems([...selectedItems, item.id])
                    } else {
                      setSelectedItems(selectedItems.filter(id => id !== item.id))
                    }
                  }}
                  className="w-4 h-4 rounded border-gray-600 bg-gray-700 text-purple-600 focus:ring-purple-500 focus:ring-offset-0"
                />

                <div className="flex-1 ml-4 flex items-center space-x-4">
                  {/* Name */}
                  <div className="w-1/3">
                    <div className="flex items-center space-x-2">
                      {showIcon && item.icon && (
                        <span className="text-lg">{item.icon}</span>
                      )}
                      <div>
                        <p className="text-white font-medium">{item.name}</p>
                        {item.slug && (
                          <p className="text-xs text-gray-500 font-mono">{item.slug}</p>
                        )}
                      </div>
                    </div>
                    {item.isDefault && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-blue-500/20 text-blue-400 mt-1">
                        Default
                      </span>
                    )}
                  </div>

                  {/* Color */}
                  {showColor && (
                    <div className="w-20">
                      {item.color && (
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-6 h-6 rounded border border-gray-600"
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-xs text-gray-400 font-mono">{item.color}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  <div className="flex-1">
                    <p className="text-sm text-gray-400">{item.description || '-'}</p>
                  </div>

                  {/* Usage */}
                  {showUsage && (
                    <div className="w-24">
                      <span className="text-sm text-gray-400">{item.usageCount || 0} uses</span>
                    </div>
                  )}

                  {/* Status */}
                  <div className="w-24">
                    {onToggleActive ? (
                      <button
                        onClick={() => onToggleActive(item.id)}
                        className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium transition-colors ${
                          item.isActive
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30'
                        }`}
                      >
                        {item.isActive ? <Eye className="h-3 w-3 mr-1" /> : <EyeOff className="h-3 w-3 mr-1" />}
                        {item.isActive ? 'Active' : 'Inactive'}
                      </button>
                    ) : (
                      <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${
                        item.isActive
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-gray-500/20 text-gray-400'
                      }`}>
                        {item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="w-32 flex items-center space-x-2">
                    <button
                      onClick={() => onEdit(item)}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${item.name}"?`)) {
                          onDelete(item.id)
                        }
                      }}
                      className="p-2 rounded-lg bg-gray-800 hover:bg-red-600 text-gray-300 hover:text-white transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      {filteredItems.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>
            Showing {filteredItems.length} of {items.length} items
            {selectedItems.length > 0 && ` · ${selectedItems.length} selected`}
          </span>
          <span>
            {items.filter(item => item.isActive).length} active · {items.filter(item => !item.isActive).length} inactive
          </span>
        </div>
      )}
    </div>
  )
}
