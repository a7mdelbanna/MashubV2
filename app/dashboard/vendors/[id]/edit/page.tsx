'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Save, X, Plus, Trash2, Building, Phone,
  Mail, Globe, MapPin, User, CreditCard, Calendar,
  DollarSign, Tag, FileText, ChevronRight, Package,
  Shield, Check, AlertCircle
} from 'lucide-react'
import Select from '@/components/ui/select'
import { currencyOptions, paymentTermsOptions, companySizeOptions } from '@/lib/select-options'

// Mock vendor data - in reality this would come from an API
const mockVendorData = {
  id: 'VND-001',
  name: 'TechSupply Pro',
  category: 'Technology',
  website: 'www.techsupplypro.com',
  description: 'Leading technology equipment supplier',
  status: 'active',

  contacts: [
    {
      id: 'c1',
      name: 'Jessica Chen',
      role: 'Account Executive',
      email: 'jessica@techsupplypro.com',
      phone: '+1 555-0202',
      isPrimary: true
    }
  ],

  salesEmail: 'sales@techsupplypro.com',
  salesPhone: '+1 555-0200',
  supportEmail: 'support@techsupplypro.com',
  supportPhone: '+1 555-0201',

  address: {
    street: '456 Supply Avenue',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'United States'
  },

  taxId: 'XX-XXXXXXX',
  businessLicense: 'BL-2023-001',
  established: '2010',
  employees: '1000+',
  certifications: ['ISO 9001', 'ISO 14001', 'Authorized Reseller'],

  paymentTerms: 'net-30',
  currency: 'USD',
  paymentMethods: ['Wire Transfer', 'Credit Card', 'ACH'],
  creditLimit: 100000,
  discount: '2% 10 Net 30',

  tags: ['Preferred', 'Technology', 'Fast Delivery'],
  notes: 'Reliable vendor with excellent support'
}

const categories = [
  'Technology', 'Office Supplies', 'Furniture', 'Marketing',
  'Consulting', 'Logistics', 'Maintenance', 'Security'
]

const categoryOptions = categories.map(cat => ({
  value: cat,
  label: cat
}))

const statusOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
  { value: 'pending', label: 'Pending' }
]

const paymentMethods = ['Wire Transfer', 'Credit Card', 'ACH', 'Check', 'PayPal']

