'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, ArrowRight, Building, User, CreditCard,
  FileText, Check, AlertCircle, Plus, Trash2, Phone,
  Mail, Globe, MapPin, DollarSign, Calendar, Package,
  Shield, Tag, Upload, X, ChevronDown
} from 'lucide-react'
import Select from '@/components/ui/select'
import { currencyOptions, paymentTermsOptions, companySizeOptions } from '@/lib/select-options'

const steps = [
  { number: 1, title: 'Basic Information', icon: Building },
  { number: 2, title: 'Contact Details', icon: User },
  { number: 3, title: 'Business Details', icon: FileText },
  { number: 4, title: 'Payment Terms', icon: CreditCard },
  { number: 5, title: 'Review & Submit', icon: Check }
]

const categories = [
  'Technology', 'Office Supplies', 'Furniture', 'Marketing',
  'Consulting', 'Logistics', 'Maintenance', 'Security',
  'Catering', 'Healthcare', 'Legal', 'Finance'
]

const categoryOptions = categories.map(cat => ({
  value: cat,
  label: cat
}))

const paymentMethods = [
  'Wire Transfer', 'Credit Card', 'ACH', 'Check', 'PayPal', 'Cryptocurrency'
]

export default function NewVendorPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<any>({})

  const [formData, setFormData] = useState({
    // Basic Information
    name: '',
    category: '',
    website: '',
    description: '',
    tags: [] as string[],

    // Contact Details
    contacts: [{
      name: '',
      role: '',
      email: '',
      phone: '',
      isPrimary: true
    }],
    salesEmail: '',
    salesPhone: '',
    supportEmail: '',
    supportPhone: '',

    // Address
    address: {
      street: '',
      city: '',
      state: '',
      zip: '',
      country: ''
    },

    // Business Details
    taxId: '',
    businessLicense: '',
    established: '',
    employees: '',
    annualRevenue: '',
    certifications: [] as string[],

    // Payment Terms
    paymentTerms: 'net-30',
    currency: 'USD',
    paymentMethods: [] as string[],
    creditLimit: 50000,
    discount: '',
    bankAccount: {
      bankName: '',
      accountName: '',
      accountNumber: '',
      routingNumber: '',
      swift: ''
    },

    // Additional
    notes: '',
    autoApproveOrders: false,
    requirePO: true,
    minOrderValue: 0
  })

  const [newTag, setNewTag] = useState('')
  const [newCert, setNewCert] = useState('')

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1)
      } else {
        handleSubmit()
      }
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const validateStep = () => {
    const newErrors: any = {}

    switch (currentStep) {
      case 1:
        if (!formData.name) newErrors.name = 'Vendor name is required'
        if (!formData.category) newErrors.category = 'Category is required'
        break
      case 2:
        if (!formData.salesEmail) newErrors.salesEmail = 'Sales email is required'
        if (!formData.salesPhone) newErrors.salesPhone = 'Sales phone is required'
        if (!formData.contacts[0].name) newErrors.contactName = 'Primary contact name is required'
        if (!formData.contacts[0].email) newErrors.contactEmail = 'Primary contact email is required'
        break
      case 3:
        if (!formData.address.street) newErrors.street = 'Street address is required'
        if (!formData.address.city) newErrors.city = 'City is required'
        if (!formData.address.country) newErrors.country = 'Country is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    router.push('/dashboard/vendors')
  }

  const addContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, {
        name: '',
        role: '',
        email: '',
        phone: '',
        isPrimary: false
      }]
    })
  }

  const removeContact = (index: number) => {
    if (formData.contacts.length > 1) {
      setFormData({
        ...formData,
        contacts: formData.contacts.filter((_, i) => i !== index)
      })
    }
  }

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag]
      })
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  const addCertification = () => {
    if (newCert && !formData.certifications.includes(newCert)) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, newCert]
      })
      setNewCert('')
    }
  }

  const removeCertification = (cert: string) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter(c => c !== cert)
    })
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/vendors"
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">Add New Vendor</h1>
            <p className="text-gray-400 mt-1">Register a new vendor in your system</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                currentStep > step.number
                  ? 'bg-green-600 text-white'
                  : currentStep === step.number
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <span className={`text-xs mt-2 ${
                currentStep >= step.number ? 'text-white' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-20 h-0.5 mx-2 transition-all ${
                currentStep > step.number ? 'bg-green-600' : 'bg-gray-700'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-8">
        {currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-400 text-sm mb-2">Vendor Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-4 py-2 bg-gray-800/50 border rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-700'
                  }`}
                  placeholder="Enter vendor name"
                />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <Select
                  label="Category"
                  required
                  options={categoryOptions}
                  value={formData.category}
                  onChange={(value) => setFormData({ ...formData, category: value })}
                  placeholder="Select category"
                  error={errors.category}
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="www.vendor.com"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors resize-none"
                  rows={4}
                  placeholder="Brief description of vendor and services..."
                />
              </div>

              <div className="col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-purple-600/20 text-purple-400 text-sm flex items-center">
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-purple-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="Add a tag..."
                  />
                  <button
                    onClick={addTag}
                    className="px-4 py-2 bg-purple-600 rounded-xl text-white hover:bg-purple-700 transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Contact Details</h2>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-white">Vendor Contacts</h3>
                <button
                  onClick={addContact}
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Contact
                </button>
              </div>

              <div className="space-y-4">
                {formData.contacts.map((contact, index) => (
                  <div key={index} className="p-4 bg-gray-800/50 rounded-xl border border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-white font-medium">
                        {contact.isPrimary ? 'Primary Contact' : `Contact ${index + 1}`}
                      </span>
                      {!contact.isPrimary && (
                        <button
                          onClick={() => removeContact(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={contact.name}
                        onChange={(e) => {
                          const newContacts = [...formData.contacts]
                          newContacts[index].name = e.target.value
                          setFormData({ ...formData, contacts: newContacts })
                        }}
                        className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Full Name"
                      />
                      <input
                        type="text"
                        value={contact.role}
                        onChange={(e) => {
                          const newContacts = [...formData.contacts]
                          newContacts[index].role = e.target.value
                          setFormData({ ...formData, contacts: newContacts })
                        }}
                        className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Role/Title"
                      />
                      <input
                        type="email"
                        value={contact.email}
                        onChange={(e) => {
                          const newContacts = [...formData.contacts]
                          newContacts[index].email = e.target.value
                          setFormData({ ...formData, contacts: newContacts })
                        }}
                        className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Email"
                      />
                      <input
                        type="tel"
                        value={contact.phone}
                        onChange={(e) => {
                          const newContacts = [...formData.contacts]
                          newContacts[index].phone = e.target.value
                          setFormData({ ...formData, contacts: newContacts })
                        }}
                        className="px-4 py-2 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                        placeholder="Phone"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Department Contacts</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Sales Email *</label>
                  <input
                    type="email"
                    value={formData.salesEmail}
                    onChange={(e) => setFormData({ ...formData, salesEmail: e.target.value })}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors ${
                      errors.salesEmail ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="sales@vendor.com"
                  />
                  {errors.salesEmail && <p className="text-red-400 text-xs mt-1">{errors.salesEmail}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Sales Phone *</label>
                  <input
                    type="tel"
                    value={formData.salesPhone}
                    onChange={(e) => setFormData({ ...formData, salesPhone: e.target.value })}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors ${
                      errors.salesPhone ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="+1 555-0000"
                  />
                  {errors.salesPhone && <p className="text-red-400 text-xs mt-1">{errors.salesPhone}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Support Email</label>
                  <input
                    type="email"
                    value={formData.supportEmail}
                    onChange={(e) => setFormData({ ...formData, supportEmail: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="support@vendor.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Support Phone</label>
                  <input
                    type="tel"
                    value={formData.supportPhone}
                    onChange={(e) => setFormData({ ...formData, supportPhone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="+1 555-0000"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Business Details</h2>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Street Address *</label>
                  <input
                    type="text"
                    value={formData.address.street}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, street: e.target.value }
                    })}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors ${
                      errors.street ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="123 Main Street, Suite 100"
                  />
                  {errors.street && <p className="text-red-400 text-xs mt-1">{errors.street}</p>}
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">City *</label>
                  <input
                    type="text"
                    value={formData.address.city}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, city: e.target.value }
                    })}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors ${
                      errors.city ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="New York"
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
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
                    placeholder="NY"
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
                    placeholder="10001"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Country *</label>
                  <input
                    type="text"
                    value={formData.address.country}
                    onChange={(e) => setFormData({
                      ...formData,
                      address: { ...formData.address, country: e.target.value }
                    })}
                    className={`w-full px-4 py-2 bg-gray-800/50 border rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors ${
                      errors.country ? 'border-red-500' : 'border-gray-700'
                    }`}
                    placeholder="United States"
                  />
                  {errors.country && <p className="text-red-400 text-xs mt-1">{errors.country}</p>}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-white mb-4">Company Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Tax ID</label>
                  <input
                    type="text"
                    value={formData.taxId}
                    onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="XX-XXXXXXX"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Business License</label>
                  <input
                    type="text"
                    value={formData.businessLicense}
                    onChange={(e) => setFormData({ ...formData, businessLicense: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="BL-2024-001"
                  />
                </div>

                <div>
                  <label className="block text-gray-400 text-sm mb-2">Established Year</label>
                  <input
                    type="text"
                    value={formData.established}
                    onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                    placeholder="2010"
                  />
                </div>

                <div>
                  <Select
                    label="Number of Employees"
                    options={companySizeOptions}
                    value={formData.employees}
                    onChange={(value) => setFormData({ ...formData, employees: value })}
                    placeholder="Select range"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-gray-400 text-sm mb-2">Certifications</label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {formData.certifications.map((cert) => (
                      <span key={cert} className="px-3 py-1 rounded-full bg-green-600/20 text-green-400 text-sm flex items-center">
                        <Check className="h-3 w-3 mr-1" />
                        {cert}
                        <button
                          onClick={() => removeCertification(cert)}
                          className="ml-2 hover:text-green-300"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newCert}
                      onChange={(e) => setNewCert(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCertification())}
                      className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-xl text-white focus:border-purple-500 focus:outline-none transition-colors"
                      placeholder="e.g., ISO 9001, Authorized Reseller..."
                    />
                    <button
                      onClick={addCertification}
                      className="px-4 py-2 bg-green-600 rounded-xl text-white hover:bg-green-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Payment Terms</h2>

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
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
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
                  placeholder="e.g., 2% 10 Net 30"
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

              <div className="col-span-2">
                <label className="block text-gray-400 text-sm mb-2">Order Settings</label>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.requirePO}
                      onChange={(e) => setFormData({ ...formData, requirePO: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-white">Require Purchase Order</span>
                  </label>
                  <label className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={formData.autoApproveOrders}
                      onChange={(e) => setFormData({ ...formData, autoApproveOrders: e.target.checked })}
                      className="rounded border-gray-600 bg-gray-800 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-white">Auto-approve orders within credit limit</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">Review & Submit</h2>

            <div className="bg-green-600/10 border border-green-600/20 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Ready to add vendor</span>
              </div>
              <p className="text-gray-400 text-sm mt-1">
                Please review the vendor information before submitting.
              </p>
            </div>

            <div className="space-y-6">
              <div className="p-4 bg-gray-800/50 rounded-xl">
                <h3 className="text-white font-medium mb-3">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Name:</span>
                    <p className="text-white">{formData.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Category:</span>
                    <p className="text-white">{formData.category || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Website:</span>
                    <p className="text-white">{formData.website || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Tags:</span>
                    <p className="text-white">{formData.tags.length ? formData.tags.join(', ') : 'None'}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-xl">
                <h3 className="text-white font-medium mb-3">Contact Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Primary Contact:</span>
                    <p className="text-white">{formData.contacts[0]?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Sales Email:</span>
                    <p className="text-white">{formData.salesEmail || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Sales Phone:</span>
                    <p className="text-white">{formData.salesPhone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Total Contacts:</span>
                    <p className="text-white">{formData.contacts.length}</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-xl">
                <h3 className="text-white font-medium mb-3">Payment Terms</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Terms:</span>
                    <p className="text-white">{formData.paymentTerms}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Credit Limit:</span>
                    <p className="text-white">${formData.creditLimit.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Currency:</span>
                    <p className="text-white">{formData.currency}</p>
                  </div>
                  <div>
                    <span className="text-gray-400">Payment Methods:</span>
                    <p className="text-white">{formData.paymentMethods.length ? formData.paymentMethods.join(', ') : 'None specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-700">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-2 rounded-xl font-medium transition-all flex items-center ${
              currentStep === 1
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-gray-800 text-white hover:bg-gray-700'
            }`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>

          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/vendors"
              className="px-6 py-2 bg-gray-800 rounded-xl text-white font-medium hover:bg-gray-700 transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl text-white font-medium hover:opacity-90 transition-opacity flex items-center"
            >
              {currentStep === 5 ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Add Vendor
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}