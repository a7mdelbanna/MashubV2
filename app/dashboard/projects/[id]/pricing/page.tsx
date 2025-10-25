'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  DollarSign, Plus, Search, Filter, Package,
  Users, TrendingUp, Edit, Trash2, Copy,
  ChevronDown, Star, Calendar, MoreVertical,
  ArrowLeft, X, Check, Puzzle, Zap, Tag
} from 'lucide-react'
import { MOCK_PRICING_CATALOG, MOCK_FEATURE_ADDONS, MOCK_PROJECTS } from '@/lib/mock-project-data'
import { PricingCatalogItem, FeatureAddon } from '@/types'
import Link from 'next/link'

type ViewTab = 'packages' | 'addons'

export default function ProjectPricingPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string

  const [activeTab, setActiveTab] = useState<ViewTab>('packages')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedModel, setSelectedModel] = useState('all')
  const [showNewPackageModal, setShowNewPackageModal] = useState(false)
  const [showNewAddonModal, setShowNewAddonModal] = useState(false)
  const [editingPackage, setEditingPackage] = useState<PricingCatalogItem | null>(null)
  const [editingAddon, setEditingAddon] = useState<FeatureAddon | null>(null)

  // Get project
  const project = MOCK_PROJECTS.find(p => p.id === projectId)

  // Get pricing catalog and addons for this project
  const projectCatalog = MOCK_PRICING_CATALOG.filter(item => item.projectId === projectId)
  const projectAddons = MOCK_FEATURE_ADDONS.filter(addon => addon.projectId === projectId)

  // Filter based on active tab
  const filteredCatalog = projectCatalog.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModel = selectedModel === 'all' || item.pricing.model === selectedModel
    return matchesSearch && matchesModel
  })

  const filteredAddons = projectAddons.filter(addon => {
    const matchesSearch = addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         addon.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesModel = selectedModel === 'all' ||
                        (addon.pricing?.model === selectedModel) ||
                        (selectedModel === 'free' && !addon.pricing)
    return matchesSearch && matchesModel
  })

  // Calculate stats for packages
  const packageStats = {
    total: projectCatalog.length,
    totalApps: projectCatalog.reduce((sum, item) => sum + item.appsUsing, 0),
    avgPrice: projectCatalog.length > 0
      ? Math.round(projectCatalog.reduce((sum, item) => sum + item.pricing.amount, 0) / projectCatalog.length)
      : 0,
    categories: new Set(projectCatalog.map(item => item.category)).size
  }

  // Calculate stats for addons
  const addonStats = {
    total: projectAddons.length,
    totalApps: projectAddons.reduce((sum, addon) => sum + addon.appsUsing, 0),
    avgPrice: projectAddons.filter(a => a.pricing).length > 0
      ? Math.round(projectAddons.filter(a => a.pricing).reduce((sum, addon) => sum + (addon.pricing?.amount || 0), 0) / projectAddons.filter(a => a.pricing).length)
      : 0,
    freeAddons: projectAddons.filter(a => !a.pricing).length
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href={`/dashboard/projects/${projectId}`}>
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <ArrowLeft className="h-5 w-5 text-gray-400" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Pricing & Addons</h1>
            <p className="text-gray-400">Manage pricing packages and feature addons for {project?.name || 'this project'}</p>
          </div>
        </div>
        <button
          onClick={() => activeTab === 'packages' ? setShowNewPackageModal(true) : setShowNewAddonModal(true)}
          className="px-6 py-3 rounded-xl gradient-green text-white font-medium hover:opacity-90 transition-opacity shadow-lg flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          {activeTab === 'packages' ? 'New Package' : 'New Addon'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-800">
        <button
          onClick={() => setActiveTab('packages')}
          className={cn(
            "px-6 py-3 font-medium transition-all border-b-2 flex items-center gap-2",
            activeTab === 'packages'
              ? "text-purple-400 border-purple-500"
              : "text-gray-400 border-transparent hover:text-white"
          )}
        >
          <Package className="h-5 w-5" />
          Packages
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs",
            activeTab === 'packages' ? "bg-purple-500/20 text-purple-400" : "bg-gray-800 text-gray-400"
          )}>
            {projectCatalog.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('addons')}
          className={cn(
            "px-6 py-3 font-medium transition-all border-b-2 flex items-center gap-2",
            activeTab === 'addons'
              ? "text-green-400 border-green-500"
              : "text-gray-400 border-transparent hover:text-white"
          )}
        >
          <Puzzle className="h-5 w-5" />
          Addons
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs",
            activeTab === 'addons' ? "bg-green-500/20 text-green-400" : "bg-gray-800 text-gray-400"
          )}>
            {projectAddons.length}
          </span>
        </button>
      </div>

      {/* Statistics Cards */}
      {activeTab === 'packages' ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl gradient-purple">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{packageStats.total}</span>
            </div>
            <p className="text-gray-400 text-sm">Total Packages</p>
          </div>

          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl gradient-blue">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{packageStats.totalApps}</span>
            </div>
            <p className="text-gray-400 text-sm">Apps Using</p>
          </div>

          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl gradient-green">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">${packageStats.avgPrice.toLocaleString()}</span>
            </div>
            <p className="text-gray-400 text-sm">Avg. Price</p>
          </div>

          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl gradient-orange">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{packageStats.categories}</span>
            </div>
            <p className="text-gray-400 text-sm">Categories</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl gradient-green">
                <Puzzle className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{addonStats.total}</span>
            </div>
            <p className="text-gray-400 text-sm">Total Addons</p>
          </div>

          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl gradient-blue">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{addonStats.totalApps}</span>
            </div>
            <p className="text-gray-400 text-sm">Apps Using</p>
          </div>

          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl gradient-purple">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">${addonStats.avgPrice.toLocaleString()}</span>
            </div>
            <p className="text-gray-400 text-sm">Avg. Price (Paid)</p>
          </div>

          <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl gradient-orange">
                <Tag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">{addonStats.freeAddons}</span>
            </div>
            <p className="text-gray-400 text-sm">Free Addons</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Model Filter */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="px-4 py-3 rounded-xl bg-gray-800/50 border border-gray-700 text-white focus:bg-gray-800 focus:border-purple-500 focus:outline-none transition-colors"
          >
            <option value="all">All Models</option>
            <option value="subscription">Subscription</option>
            <option value="one_time">One-Time</option>
            <option value="usage_based">Usage Based</option>
            {activeTab === 'addons' && <option value="free">Free</option>}
            {activeTab === 'packages' && <option value="custom">Custom</option>}
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {activeTab === 'packages' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCatalog.map((item) => {
            const isPopular = item.appsUsing >= 2

            return (
              <div
                key={item.id}
                className="relative rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all duration-150 group"
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-xs font-bold text-white flex items-center gap-1 shadow-lg">
                    <Star className="h-3 w-3 fill-current" />
                    Popular
                  </div>
                )}

                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-5 w-5 text-purple-400" />
                    <h3 className="text-lg font-bold text-white">{item.name}</h3>
                  </div>
                  {item.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4 pb-4 border-b border-gray-700">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-purple-400">
                      ${item.pricing.amount.toLocaleString()}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {item.pricing.currency}
                      {item.pricing.interval && ` / ${item.pricing.interval}`}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 capitalize">
                    {item.pricing.model.replace('_', ' ')} pricing
                  </p>
                </div>

                {/* Category */}
                <div className="mb-4">
                  <span className="px-2 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-medium">
                    {item.category}
                  </span>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <p className="text-xs font-medium text-gray-400 mb-2">Features:</p>
                  <ul className="space-y-1">
                    {item.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-xs">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                    {item.features.length > 3 && (
                      <li className="text-xs text-gray-500 pl-5">
                        +{item.features.length - 3} more
                      </li>
                    )}
                  </ul>
                </div>

                {/* Usage Stats */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Users className="h-3.5 w-3.5" />
                      <span>{item.appsUsing} app{item.appsUsing !== 1 ? 's' : ''}</span>
                    </div>
                    {item.migratedFrom && (
                      <div className="flex items-center gap-1 text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>Migrated</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => setEditingPackage(item)}
                    className="flex-1 px-3 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                    <Copy className="h-4 w-4 text-gray-400" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-800 hover:bg-red-900/50 hover:border-red-500 transition-colors">
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAddons.map((addon) => {
            const isPaid = !!addon.pricing
            const isPopular = addon.appsUsing >= 3

            return (
              <div
                key={addon.id}
                className="relative rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6 hover:border-green-500/50 transition-all duration-150 group"
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-green-600 to-emerald-600 text-xs font-bold text-white flex items-center gap-1 shadow-lg">
                    <Zap className="h-3 w-3 fill-current" />
                    Popular
                  </div>
                )}

                {/* Header */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Puzzle className="h-5 w-5 text-green-400" />
                    <h3 className="text-lg font-bold text-white">{addon.name}</h3>
                  </div>
                  {addon.description && (
                    <p className="text-sm text-gray-400 line-clamp-2">{addon.description}</p>
                  )}
                </div>

                {/* Price */}
                <div className="mb-4 pb-4 border-b border-gray-700">
                  {addon.pricing ? (
                    <>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-green-400">
                          ${addon.pricing.amount.toLocaleString()}
                        </span>
                        <span className="text-gray-400 text-sm">
                          {addon.pricing.currency}
                          {addon.pricing.interval && ` / ${addon.pricing.interval}`}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 capitalize">
                        {addon.pricing.model.replace('_', ' ')} pricing
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-green-400">FREE</span>
                      <Tag className="h-5 w-5 text-green-400" />
                    </div>
                  )}
                </div>

                {/* Category & Technical Name */}
                <div className="mb-4 space-y-2">
                  <span className="px-2 py-1 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium">
                    {addon.category}
                  </span>
                  <div className="p-2 rounded-lg bg-gray-800/50">
                    <p className="text-xs text-gray-500">Technical Name</p>
                    <code className="text-xs text-green-400 font-mono">{addon.technicalName}</code>
                  </div>
                </div>

                {/* Usage Stats */}
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Users className="h-3.5 w-3.5" />
                    <span>{addon.appsUsing} app{addon.appsUsing !== 1 ? 's' : ''} using this</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    onClick={() => setEditingAddon(addon)}
                    className="flex-1 px-3 py-2 rounded-lg bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                    <Copy className="h-4 w-4 text-gray-400" />
                  </button>
                  <button className="p-2 rounded-lg bg-gray-800 hover:bg-red-900/50 transition-colors">
                    <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-400" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {activeTab === 'packages' && filteredCatalog.length === 0 && (
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-12 text-center">
          <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No packages found</h3>
          <p className="text-gray-400 mb-4">
            {projectCatalog.length === 0
              ? 'Create your first pricing package for this project'
              : 'Try adjusting your filters'}
          </p>
          {projectCatalog.length === 0 && (
            <button
              onClick={() => setShowNewPackageModal(true)}
              className="px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="h-5 w-5 inline mr-2" />
              Create First Package
            </button>
          )}
        </div>
      )}

      {activeTab === 'addons' && filteredAddons.length === 0 && (
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-12 text-center">
          <Puzzle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No addons found</h3>
          <p className="text-gray-400 mb-4">
            {projectAddons.length === 0
              ? 'Create your first addon for this project'
              : 'Try adjusting your filters'}
          </p>
          {projectAddons.length === 0 && (
            <button
              onClick={() => setShowNewAddonModal(true)}
              className="px-6 py-3 rounded-xl gradient-green text-white font-medium hover:opacity-90 transition-opacity"
            >
              <Plus className="h-5 w-5 inline mr-2" />
              Create First Addon
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {(showNewPackageModal || editingPackage) && (
        <PackageModal
          projectId={projectId}
          package={editingPackage}
          onClose={() => {
            setShowNewPackageModal(false)
            setEditingPackage(null)
          }}
        />
      )}

      {(showNewAddonModal || editingAddon) && (
        <AddonModal
          projectId={projectId}
          addon={editingAddon}
          onClose={() => {
            setShowNewAddonModal(false)
            setEditingAddon(null)
          }}
        />
      )}
    </div>
  )
}

// Package Modal Component
function PackageModal({
  projectId,
  package: pkg,
  onClose
}: {
  projectId: string
  package: PricingCatalogItem | null
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    description: pkg?.description || '',
    category: pkg?.category || '',
    pricingModel: pkg?.pricing.model || 'subscription',
    amount: pkg?.pricing.amount || 0,
    currency: pkg?.pricing.currency || 'USD',
    interval: pkg?.pricing.interval || 'month',
    features: pkg?.features || [] as string[],
    newFeature: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save package
    console.log('Saving package:', formData)
    onClose()
  }

  const addFeature = () => {
    if (formData.newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, formData.newFeature.trim()],
        newFeature: ''
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-2xl font-bold text-white">
            {pkg ? 'Edit Package' : 'New Package'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Package Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Professional Plan"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the package..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., POS Plans, Mobile Banking, etc."
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Pricing</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Pricing Model <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.pricingModel}
                  onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as 'custom' | 'subscription' | 'one_time' | 'usage_based' })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="subscription">Subscription</option>
                  <option value="one_time">One-Time</option>
                  <option value="usage_based">Usage Based</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Currency <span className="text-red-400">*</span>
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="SAR">SAR</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              {formData.pricingModel === 'subscription' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Interval
                  </label>
                  <select
                    value={formData.interval}
                    onChange={(e) => setFormData({ ...formData, interval: e.target.value as 'month' | 'year' })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                    <option value="week">Weekly</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Features</h3>

            {/* Feature List */}
            {formData.features.length > 0 && (
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-800/50 border border-gray-700">
                    <Check className="h-4 w-4 text-green-400" />
                    <span className="flex-1 text-sm text-white">{feature}</span>
                    <button
                      type="button"
                      onClick={() => setFormData({
                        ...formData,
                        features: formData.features.filter((_, i) => i !== index)
                      })}
                      className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Feature */}
            <div className="flex gap-3">
              <input
                type="text"
                value={formData.newFeature}
                onChange={(e) => setFormData({ ...formData, newFeature: e.target.value })}
                placeholder="Add a feature..."
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={addFeature}
                className="px-4 py-3 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl gradient-purple text-white font-medium hover:opacity-90 transition-opacity"
            >
              {pkg ? 'Update Package' : 'Create Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Addon Modal Component
function AddonModal({
  projectId,
  addon,
  onClose
}: {
  projectId: string
  addon: FeatureAddon | null
  onClose: () => void
}) {
  const [formData, setFormData] = useState({
    name: addon?.name || '',
    description: addon?.description || '',
    category: addon?.category || '',
    technicalName: addon?.technicalName || '',
    hasPricing: !!addon?.pricing,
    pricingModel: addon?.pricing?.model || 'subscription',
    amount: addon?.pricing?.amount || 0,
    currency: addon?.pricing?.currency || 'USD',
    interval: addon?.pricing?.interval || 'month'
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Save addon
    console.log('Saving addon:', formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-2xl font-bold text-white">
            {addon ? 'Edit Addon' : 'New Addon'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Addon Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Inventory Management"
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the addon..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Category <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="e.g., Core Features"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Technical Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.technicalName}
                  onChange={(e) => setFormData({ ...formData, technicalName: e.target.value.toLowerCase().replace(/\s+/g, '_') })}
                  placeholder="e.g., inventory_management"
                  className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none transition-colors font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Pricing (Optional) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Pricing (Optional)</h3>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.hasPricing}
                  onChange={(e) => setFormData({ ...formData, hasPricing: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-600 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-400">This addon has pricing</span>
              </label>
            </div>

            {formData.hasPricing && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Pricing Model <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.pricingModel}
                      onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value as any })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:outline-none transition-colors"
                    >
                      <option value="subscription">Subscription</option>
                      <option value="one_time">One-Time</option>
                      <option value="usage_based">Usage Based</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Currency <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:outline-none transition-colors"
                    >
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="GBP">GBP</option>
                      <option value="SAR">SAR</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Amount <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                      placeholder="0"
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:border-green-500 focus:outline-none transition-colors"
                    />
                  </div>

                  {formData.pricingModel === 'subscription' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Interval
                      </label>
                      <select
                        value={formData.interval}
                        onChange={(e) => setFormData({ ...formData, interval: e.target.value as any })}
                        className="w-full px-4 py-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-green-500 focus:outline-none transition-colors"
                      >
                        <option value="month">Monthly</option>
                        <option value="year">Yearly</option>
                      </select>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-800 text-white font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl gradient-green text-white font-medium hover:opacity-90 transition-opacity"
            >
              {addon ? 'Update Addon' : 'Create Addon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
