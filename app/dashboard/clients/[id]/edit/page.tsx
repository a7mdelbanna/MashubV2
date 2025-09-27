'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, X, Building2, Globe, Mail, Phone,
  MapPin, User, CreditCard, Calendar, Tag, Bell,
  Shield, Trash2, Archive, AlertTriangle
} from 'lucide-react'

// Mock client data
const mockClient = {
  id: 'c1',
  name: 'TechCorp Solutions',
  industry: 'Technology',
  website: 'https://techcorp.example.com',
  description: 'Leading technology solutions provider specializing in cloud infrastructure and enterprise software.',
  logo: null,
  email: 'contact@techcorp.example.com',
  phone: '+1 (555) 123-4567',
  address: {
    street: '123 Tech Street',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94105',
    country: 'United States'
  },
  primaryContact: {
    name: 'John Smith',
    role: 'CEO',
    email: 'john@techcorp.example.com',
    phone: '+1 (555) 123-4568'
  },
  financialInfo: {
    creditLimit: 500000,
    paymentTerms: 'Net 30',
    billingCycle: 'Monthly',
    currency: 'USD',
    taxId: 'XX-XXXXXXX'
  },
  preferences: {
    communicationMethod: 'email',
    invoiceDelivery: 'email',
    projectUpdates: 'weekly',
    tier: 'enterprise'
  },
  tags: ['Strategic Partner', 'High Priority', 'Enterprise'],
  status: 'active',
  createdAt: '2024-01-15',
  lastModified: '2024-03-20'
}

const industries = [
  'Technology', 'Finance', 'Healthcare', 'E-commerce',
  'Education', 'Real Estate', 'Manufacturing', 'Retail'
]

