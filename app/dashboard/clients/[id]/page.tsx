'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  ArrowLeft, MoreVertical, Edit, Phone, Mail, Globe,
  MapPin, Calendar, DollarSign, Briefcase, Users,
  FileText, TrendingUp, Clock, CheckCircle2, AlertCircle,
  Star, MessageSquare, Plus, Download, ExternalLink,
  Building2, CreditCard, Receipt, Activity, PieChart,
  BarChart3, User, Send, Trash2, ChevronRight,
  UserCheck, Gift, Package, Zap, Map, Navigation,
  PhoneCall, Smartphone, Home
} from 'lucide-react'
import Link from 'next/link'

// Mock enhanced client data
const clientData = {
  id: 'c1',
  businessName: 'TechCorp Solutions Ltd.',
  tradingName: 'TechCorp Inc.',
  logo: 'TC',
  industry: 'Technology',
  website: 'www.techcorp.com',

  // Multiple phone numbers
  phoneNumbers: [
    { type: 'Main', number: '+1 (555) 123-4567', primary: true },
    { type: 'Support', number: '+1 (555) 123-4568', primary: false },
    { type: 'Sales', number: '+1 (555) 123-4569', primary: false },
    { type: 'Emergency', number: '+1 (555) 123-4570', primary: false }
  ],

  email: 'contact@techcorp.com',
  fax: '+1 (555) 123-4571',

  // Enhanced address with map coordinates
  address: {
    street: '123 Tech Street, Suite 500',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
    country: 'United States',
    coordinates: {
      lat: 37.7749,
      lng: -122.4194
    },
    description: 'Located in the Financial District, near Montgomery Station. Building has underground parking. Enter through main lobby and take elevator to 5th floor.'
  },

  // Account Manager
  accountManager: {
    id: 'am1',
    name: 'Sarah Wilson',
    email: 'sarah.wilson@mashub.com',
    phone: '+1 (555) 999-8888',
    avatar: 'SW',
    department: 'Enterprise Sales'
  },

  // Referral Information
  referral: {
    source: 'client',
    referredBy: {
      id: 'c3',
      name: 'MegaStore Inc',
      contact: 'Michael Chen'
    },
    referralDate: '2023-02-15',
    referralService: {
      id: 's1',
      name: 'ShopLeez POS',
      package: 'Professional',
      price: 599
    },
    referralBonus: 500,
    referralNotes: 'Recommended after successful POS implementation'
  },

  // Related Contacts
  relatedContacts: [
    {
      id: 'rc1',
      name: 'John Smith',
      role: 'Chief Technology Officer',
      department: 'Technology',
      email: 'john.smith@techcorp.com',
      phone: '+1 (555) 234-5678',
      mobile: '+1 (555) 234-5679',
      isPrimary: true,
      avatar: 'JS'
    },
    {
      id: 'rc2',
      name: 'Emily Brown',
      role: 'Chief Financial Officer',
      department: 'Finance',
      email: 'emily.brown@techcorp.com',
      phone: '+1 (555) 234-5680',
      mobile: '+1 (555) 234-5681',
      isPrimary: false,
      avatar: 'EB'
    },
    {
      id: 'rc3',
      name: 'David Lee',
      role: 'General Manager',
      department: 'Operations',
      email: 'david.lee@techcorp.com',
      phone: '+1 (555) 234-5682',
      mobile: '+1 (555) 234-5683',
      isPrimary: false,
      avatar: 'DL'
    },
    {
      id: 'rc4',
      name: 'Lisa Johnson',
      role: 'HR Director',
      department: 'Human Resources',
      email: 'lisa.johnson@techcorp.com',
      phone: '+1 (555) 234-5684',
      mobile: null,
      isPrimary: false,
      avatar: 'LJ'
    }
  ],

  // Services & Products
  assignedServices: [
    {
      id: 'srv1',
      name: 'ShopLeez POS',
      package: 'Professional',
      price: 599,
      monthlyPrice: 59,
      status: 'active',
      startDate: '2023-04-01',
      renewalDate: '2024-04-01'
    },
    {
      id: 'srv2',
      name: 'E-Commerce Platform',
      package: 'Pro Store',
      price: 1499,
      monthlyPrice: 149,
      status: 'active',
      startDate: '2023-06-15',
      renewalDate: '2024-06-15'
    },
    {
      id: 'srv4',
      name: 'CRM System',
      package: 'Business',
      price: 799,
      monthlyPrice: 79,
      status: 'active',
      startDate: '2023-08-01',
      renewalDate: '2024-08-01'
    }
  ],

  // Active Projects
  activeProjects: [
    {
      id: 'p1',
      name: 'E-Commerce Platform',
      status: 'in_progress',
      progress: 65,
      budget: 125000,
      spent: 78500,
      dueDate: '2024-06-30',
      manager: 'Sarah Chen'
    }
  ],

  // Recent Invoices
  recentInvoices: [
    {
      id: 'inv1',
      number: 'INV-2024-001',
      amount: 45000,
      date: '2024-03-01',
      dueDate: '2024-03-31',
      status: 'pending',
      description: 'Monthly services and support'
    },
    {
      id: 'inv2',
      number: 'INV-2024-002',
      amount: 125000,
      date: '2024-02-15',
      dueDate: '2024-03-15',
      status: 'paid',
      description: 'E-commerce platform development'
    },
    {
      id: 'inv3',
      number: 'INV-2024-003',
      amount: 89000,
      date: '2024-02-01',
      dueDate: '2024-03-01',
      status: 'paid',
      description: 'CRM system setup and integration'
    }
  ],

  products: [
    {
      id: 'p1',
      name: 'Dell UltraSharp 27" Monitor',
      quantity: 10,
      unitPrice: 899.99,
      totalPrice: 8999.90,
      purchaseDate: '2023-05-10',
      warrantyExpiry: '2026-05-10'
    },
    {
      id: 'p2',
      name: 'Logitech MX Master 3',
      quantity: 15,
      unitPrice: 129.99,
      totalPrice: 1949.85,
      purchaseDate: '2023-05-10',
      warrantyExpiry: '2025-05-10'
    }
  ],

  // Recent Visits
  recentVisits: [
    {
      id: 'v1',
      date: '2024-03-20',
      type: 'onsite',
      reason: 'Quarterly Business Review',
      duration: '2 hours',
      cost: 500,
      status: 'completed'
    },
    {
      id: 'v2',
      date: '2024-03-15',
      type: 'online',
      reason: 'Technical Support',
      duration: '1 hour',
      cost: 0,
      status: 'completed'
    },
    {
      id: 'v3',
      date: '2024-03-25',
      type: 'onsite',
      reason: 'New Product Demo',
      duration: '3 hours',
      cost: 750,
      status: 'scheduled'
    }
  ],

  status: 'active',
  tier: 'enterprise',
  joinDate: new Date('2023-03-15'),
  lastActivity: new Date('2024-03-20'),
  description: 'Leading technology company specializing in enterprise software solutions and digital transformation services.',

  // Financials
  totalRevenue: 485000,
  outstandingBalance: 45000,
  creditLimit: 500000,
  paymentTerms: 'Net 30',
  billingCycle: 'Monthly',

  // Statistics
  totalProjects: 8,
  activeProjects: 2,
  completedProjects: 5,
  totalInvoices: 24,
  paidInvoices: 20,

  // Ratings
  rating: 4.8,
  nps: 72,
  satisfactionScore: 92,

  // Tags
  tags: ['Enterprise', 'Long-term', 'Priority', 'Tech Sector', 'Referral'],

  // Preferences
  preferences: {
    communication: 'email',
    timezone: 'America/Los_Angeles',
    language: 'English',
    currency: 'USD'
  }
}

