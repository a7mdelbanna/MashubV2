'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { pricingService } from '@/lib/services/pricing-service'
import { PricingPlan, CreatePricingPlanInput } from '@/types/pricing'
import { Plus, Edit, Trash2, Check, X, DollarSign, Calendar, Star, ArrowUp, ArrowDown } from 'lucide-react'
import toast from 'react-hot-toast'

export default function PricingTab() {
  const { user } = useAuth()
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)

  useEffect(() => {
    loadPlans()
  }, [])

  const loadPlans = async () => {
    try {
      setLoading(true)
      const allPlans = await pricingService.getAllPlans(true) // Include inactive plans
      setPlans(allPlans)
    } catch (error) {
      console.error(error)
      toast.error('Failed to load pricing plans')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setEditingPlan(null)
    setShowModal(true)
  }

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan)
    setShowModal(true)
  }

  const handleDelete = async (planId: string) => {
    if (!confirm('Are you sure you want to archive this pricing plan?')) return

    try {
      await pricingService.deletePlan(planId)
      toast.success('Plan archived successfully')
      loadPlans()
    } catch (error) {
      console.error(error)
      toast.error('Failed to archive plan')
    }
  }

  const handleReorder = async (planId: string, direction: 'up' | 'down') => {
    const currentIndex = plans.findIndex(p => p.id === planId)
    if (
      (direction === 'up' && currentIndex === 0) ||
      (direction === 'down' && currentIndex === plans.length - 1)
    ) {
      return
    }

    const newPlans = [...plans]
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
    ;[newPlans[currentIndex], newPlans[newIndex]] = [newPlans[newIndex], newPlans[currentIndex]]

    // Update sortOrder
    const planIds = newPlans.map(p => p.id)
    try {
      await pricingService.reorderPlans(planIds)
      setPlans(newPlans)
      toast.success('Plan order updated')
    } catch (error) {
      console.error(error)
      toast.error('Failed to reorder plans')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Pricing Plans</h2>
          <p className="text-gray-400 mt-1">Manage subscription plans and features</p>
        </div>
        <button
          onClick={handleCreate}
          className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Plan</span>
        </button>
      </div>

      {/* Plans Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Trial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Limits
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {plans.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                  No pricing plans found. Create your first plan to get started.
                </td>
              </tr>
            ) : (
              plans.map((plan, index) => (
                <tr key={plan.id} className="hover:bg-gray-800/30">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: plan.badgeColor }}
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">{plan.name}</span>
                          {plan.isPopular && (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          )}
                        </div>
                        <p className="text-sm text-gray-400">{plan.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-white">
                      ${plan.price}
                      <span className="text-gray-400 text-sm">/{plan.billingPeriod === 'monthly' ? 'mo' : 'yr'}</span>
                    </div>
                    {plan.yearlyPrice && (
                      <div className="text-sm text-gray-400">
                        ${plan.yearlyPrice}/yr
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {plan.trialDays > 0 ? `${plan.trialDays} days` : 'No trial'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-300">
                      <div>{plan.features.maxUsers === -1 ? 'Unlimited' : plan.features.maxUsers} users</div>
                      <div className="text-gray-400">
                        {plan.features.maxStorage === -1 ? 'Unlimited' : `${plan.features.maxStorage}GB`} storage
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        plan.status === 'active'
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                      }`}
                    >
                      {plan.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button
                      onClick={() => handleReorder(plan.id, 'up')}
                      disabled={index === 0}
                      className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleReorder(plan.id, 'down')}
                      disabled={index === plans.length - 1}
                      className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEdit(plan)}
                      className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(plan.id)}
                      className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-red-400"
                      title="Archive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <PricingPlanModal
          plan={editingPlan}
          onClose={() => {
            setShowModal(false)
            setEditingPlan(null)
          }}
          onSave={() => {
            setShowModal(false)
            setEditingPlan(null)
            loadPlans()
          }}
          userId={user!.id}
        />
      )}
    </div>
  )
}

// ===========================================
// PRICING PLAN MODAL
// ===========================================

function PricingPlanModal({
  plan,
  onClose,
  onSave,
  userId
}: {
  plan: PricingPlan | null
  onClose: () => void
  onSave: () => void
  userId: string
}) {
  const isEditing = !!plan

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreatePricingPlanInput>({
    name: plan?.name || '',
    description: plan?.description || '',
    price: plan?.price ?? 0,
    yearlyPrice: plan?.yearlyPrice,
    billingPeriod: plan?.billingPeriod || 'monthly',
    trialDays: plan?.trialDays ?? 0,
    isPopular: plan?.isPopular || false,
    sortOrder: plan?.sortOrder || 0,
    badgeColor: plan?.badgeColor || '#8b5cf6',
    features: plan?.features || {
      maxUsers: 0,
      maxClients: 0,
      maxProjects: 0,
      maxStorage: 0,
      customDomain: false,
      apiAccess: false,
      advancedReports: false,
      prioritySupport: false,
      whiteLabel: false,
      modules: {
        crm: true,
        projects: true,
        finance: false,
        hr: false,
        timeTracking: false,
        inventory: false
      }
    }
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (formData.price < 0) newErrors.price = 'Price must be 0 or greater'
    if (formData.trialDays < 0) newErrors.trialDays = 'Trial days must be 0 or greater'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    try {
      setLoading(true)

      if (isEditing && plan) {
        await pricingService.updatePlan(plan.id, formData)
        toast.success('Plan updated successfully!')
      } else {
        await pricingService.createPlan(formData, userId)
        toast.success('Plan created successfully!')
      }

      onSave()
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Failed to save plan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-gray-800">
        {/* Header */}
        <div className="p-6 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-2xl font-bold text-white">
            {isEditing ? 'Edit Pricing Plan' : 'Create Pricing Plan'}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            Configure plan details, pricing, and features
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Plan Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="Starter"
              />
              {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Badge Color
              </label>
              <input
                type="color"
                value={formData.badgeColor}
                onChange={e => setFormData({ ...formData, badgeColor: e.target.value })}
                className="w-full h-12 px-2 bg-gray-800 border border-gray-700 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="For growing businesses"
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Monthly Price ($) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                value={formData.price === 0 && !isEditing ? '' : formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="49"
                min="0"
              />
              {errors.price && <p className="mt-1 text-xs text-red-400">{errors.price}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Yearly Price ($)
              </label>
              <input
                type="number"
                value={formData.yearlyPrice || ''}
                onChange={e => setFormData({ ...formData, yearlyPrice: parseFloat(e.target.value) || undefined })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="490"
                min="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Trial Days
              </label>
              <input
                type="number"
                value={formData.trialDays === 0 && !isEditing ? '' : formData.trialDays}
                onChange={e => setFormData({ ...formData, trialDays: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="14"
                min="0"
              />
            </div>
          </div>

          {/* Checkboxes */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPopular"
              checked={formData.isPopular}
              onChange={e => setFormData({ ...formData, isPopular: e.target.checked })}
              className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="isPopular" className="text-sm text-gray-300">
              Mark as popular (shows star badge)
            </label>
          </div>

          {/* Feature Limits */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Feature Limits</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Users (-1 for unlimited)
                </label>
                <input
                  type="number"
                  value={formData.features.maxUsers === 0 && !isEditing ? '' : formData.features.maxUsers}
                  onChange={e => setFormData({
                    ...formData,
                    features: { ...formData.features, maxUsers: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Clients (-1 for unlimited)
                </label>
                <input
                  type="number"
                  value={formData.features.maxClients === 0 && !isEditing ? '' : formData.features.maxClients}
                  onChange={e => setFormData({
                    ...formData,
                    features: { ...formData.features, maxClients: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Projects (-1 for unlimited)
                </label>
                <input
                  type="number"
                  value={formData.features.maxProjects === 0 && !isEditing ? '' : formData.features.maxProjects}
                  onChange={e => setFormData({
                    ...formData,
                    features: { ...formData.features, maxProjects: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="25"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Storage (GB, -1 for unlimited)
                </label>
                <input
                  type="number"
                  value={formData.features.maxStorage === 0 && !isEditing ? '' : formData.features.maxStorage}
                  onChange={e => setFormData({
                    ...formData,
                    features: { ...formData.features, maxStorage: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Feature Toggles */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Features</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'customDomain', label: 'Custom Domain' },
                { key: 'apiAccess', label: 'API Access' },
                { key: 'advancedReports', label: 'Advanced Reports' },
                { key: 'prioritySupport', label: 'Priority Support' },
                { key: 'whiteLabel', label: 'White Label' }
              ].map(feature => (
                <div key={feature.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={feature.key}
                    checked={(formData.features as any)[feature.key]}
                    onChange={e => setFormData({
                      ...formData,
                      features: { ...formData.features, [feature.key]: e.target.checked }
                    })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor={feature.key} className="text-sm text-gray-300">
                    {feature.label}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Module Access */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Module Access</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'crm', label: 'CRM' },
                { key: 'projects', label: 'Projects' },
                { key: 'finance', label: 'Finance' },
                { key: 'hr', label: 'HR' },
                { key: 'timeTracking', label: 'Time Tracking' },
                { key: 'inventory', label: 'Inventory' }
              ].map(module => (
                <div key={module.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`module-${module.key}`}
                    checked={formData.features.modules[module.key as keyof typeof formData.features.modules]}
                    onChange={e => setFormData({
                      ...formData,
                      features: {
                        ...formData.features,
                        modules: {
                          ...formData.features.modules,
                          [module.key]: e.target.checked
                        }
                      }
                    })}
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor={`module-${module.key}`} className="text-sm text-gray-300">
                    {module.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800 flex gap-3 sticky bottom-0 bg-gray-900">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-6 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
          >
            {loading ? 'Saving...' : isEditing ? 'Update Plan' : 'Create Plan'}
          </button>
        </div>
      </div>
    </div>
  )
}
