'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'
import { clientsService } from '@/lib/services/clients-service'
import { Client, ClientStatus, ClientPriority, ClientType, ClientSource } from '@/types/clients'
import { Building2, Save, X, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface ClientFormProps {
  client?: Client | null
  mode: 'create' | 'edit'
}

export default function ClientForm({ client, mode }: ClientFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    name: '',
    legalName: '',
    type: 'company' as ClientType,
    email: '',
    phone: '',
    website: '',
    industry: '',
    size: '',
    status: 'lead' as ClientStatus,
    priority: 'medium' as ClientPriority,
    source: 'website' as ClientSource,
    tags: [] as string[],
    // Address
    street: '',
    street2: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    // Billing
    currency: 'USD',
    paymentTerms: 30,
    creditLimit: 0,
    // Initial values
    totalRevenue: 0,
    lifetimeValue: 0,
    averageInvoiceValue: 0,
    outstandingBalance: 0,
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0
  })

  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData({
        name: client.name || '',
        legalName: client.legalName || '',
        type: client.type || 'company',
        email: client.email || '',
        phone: client.phone || '',
        website: client.website || '',
        industry: client.industry || '',
        size: client.size || '',
        status: client.status || 'lead',
        priority: client.priority || 'medium',
        source: client.source || 'website',
        tags: client.tags || [],
        street: client.address?.street || '',
        street2: client.address?.street2 || '',
        city: client.address?.city || '',
        state: client.address?.state || '',
        postalCode: client.address?.postalCode || '',
        country: client.address?.country || '',
        currency: client.currency || 'USD',
        paymentTerms: client.paymentTerms || 30,
        creditLimit: client.creditLimit || 0,
        totalRevenue: client.totalRevenue || 0,
        lifetimeValue: client.lifetimeValue || 0,
        averageInvoiceValue: client.averageInvoiceValue || 0,
        outstandingBalance: client.outstandingBalance || 0,
        totalProjects: client.totalProjects || 0,
        activeProjects: client.activeProjects || 0,
        completedProjects: client.completedProjects || 0
      })
    }
  }, [client, mode])

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Client name is required'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      toast.error('Please fix validation errors')
      return
    }

    if (!user?.tenantId) {
      toast.error('No tenant ID found')
      return
    }

    try {
      setLoading(true)

      const clientData: any = {
        tenantId: user.tenantId,
        name: formData.name,
        legalName: formData.legalName || formData.name,
        type: formData.type,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        industry: formData.industry,
        size: formData.size,
        status: formData.status,
        priority: formData.priority,
        source: formData.source,
        tags: formData.tags,
        address: {
          street: formData.street,
          street2: formData.street2,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        },
        currency: formData.currency,
        paymentTerms: formData.paymentTerms,
        creditLimit: formData.creditLimit,
        totalRevenue: formData.totalRevenue,
        lifetimeValue: formData.lifetimeValue,
        averageInvoiceValue: formData.averageInvoiceValue,
        outstandingBalance: formData.outstandingBalance,
        totalProjects: formData.totalProjects,
        activeProjects: formData.activeProjects,
        completedProjects: formData.completedProjects
      }

      if (mode === 'create') {
        const clientId = await clientsService.createClient(clientData)
        toast.success('Client created successfully!')
        router.push(`/dashboard/clients/${clientId}`)
      } else if (mode === 'edit' && client) {
        await clientsService.updateClient(client.id, clientData)
        toast.success('Client updated successfully!')
        router.push(`/dashboard/clients/${client.id}`)
      }
    } catch (error: any) {
      console.error('Error saving client:', error)
      toast.error(error.message || 'Failed to save client')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Client Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="Acme Corporation"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Legal Name
            </label>
            <input
              type="text"
              value={formData.legalName}
              onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="Acme Corporation Ltd."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="contact@acme.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-400 flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="+1 (555) 123-4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Website
            </label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="www.acme.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as ClientType })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="individual">Individual</option>
              <option value="company">Company</option>
              <option value="enterprise">Enterprise</option>
              <option value="government">Government</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Industry
            </label>
            <input
              type="text"
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="Technology"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Company Size
            </label>
            <input
              type="text"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="50-200 employees"
            />
          </div>
        </div>
      </div>

      {/* Classification */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Classification</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="lead">Lead</option>
              <option value="prospect">Prospect</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="churned">Churned</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value as ClientPriority })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Source
            </label>
            <select
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value as ClientSource })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="referral">Referral</option>
              <option value="marketing">Marketing</option>
              <option value="sales">Sales</option>
              <option value="website">Website</option>
              <option value="social">Social Media</option>
              <option value="event">Event</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        {/* Tags */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Tags
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="Add tag..."
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-sm flex items-center gap-2"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-red-400"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Address</h2>

        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Street Address
            </label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => setFormData({ ...formData, street: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="123 Main Street"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Street Address Line 2
            </label>
            <input
              type="text"
              value={formData.street2}
              onChange={(e) => setFormData({ ...formData, street2: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="Suite 100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="San Francisco"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                State / Province
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                value={formData.postalCode}
                onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="94102"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
                placeholder="United States"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Billing Settings */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-6">Billing Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Currency
            </label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-purple-500 focus:outline-none"
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="CAD">CAD</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Payment Terms (days)
            </label>
            <input
              type="number"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Credit Limit
            </label>
            <input
              type="number"
              value={formData.creditLimit}
              onChange={(e) => setFormData({ ...formData, creditLimit: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={loading}
          className="px-6 py-3 rounded-lg border border-gray-700 hover:bg-gray-800 text-white transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{loading ? 'Saving...' : mode === 'create' ? 'Create Client' : 'Update Client'}</span>
        </button>
      </div>
    </form>
  )
}