const tabs = [
  { id: 'overview', label: 'Overview', icon: PieChart },
  { id: 'contacts', label: 'Contacts', icon: Users, count: clientData.relatedContacts.length },
  { id: 'services', label: 'Services & Products', icon: Package, count: clientData.assignedServices.length + clientData.products.length },
  { id: 'projects', label: 'Projects', icon: Briefcase, count: clientData.totalProjects },
  { id: 'invoices', label: 'Invoices', icon: Receipt, count: clientData.recentInvoices.length },
  { id: 'visits', label: 'Visits', icon: Calendar, count: clientData.recentVisits.length },
  { id: 'activity', label: 'Activity', icon: Activity }
]

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  inactive: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  pending: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  suspended: 'bg-red-500/20 text-red-400 border-red-500/30'
}

const tierColors = {
  starter: 'from-gray-600 to-gray-500',
  growth: 'from-blue-600 to-cyan-500',
  professional: 'from-purple-600 to-pink-500',
  enterprise: 'from-yellow-600 to-orange-500'
}

export default function ClientDetailPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const params = useParams()

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/clients" className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-400" />
          </Link>
          <div className="flex items-center space-x-4">
            <div className={cn(
              "w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-bold text-white",
              "bg-gradient-to-r",
              tierColors[clientData.tier]
            )}>
              {clientData.logo}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{clientData.businessName}</h1>
              <div className="flex items-center space-x-3 mt-1">
                <span className={cn(
                  "px-2 py-1 rounded-lg text-xs font-medium border",
                  statusColors[clientData.status]
                )}>
                  {clientData.status.toUpperCase()}
                </span>
                <span className="text-gray-400">{clientData.industry}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-400">Client since {clientData.joinDate.toLocaleDateString()}</span>
                {clientData.referral && (
                  <>
                    <span className="text-gray-600">•</span>
                    <div className="flex items-center space-x-1 text-purple-400">
                      <Gift className="h-4 w-4" />
                      <span className="text-sm">Referral</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Phone className="h-5 w-5 text-gray-400" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
            <Mail className="h-5 w-5 text-gray-400" />
          </button>
          <Link
            href={`/dashboard/visits/new?client=${clientData.id}`}
            className="px-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-all flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>Schedule Visit</span>
          </Link>
          <Link
            href={`/dashboard/clients/${clientData.id}/edit`}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Client</span>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-6 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Revenue</span>
            <DollarSign className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-xl font-bold text-white">${(clientData.totalRevenue / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Outstanding</span>
            <CreditCard className="h-4 w-4 text-yellow-400" />
          </div>
          <p className="text-xl font-bold text-white">${(clientData.outstandingBalance / 1000).toFixed(0)}K</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Projects</span>
            <Briefcase className="h-4 w-4 text-blue-400" />
          </div>
          <p className="text-xl font-bold text-white">{clientData.activeProjects}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Services</span>
            <Zap className="h-4 w-4 text-purple-400" />
          </div>
          <p className="text-xl font-bold text-white">{clientData.assignedServices.length}</p>
          <p className="text-xs text-gray-500">Active</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">NPS Score</span>
            <TrendingUp className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-xl font-bold text-white">{clientData.nps}</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Rating</span>
            <Star className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-4 w-4",
                  i < Math.floor(clientData.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"
                )}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Tabs */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-1">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg transition-all",
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-violet-600 to-purple-600 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                  {tab.count && (
                    <span className="ml-1 px-2 py-0.5 rounded-full bg-white/20 text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Business Information</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Business Name</p>
                      <p className="text-white">{clientData.businessName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Trading Name</p>
                      <p className="text-white">{clientData.tradingName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Industry</p>
                      <p className="text-white">{clientData.industry}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Website</p>
                      <a href={`https://${clientData.website}`} className="text-purple-400 hover:text-purple-300 flex items-center space-x-1">
                        <span>{clientData.website}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Phone Numbers</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {clientData.phoneNumbers.map((phone, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-800/50">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center",
                          phone.primary ? "bg-purple-600" : "bg-gray-700"
                        )}>
                          {phone.type === 'Mobile' ? <Smartphone className="h-4 w-4 text-white" /> : <Phone className="h-4 w-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-gray-400">{phone.type}{phone.primary && ' (Primary)'}</p>
                          <p className="text-white">{phone.number}</p>
                        </div>
                        <button className="p-1 rounded hover:bg-gray-700 transition-colors">
                          <PhoneCall className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Location</h3>
                  <div className="rounded-lg overflow-hidden border border-gray-800">
                    <div className="h-48 bg-gray-800 flex items-center justify-center relative">
                      <Map className="h-12 w-12 text-gray-600" />
                      <div className="absolute top-4 right-4">
                        <button className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors flex items-center space-x-1">
                          <Navigation className="h-3 w-3" />
                          <span>Get Directions</span>
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-gray-800/50">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-white">{clientData.address.street}</p>
                          <p className="text-gray-300">
                            {clientData.address.city}, {clientData.address.state} {clientData.address.zip}
                          </p>
                          <p className="text-gray-300">{clientData.address.country}</p>
                          <p className="text-sm text-gray-400 mt-2">{clientData.address.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {clientData.referral && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Referral Information</h3>
                    <div className="p-4 rounded-lg bg-purple-500/10 border border-purple-500/20">
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                          <Gift className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium">Referred by {clientData.referral.referredBy.name}</p>
                          <p className="text-sm text-gray-400 mt-1">
                            Contact: {clientData.referral.referredBy.contact} • Date: {clientData.referral.referralDate}
                          </p>
                          <p className="text-sm text-gray-300 mt-2">
                            They purchased: {clientData.referral.referralService.name} ({clientData.referral.referralService.package}) - ${clientData.referral.referralService.price}
                          </p>
                          <p className="text-sm text-gray-400 mt-1 italic">"{clientData.referral.referralNotes}"</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Referral Bonus</p>
                          <p className="text-lg font-semibold text-green-400">${clientData.referral.referralBonus}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Related Contacts</h3>
                  <button className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors">
                    Add Contact
                  </button>
                </div>

                <div className="space-y-3">
                  {clientData.relatedContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center text-white font-medium",
                          contact.isPrimary ? "bg-gradient-to-r from-purple-600 to-pink-600" : "bg-gray-700"
                        )}>
                          {contact.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-white font-medium">{contact.name}</p>
                            {contact.isPrimary && (
                              <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">Primary</span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{contact.role} • {contact.department}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Mail className="h-3 w-3" />
                              <span>{contact.email}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Phone className="h-3 w-3" />
                              <span>{contact.phone}</span>
                            </div>
                            {contact.mobile && (
                              <div className="flex items-center space-x-1 text-xs text-gray-400">
                                <Smartphone className="h-3 w-3" />
                                <span>{contact.mobile}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                          <Phone className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                          <Mail className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Active Services</h3>
                    <button className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors">
                      Add Service
                    </button>
                  </div>
                  <div className="space-y-3">
                    {clientData.assignedServices.map((service) => (
                      <div key={service.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{service.name}</p>
                            <p className="text-sm text-gray-400">{service.package} Package • Since {service.startDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${service.monthlyPrice}/mo</p>
                          <p className="text-xs text-gray-400">Renews {service.renewalDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Products Purchased</h3>
                    <button className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors">
                      Add Product
                    </button>
                  </div>
                  <div className="space-y-3">
                    {clientData.products.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{product.name}</p>
                            <p className="text-sm text-gray-400">{product.quantity} units • Purchased {product.purchaseDate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${product.totalPrice.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">Warranty until {product.warrantyExpiry}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Active Projects</h3>
                  <Link
                    href={`/dashboard/projects/new?client=${clientData.id}`}
                    className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors"
                  >
                    New Project
                  </Link>
                </div>

                <div className="space-y-3">
                  {clientData.activeProjects.map((project) => (
                    <Link key={project.id} href={`/dashboard/projects/${project.id}`}>
                      <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 flex items-center justify-center">
                              <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{project.name}</p>
                              <p className="text-sm text-gray-400">Manager: {project.manager}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <span className={cn(
                              "px-2 py-1 rounded-lg text-xs border",
                              project.status === 'in_progress'
                                ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                                : 'bg-green-500/20 text-green-400 border-green-500/30'
                            )}>
                              {project.status.replace('_', ' ').toUpperCase()}
                            </span>
                            <ArrowUpRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-gray-400">Progress</span>
                            <span className="text-xs text-white font-medium">{project.progress}%</span>
                          </div>
                          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full transition-all duration-1000"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>

                        {/* Budget info */}
                        <div className="flex items-center justify-between text-sm">
                          <div>
                            <span className="text-gray-400">Budget: </span>
                            <span className="text-white">${(project.spent / 1000).toFixed(0)}k / ${(project.budget / 1000).toFixed(0)}k</span>
                          </div>
                          <div>
                            <span className="text-gray-400">Due: </span>
                            <span className="text-white">{new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'invoices' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Invoices</h3>
                  <Link
                    href={`/dashboard/invoices/new?client=${clientData.id}`}
                    className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors"
                  >
                    Create Invoice
                  </Link>
                </div>

                <div className="space-y-3">
                  {clientData.recentInvoices.map((invoice) => (
                    <Link key={invoice.id} href={`/dashboard/invoices/${invoice.id}`}>
                      <div className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              invoice.status === 'paid'
                                ? "bg-gradient-to-r from-green-600 to-emerald-600"
                                : "bg-gradient-to-r from-yellow-600 to-orange-600"
                            )}>
                              <FileText className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{invoice.number}</p>
                              <p className="text-sm text-gray-400">{invoice.description}</p>
                              <p className="text-xs text-gray-500">
                                Issued: {new Date(invoice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                {invoice.status === 'pending' && (
                                  <span className="ml-2">
                                    • Due: {new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                  </span>
                                )}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="text-right">
                              <p className="text-white font-medium">${invoice.amount.toLocaleString()}</p>
                              <span className={cn(
                                "px-2 py-1 rounded-lg text-xs border",
                                invoice.status === 'paid'
                                  ? 'bg-green-500/20 text-green-400 border-green-500/30'
                                  : 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              )}>
                                {invoice.status.toUpperCase()}
                              </span>
                            </div>
                            <ArrowUpRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'visits' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Visit History</h3>
                  <Link
                    href={`/dashboard/visits/new?client=${clientData.id}`}
                    className="px-3 py-1 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 transition-colors"
                  >
                    Schedule Visit
                  </Link>
                </div>

                <div className="space-y-3">
                  {clientData.recentVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/50">
                      <div className="flex items-center space-x-4">
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          visit.type === 'onsite' ? "bg-gradient-to-r from-blue-600 to-cyan-600" : "bg-gradient-to-r from-purple-600 to-pink-600"
                        )}>
                          {visit.type === 'onsite' ? <MapPin className="h-5 w-5 text-white" /> : <Globe className="h-5 w-5 text-white" />}
                        </div>
                        <div>
                          <p className="text-white font-medium">{visit.reason}</p>
                          <p className="text-sm text-gray-400">{visit.date} • {visit.duration} • {visit.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          {visit.cost > 0 ? (
                            <p className="text-white font-medium">${visit.cost}</p>
                          ) : (
                            <p className="text-gray-400">Free</p>
                          )}
                        </div>
                        <span className={cn(
                          "px-2 py-1 rounded-lg text-xs border",
                          visit.status === 'completed' ? 'bg-green-500/20 text-green-400 border-green-500/30' : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                        )}>
                          {visit.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 space-y-6">
          {/* Account Manager */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Account Manager</h3>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 flex items-center justify-center text-white font-medium">
                {clientData.accountManager.avatar}
              </div>
              <div>
                <p className="text-white font-medium">{clientData.accountManager.name}</p>
                <p className="text-sm text-gray-400">{clientData.accountManager.department}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{clientData.accountManager.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-gray-300">{clientData.accountManager.phone}</span>
              </div>
            </div>
            <button className="w-full mt-4 py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm">
              Contact Manager
            </button>
          </div>

          {/* Financial Overview */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Financial Overview</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Credit Limit</span>
                <span className="text-white font-medium">${(clientData.creditLimit / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Available Credit</span>
                <span className="text-green-400 font-medium">${((clientData.creditLimit - clientData.outstandingBalance) / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Payment Terms</span>
                <span className="text-white">{clientData.paymentTerms}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Billing Cycle</span>
                <span className="text-white">{clientData.billingCycle}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link
                href={`/dashboard/projects/new?client=${clientData.id}`}
                className="w-full py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Link>
              <Link
                href={`/dashboard/invoices/new?client=${clientData.id}`}
                className="w-full py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <Receipt className="h-4 w-4" />
                <span>Create Invoice</span>
              </Link>
              <Link
                href={`/dashboard/visits/new?client=${clientData.id}`}
                className="w-full py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2"
              >
                <Calendar className="h-4 w-4" />
                <span>Schedule Visit</span>
              </Link>
              <button className="w-full py-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Generate Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}