const tiers = [
  { value: 'starter', label: 'Starter', color: 'from-gray-600 to-gray-500' },
  { value: 'growth', label: 'Growth', color: 'from-blue-600 to-cyan-500' },
  { value: 'professional', label: 'Professional', color: 'from-purple-600 to-pink-500' },
  { value: 'enterprise', label: 'Enterprise', color: 'from-yellow-600 to-orange-500' }
]

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState(mockClient)
  const [isDeleting, setIsDeleting] = useState(false)
  const [activeTab, setActiveTab] = useState('basic')

  const handleSave = () => {
    // Handle save logic
    router.push(`/dashboard/clients/${params.id}`)
  }

  const handleDelete = () => {
    setIsDeleting(true)
    // Handle delete logic
    setTimeout(() => {
      router.push('/dashboard/clients')
    }, 1000)
  }

  const tabs = [
    { id: 'basic', label: 'Basic Information', icon: Building2 },
    { id: 'contact', label: 'Contact Details', icon: User },
    { id: 'financial', label: 'Financial', icon: CreditCard },
    { id: 'preferences', label: 'Preferences', icon: Bell },
    { id: 'security', label: 'Security & Access', icon: Shield }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/clients/${params.id}`}
            className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Client</h1>
            <p className="text-gray-400">Update client information and settings</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push(`/dashboard/clients/${params.id}`)}
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
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Tab Navigation */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-1">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            {activeTab === 'basic' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Industry
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    >
                      {industries.map(ind => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm flex items-center space-x-2">
                        <Tag className="h-3 w-3" />
                        <span>{tag}</span>
                        <button className="ml-1 hover:text-purple-300">×</button>
                      </span>
                    ))}
                    <button className="px-3 py-1 rounded-lg border border-dashed border-gray-700 text-gray-400 text-sm hover:border-purple-500 hover:text-purple-400 transition-colors">
                      + Add Tag
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Address</h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.address.street}
                      placeholder="Street Address"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={formData.address.city}
                        placeholder="City"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={formData.address.state}
                        placeholder="State"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                      <input
                        type="text"
                        value={formData.address.zipCode}
                        placeholder="ZIP Code"
                        className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Primary Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="text"
                      value={formData.primaryContact.name}
                      placeholder="Contact Name"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      value={formData.primaryContact.role}
                      placeholder="Role/Title"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="email"
                      value={formData.primaryContact.email}
                      placeholder="Contact Email"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                    <input
                      type="tel"
                      value={formData.primaryContact.phone}
                      placeholder="Contact Phone"
                      className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'financial' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Credit Limit
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={formData.financialInfo.creditLimit}
                        className="w-full pl-8 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Payment Terms
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors">
                      <option>Net 15</option>
                      <option selected>Net 30</option>
                      <option>Net 45</option>
                      <option>Net 60</option>
                      <option>Due on Receipt</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Billing Cycle
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors">
                      <option>Weekly</option>
                      <option selected>Monthly</option>
                      <option>Quarterly</option>
                      <option>Annual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Currency
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors">
                      <option selected>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                      <option>CAD</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Tax ID
                  </label>
                  <input
                    type="text"
                    value={formData.financialInfo.taxId}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-4">
                    Client Tier
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    {tiers.map((tier) => (
                      <label key={tier.value} className="relative cursor-pointer">
                        <input
                          type="radio"
                          name="tier"
                          value={tier.value}
                          checked={formData.preferences.tier === tier.value}
                          onChange={(e) => setFormData({
                            ...formData,
                            preferences: {...formData.preferences, tier: e.target.value}
                          })}
                          className="peer sr-only"
                        />
                        <div className={`p-4 rounded-lg border-2 transition-all peer-checked:border-purple-500 ${
                          formData.preferences.tier === tier.value ? 'border-purple-500' : 'border-gray-700'
                        }`}>
                          <div className={`inline-block px-3 py-1 rounded-lg text-xs font-medium text-white bg-gradient-to-r ${tier.color} mb-2`}>
                            {tier.label}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Communication Method
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors">
                      <option selected>Email</option>
                      <option>Phone</option>
                      <option>Slack</option>
                      <option>Teams</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Invoice Delivery
                    </label>
                    <select className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors">
                      <option selected>Email</option>
                      <option>Portal</option>
                      <option>Mail</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Project Update Frequency
                  </label>
                  <select className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors">
                    <option>Daily</option>
                    <option selected>Weekly</option>
                    <option>Bi-weekly</option>
                    <option>Monthly</option>
                    <option>On Milestone</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <div className="flex items-center space-x-2 text-yellow-400 mb-2">
                    <AlertTriangle className="h-5 w-5" />
                    <span className="font-medium">Security Settings</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Manage access permissions and security settings for this client
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-4">
                    Access Permissions
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 rounded text-purple-500" defaultChecked />
                      <span className="text-white">View project details</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 rounded text-purple-500" defaultChecked />
                      <span className="text-white">Access invoices and financial data</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 rounded text-purple-500" />
                      <span className="text-white">Modify project settings</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input type="checkbox" className="w-4 h-4 rounded text-purple-500" />
                      <span className="text-white">Access source code repositories</span>
                    </label>
                  </div>
                </div>

                <div className="border-t border-gray-800 pt-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Danger Zone</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-lg border border-gray-700">
                      <div>
                        <p className="text-white font-medium">Archive Client</p>
                        <p className="text-sm text-gray-400">Hide this client from active lists</p>
                      </div>
                      <button className="px-4 py-2 rounded-lg border border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 transition-colors flex items-center space-x-2">
                        <Archive className="h-4 w-4" />
                        <span>Archive</span>
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/20 bg-red-500/5">
                      <div>
                        <p className="text-white font-medium">Delete Client</p>
                        <p className="text-sm text-gray-400">Permanently remove all client data</p>
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

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Client Status */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Account Status
                </label>
                <select className="w-full px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors">
                  <option selected>Active</option>
                  <option>Inactive</option>
                  <option>On Hold</option>
                  <option>Suspended</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-800">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-400">Created</span>
                  <span className="text-white">{formData.createdAt}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Last Modified</span>
                  <span className="text-white">{formData.lastModified}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Projects</span>
                <span className="text-lg font-semibold text-white">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Active Projects</span>
                <span className="text-lg font-semibold text-green-400">4</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Total Revenue</span>
                <span className="text-lg font-semibold text-blue-400">$450K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Outstanding</span>
                <span className="text-lg font-semibold text-yellow-400">$25K</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}