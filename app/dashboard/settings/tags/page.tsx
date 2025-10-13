'use client'

import { useState, useEffect } from 'react'
import { Tag, AlertCircle, Briefcase, Rocket, Package, Users, FileText, MapPin } from 'lucide-react'
import SettingsItemList, { SettingsItem } from '@/components/settings/SettingsItemList'
import SettingsItemForm from '@/components/settings/SettingsItemForm'
import {
  STORAGE_KEYS,
  getSettings,
  addSettingsItem,
  updateSettingsItem,
  deleteSettingsItem,
  toggleSettingsItemActive,
  reorderSettings
} from '@/lib/settings-data'

type TagModule = 'projects' | 'services' | 'products' | 'clients'

export default function TagsSettingsPage() {
  const [activeModule, setActiveModule] = useState<TagModule>('projects')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SettingsItem | null>(null)

  const [projectTags, setProjectTags] = useState<SettingsItem[]>([])
  const [serviceTags, setServiceTags] = useState<SettingsItem[]>([])
  const [productTags, setProductTags] = useState<SettingsItem[]>([])
  const [clientTags, setClientTags] = useState<SettingsItem[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setProjectTags(getSettings(STORAGE_KEYS.PROJECT_TAGS))
    setServiceTags(getSettings(STORAGE_KEYS.SERVICE_TAGS))
    setProductTags(getSettings(STORAGE_KEYS.PRODUCT_TAGS))
    setClientTags(getSettings(STORAGE_KEYS.CLIENT_TAGS))
  }

  const getCurrentData = () => {
    switch (activeModule) {
      case 'projects': return projectTags
      case 'services': return serviceTags
      case 'products': return productTags
      case 'clients': return clientTags
    }
  }

  const getCurrentStorageKey = () => {
    switch (activeModule) {
      case 'projects': return STORAGE_KEYS.PROJECT_TAGS
      case 'services': return STORAGE_KEYS.SERVICE_TAGS
      case 'products': return STORAGE_KEYS.PRODUCT_TAGS
      case 'clients': return STORAGE_KEYS.CLIENT_TAGS
    }
  }

  const getCurrentConfig = () => {
    const configs = {
      projects: {
        title: 'Project Tags',
        description: 'Tags for organizing and filtering projects',
        icon: Briefcase,
        color: 'from-blue-600 to-blue-500'
      },
      services: {
        title: 'Service Tags',
        description: 'Tags for categorizing services',
        icon: Rocket,
        color: 'from-purple-600 to-purple-500'
      },
      products: {
        title: 'Product Tags',
        description: 'Tags for labeling products',
        icon: Package,
        color: 'from-green-600 to-green-500'
      },
      clients: {
        title: 'Client Tags',
        description: 'Tags for organizing clients',
        icon: Users,
        color: 'from-pink-600 to-pink-500'
      }
    }
    return configs[activeModule]
  }

  const handleSave = (data: Partial<SettingsItem>) => {
    const storageKey = getCurrentStorageKey()
    if (editingItem) {
      updateSettingsItem(storageKey, editingItem.id, data)
    } else {
      addSettingsItem(storageKey, data)
    }
    loadData()
    setIsFormOpen(false)
    setEditingItem(null)
  }

  const modules = [
    { id: 'projects' as TagModule, label: 'Projects', icon: Briefcase, count: projectTags.length },
    { id: 'services' as TagModule, label: 'Services', icon: Rocket, count: serviceTags.length },
    { id: 'products' as TagModule, label: 'Products', icon: Package, count: productTags.length },
    { id: 'clients' as TagModule, label: 'Clients', icon: Users, count: clientTags.length }
  ]

  const config = getCurrentConfig()
  const ConfigIcon = config.icon

  // Calculate total tags
  const totalTags = projectTags.length + serviceTags.length + productTags.length + clientTags.length
  const activeTags = [
    ...projectTags.filter(t => t.isActive),
    ...serviceTags.filter(t => t.isActive),
    ...productTags.filter(t => t.isActive),
    ...clientTags.filter(t => t.isActive)
  ].length

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600">
              <Tag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Tags & Labels Manager</h1>
              <p className="text-gray-400">Manage tags across all modules</p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-2xl font-bold text-white">{totalTags}</p>
              <p className="text-sm text-gray-400">Total Tags</p>
            </div>
            <div className="h-12 w-px bg-gray-700" />
            <div className="text-right">
              <p className="text-2xl font-bold text-green-400">{activeTags}</p>
              <p className="text-sm text-gray-400">Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium">Centralized Tag Management</p>
            <p className="text-blue-400/80 text-sm mt-1">
              Create and manage tags for all modules in one place. Tags help organize, filter, and search across your platform.
            </p>
          </div>
        </div>
      </div>

      {/* Module Selector */}
      <div className="grid grid-cols-4 gap-4">
        {modules.map((module) => {
          const ModuleIcon = module.icon
          const isActive = activeModule === module.id

          return (
            <button
              key={module.id}
              onClick={() => setActiveModule(module.id)}
              className={`p-4 rounded-xl border-2 transition-all ${
                isActive
                  ? 'border-purple-500 bg-purple-500/10'
                  : 'border-gray-700 bg-gray-800/30 hover:border-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <ModuleIcon className={`h-5 w-5 ${isActive ? 'text-purple-400' : 'text-gray-400'}`} />
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                  isActive
                    ? 'bg-purple-500/20 text-purple-300'
                    : 'bg-gray-700 text-gray-400'
                }`}>
                  {module.count}
                </span>
              </div>
              <p className={`font-medium ${isActive ? 'text-white' : 'text-gray-300'}`}>
                {module.label}
              </p>
            </button>
          )
        })}
      </div>

      {/* Current Module Header */}
      <div className="flex items-center space-x-3 pt-4">
        <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
          <ConfigIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{config.title}</h2>
          <p className="text-sm text-gray-400">{config.description}</p>
        </div>
      </div>

      {/* Tags List */}
      <div className="rounded-2xl bg-gray-900/30 backdrop-blur-xl border border-gray-800 p-6">
        <SettingsItemList
          items={getCurrentData()}
          title={config.title}
          description={config.description}
          onAdd={() => { setEditingItem(null); setIsFormOpen(true) }}
          onEdit={(item) => { setEditingItem(item); setIsFormOpen(true) }}
          onDelete={(id) => { deleteSettingsItem(getCurrentStorageKey(), id); loadData() }}
          onToggleActive={(id) => { toggleSettingsItemActive(getCurrentStorageKey(), id); loadData() }}
          onReorder={(newOrder) => { reorderSettings(getCurrentStorageKey(), newOrder); loadData() }}
          showColor={true}
          addButtonText="Add Tag"
          emptyMessage={`No ${config.title.toLowerCase()} configured`}
        />
      </div>

      <SettingsItemForm
        item={editingItem}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingItem(null) }}
        onSave={handleSave}
        title={`${config.title.replace(/s$/, '')}`}
        showColor={true}
      />
    </div>
  )
}