export default function EditVendorPage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('basic')
  const [formData, setFormData] = useState(mockVendorData)

  const sections = [
    { id: 'basic', label: 'Basic Information', icon: Building },
    { id: 'contact', label: 'Contact Details', icon: Phone },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'business', label: 'Business Details', icon: FileText },
    { id: 'payment', label: 'Payment Terms', icon: CreditCard },
    { id: 'additional', label: 'Additional Info', icon: Tag }
  ]

  const handleContactAdd = () => {
    setFormData({
      ...formData,
      contacts: [
        ...formData.contacts,
        {
          id: Date.now().toString(),
          name: '',
          role: '',
          email: '',
          phone: '',
          isPrimary: false
        }
      ]
    })
  }

  const handleContactRemove = (id: string) => {
    setFormData({
      ...formData,
      contacts: formData.contacts.filter(c => c.id !== id)
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push(`/dashboard/vendors/${params.id}`)
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href={`/dashboard/vendors/${params.id}`}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Edit Vendor</h1>
            <p className="text-gray-400 mt-1">Update vendor information and settings</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/dashboard/vendors/${params.id}`}
            className="px-4 py-2 bg-gray-800 rounded-xl text-white font-medium hover:bg-gray-700 transition-colors flex items-center"
          >
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Link>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Navigation */}
        <div className="w-64">
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-2">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                  activeSection === section.id
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <section.icon className="h-5 w-5" />
                <span className="font-medium">{section.label}</span>
                <ChevronRight className={`h-4 w-4 ml-auto transition-transform ${
                  activeSection === section.id ? 'rotate-90' : ''
                }`} />
              </button>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="flex-1">
          <div className="bg-gray-800/30 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            {activeSection === 'basic' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Vendor Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <Select
                      label="Category"
                      required
                      options={categoryOptions}
                      value={formData.category}
                      onChange={(value) => setFormData({ ...formData, category: value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Website</label>
                    <input
                      type="text"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <Select
                      label="Status"
                      options={statusOptions}
                      value={formData.status}
                      onChange={(value) => setFormData({ ...formData, status: value })}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                      rows={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'contact' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-white">Contact Details</h2>
                  <button
                    onClick={handleContactAdd}
                    className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Contact
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.contacts.map((contact, index) => (
                    <div key={contact.id} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-white font-medium">
                          {contact.isPrimary ? 'Primary Contact' : `Contact ${index + 1}`}
                        </h4>
                        {!contact.isPrimary && (
                          <button
                            onClick={() => handleContactRemove(contact.id)}
                            className="p-1 rounded hover:bg-gray-700 transition-colors text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={contact.name}
                          placeholder="Full Name"
                          className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="text"
                          value={contact.role}
                          placeholder="Role/Title"
                          className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="email"
                          value={contact.email}
                          placeholder="Email"
                          className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                        <input
                          type="text"
                          value={contact.phone}
                          placeholder="Phone"
                          className="px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="text-lg font-medium text-white mb-4">Department Contacts</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Sales Email</label>
                      <input
                        type="email"
                        value={formData.salesEmail}
                        onChange={(e) => setFormData({ ...formData, salesEmail: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Sales Phone</label>
                      <input
                        type="text"
                        value={formData.salesPhone}
                        onChange={(e) => setFormData({ ...formData, salesPhone: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Support Email</label>
                      <input
                        type="email"
                        value={formData.supportEmail}
                        onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-2">Support Phone</label>
                      <input
                        type="text"
                        value={formData.supportPhone}
                        onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                        className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'address' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Address Information</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div className="col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Street Address</label>
                    <input
                      type="text"
                      value={formData.address.street}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, street: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">City</label>
                    <input
                      type="text"
                      value={formData.address.city}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, city: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">State/Province</label>
                    <input
                      type="text"
                      value={formData.address.state}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, state: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">ZIP/Postal Code</label>
                    <input
                      type="text"
                      value={formData.address.zip}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, zip: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Country</label>
                    <input
                      type="text"
                      value={formData.address.country}
                      onChange={(e) => setFormData({
                        ...formData,
                        address: { ...formData.address, country: e.target.value }
                      })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'business' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Business Details</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Tax ID</label>
                    <input
                      type="text"
                      value={formData.taxId}
                      onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Business License</label>
                    <input
                      type="text"
                      value={formData.businessLicense}
                      onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Established Year</label>
                    <input
                      type="text"
                      value={formData.established}
                      onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <Select
                      label="Number of Employees"
                      options={companySizeOptions}
                      value={formData.employees}
                      onChange={(value) => setFormData({ ...formData, employees: value })}
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Certifications</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.certifications.map((cert, index) => (
                        <span key={index} className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm flex items-center">
                          <Check className="h-3 w-3 mr-1" />
                          {cert}
                          <button
                            onClick={() => setFormData({
                              ...formData,
                              certifications: formData.certifications.filter((_, i) => i !== index)
                            })}
                            className="ml-2 hover:text-green-300"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                      <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400 text-sm hover:border-green-500 hover:text-green-400 transition-colors">
                        + Add Certification
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Payment Terms</h2>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Select
                      label="Payment Terms"
                      options={paymentTermsOptions}
                      value={formData.paymentTerms}
                      onChange={(value) => setFormData({ ...formData, paymentTerms: value })}
                    />
                  </div>

                  <div>
                    <Select
                      label="Currency"
                      options={currencyOptions}
                      value={formData.currency}
                      onChange={(value) => setFormData({ ...formData, currency: value })}
                    />
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Credit Limit</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="number"
                        value={formData.creditLimit}
                        onChange={(e) => setFormData({ ...formData, creditLimit: Number(e.target.value) })}
                        className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Early Payment Discount</label>
                    <input
                      type="text"
                      value={formData.discount}
                      onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-gray-400 text-sm mb-2">Accepted Payment Methods</label>
                    <div className="grid grid-cols-3 gap-3">
                      {paymentMethods.map(method => (
                        <label key={method} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.paymentMethods.includes(method)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  paymentMethods: [...formData.paymentMethods, method]
                                })
                              } else {
                                setFormData({
                                  ...formData,
                                  paymentMethods: formData.paymentMethods.filter(m => m !== method)
                                })
                              }
                            }}
                            className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                          />
                          <span className="text-white">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'additional' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Additional Information</h2>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-sm flex items-center">
                        {tag}
                        <button
                          onClick={() => setFormData({
                            ...formData,
                            tags: formData.tags.filter((_, i) => i !== index)
                          })}
                          className="ml-2 hover:text-purple-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                    <button className="px-3 py-1 rounded-full border border-gray-700 text-gray-400 text-sm hover:border-purple-500 hover:text-purple-400 transition-colors">
                      + Add Tag
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                    rows={6}
                    placeholder="Add any additional notes about this vendor..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}