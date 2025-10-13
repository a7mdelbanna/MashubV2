'use client'

import { useState } from 'react'
import { Users, DollarSign, Calendar, TrendingUp, Clock, Pause, XCircle, CheckCircle, AlertCircle, Search, Filter } from 'lucide-react'

interface Subscription {
  id: string
  subscriptionNumber: string
  clientId: string
  clientName: string
  clientEmail: string
  serviceId: string
  serviceName: string
  tierId?: string
  tierName?: string
  status: 'active' | 'paused' | 'cancelled' | 'expired'
  billingCycle: 'monthly' | 'quarterly' | 'semi_annual' | 'annual'
  amount: number
  currency: string
  nextBillingDate: string
  startDate: string
  endDate?: string
  autoRenew: boolean
  trialEndsAt?: string
  isTrialActive: boolean
  totalRevenue: number
  missedPayments: number
}

const mockSubscriptions: Subscription[] = [
  {
    id: 'sub1',
    subscriptionNumber: 'SUB-2024-001',
    clientId: 'c1',
    clientName: 'TechCorp Inc.',
    clientEmail: 'billing@techcorp.com',
    serviceId: 's1',
    serviceName: 'ShopLeez POS',
    tierId: 't2',
    tierName: 'Professional',
    status: 'active',
    billingCycle: 'monthly',
    amount: 599,
    currency: 'USD',
    nextBillingDate: '2024-04-01',
    startDate: '2023-10-01',
    autoRenew: true,
    trialEndsAt: undefined,
    isTrialActive: false,
    totalRevenue: 3594,
    missedPayments: 0
  },
  {
    id: 'sub2',
    subscriptionNumber: 'SUB-2024-002',
    clientId: 'c2',
    clientName: 'FinanceHub',
    clientEmail: 'ops@financehub.com',
    serviceId: 's3',
    serviceName: 'Mobile Banking App',
    tierId: 't8',
    tierName: 'Advanced',
    status: 'active',
    billingCycle: 'annual',
    amount: 9999,
    currency: 'USD',
    nextBillingDate: '2025-02-15',
    startDate: '2024-02-15',
    autoRenew: true,
    trialEndsAt: undefined,
    isTrialActive: false,
    totalRevenue: 9999,
    missedPayments: 0
  },
  {
    id: 'sub3',
    subscriptionNumber: 'SUB-2024-003',
    clientId: 'c3',
    clientName: 'GlobalHR Solutions',
    clientEmail: 'subscriptions@globalhr.com',
    serviceId: 's4',
    serviceName: 'CRM System',
    tierId: 't11',
    tierName: 'Business',
    status: 'active',
    billingCycle: 'monthly',
    amount: 799,
    currency: 'USD',
    nextBillingDate: '2024-03-20',
    startDate: '2023-08-20',
    autoRenew: true,
    trialEndsAt: undefined,
    isTrialActive: false,
    totalRevenue: 5593,
    missedPayments: 0
  },
  {
    id: 'sub4',
    subscriptionNumber: 'SUB-2024-004',
    clientId: 'c4',
    clientName: 'RetailChain Pro',
    clientEmail: 'accounts@retailchain.com',
    serviceId: 's5',
    serviceName: 'Restaurant Management',
    tierId: 't14',
    tierName: 'Restaurant Chain',
    status: 'paused',
    billingCycle: 'monthly',
    amount: 999,
    currency: 'USD',
    nextBillingDate: '2024-04-05',
    startDate: '2023-12-05',
    autoRenew: true,
    trialEndsAt: undefined,
    isTrialActive: false,
    totalRevenue: 2997,
    missedPayments: 1
  },
  {
    id: 'sub5',
    subscriptionNumber: 'SUB-2024-005',
    clientId: 'c5',
    clientName: 'StartupXYZ',
    clientEmail: 'billing@startupxyz.com',
    serviceId: 's1',
    serviceName: 'ShopLeez POS',
    tierId: 't1',
    tierName: 'Starter',
    status: 'active',
    billingCycle: 'monthly',
    amount: 299,
    currency: 'USD',
    nextBillingDate: '2024-03-15',
    startDate: '2024-02-22',
    autoRenew: true,
    trialEndsAt: '2024-03-08',
    isTrialActive: false,
    totalRevenue: 299,
    missedPayments: 0
  },
  {
    id: 'sub6',
    subscriptionNumber: 'SUB-2024-006',
    clientId: 'c6',
    clientName: 'Digital Ventures',
    clientEmail: 'admin@digitalventures.com',
    serviceId: 's2',
    serviceName: 'E-Commerce Platform',
    tierId: 't5',
    tierName: 'Pro Store',
    status: 'cancelled',
    billingCycle: 'monthly',
    amount: 1499,
    currency: 'USD',
    nextBillingDate: '2024-02-10',
    startDate: '2023-06-10',
    endDate: '2024-02-10',
    autoRenew: false,
    trialEndsAt: undefined,
    isTrialActive: false,
    totalRevenue: 11992,
    missedPayments: 0
  }
]

export default function SubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(mockSubscriptions)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filterBillingCycle, setFilterBillingCycle] = useState<string>('all')

  const stats = {
    total: subscriptions.length,
    active: subscriptions.filter(s => s.status === 'active').length,
    paused: subscriptions.filter(s => s.status === 'paused').length,
    cancelled: subscriptions.filter(s => s.status === 'cancelled').length,
    mrr: subscriptions
      .filter(s => s.status === 'active')
      .reduce((sum, s) => {
        let monthly = s.amount
        if (s.billingCycle === 'quarterly') monthly = s.amount / 3
        if (s.billingCycle === 'semi_annual') monthly = s.amount / 6
        if (s.billingCycle === 'annual') monthly = s.amount / 12
        return sum + monthly
      }, 0),
    arr: 0,
    avgValue: subscriptions.reduce((sum, s) => sum + s.amount, 0) / subscriptions.length,
    churnRate: (subscriptions.filter(s => s.status === 'cancelled').length / subscriptions.length) * 100
  }
  stats.arr = stats.mrr * 12

  const filteredSubscriptions = subscriptions.filter(s => {
    const matchesSearch = s.subscriptionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.serviceName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus
    const matchesBilling = filterBillingCycle === 'all' || s.billingCycle === filterBillingCycle
    return matchesSearch && matchesStatus && matchesBilling
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'paused':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/30'
      case 'expired':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4" />
      case 'paused':
        return <Pause className="w-4 h-4" />
      case 'cancelled':
        return <XCircle className="w-4 h-4" />
      case 'expired':
        return <Clock className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getDaysUntilBilling = (date: string) => {
    const now = new Date()
    const billing = new Date(date)
    const diff = billing.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Subscriptions</h1>
          <p className="text-gray-400">Manage recurring service subscriptions</p>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
          <p className="text-sm text-gray-400">Total Subscriptions</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.active}</p>
          <p className="text-sm text-gray-400">Active</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(stats.mrr / 1000).toFixed(1)}k</p>
          <p className="text-sm text-gray-400">MRR</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">${(stats.arr / 1000).toFixed(0)}k</p>
          <p className="text-sm text-gray-400">ARR</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <XCircle className="w-5 h-5 text-red-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.churnRate.toFixed(1)}%</p>
          <p className="text-sm text-gray-400">Churn Rate</p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search subscriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="paused">Paused</option>
            <option value="cancelled">Cancelled</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={filterBillingCycle}
            onChange={(e) => setFilterBillingCycle(e.target.value)}
            className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-purple-500"
          >
            <option value="all">All Billing Cycles</option>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="semi_annual">Semi-Annual</option>
            <option value="annual">Annual</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredSubscriptions.map((subscription) => {
          const daysUntilBilling = getDaysUntilBilling(subscription.nextBillingDate)

          return (
            <div
              key={subscription.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{subscription.subscriptionNumber}</h3>
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(subscription.status)}`}>
                      {getStatusIcon(subscription.status)}
                      {subscription.status.toUpperCase()}
                    </span>
                    {subscription.autoRenew && subscription.status === 'active' && (
                      <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-medium">
                        Auto-Renew
                      </span>
                    )}
                    {subscription.isTrialActive && (
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-xs font-medium">
                        Trial Active
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                    <span>{subscription.clientName}</span>
                    <span>•</span>
                    <span>{subscription.serviceName}</span>
                    {subscription.tierName && (
                      <>
                        <span>•</span>
                        <span>{subscription.tierName}</span>
                      </>
                    )}
                  </div>

                  <div className="grid grid-cols-5 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Amount</p>
                      <p className="text-lg font-semibold text-white">${subscription.amount}</p>
                      <p className="text-xs text-gray-500">{subscription.billingCycle}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
                      <p className="text-lg font-semibold text-green-400">${subscription.totalRevenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Next Billing</p>
                      <p className="text-sm text-white">{new Date(subscription.nextBillingDate).toLocaleDateString()}</p>
                      {subscription.status === 'active' && (
                        <p className="text-xs text-gray-500">
                          {daysUntilBilling > 0 ? `in ${daysUntilBilling} days` : 'Overdue'}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Start Date</p>
                      <p className="text-sm text-white">{new Date(subscription.startDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Missed Payments</p>
                      <p className={`text-lg font-semibold ${subscription.missedPayments > 0 ? 'text-red-400' : 'text-gray-400'}`}>
                        {subscription.missedPayments}
                      </p>
                    </div>
                  </div>

                  {subscription.missedPayments > 0 && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <p className="text-sm text-red-400">
                        This subscription has {subscription.missedPayments} missed payment{subscription.missedPayments > 1 ? 's' : ''}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {subscription.status === 'active' && (
                    <>
                      <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors text-sm">
                        Pause
                      </button>
                      <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm">
                        Cancel
                      </button>
                    </>
                  )}
                  {subscription.status === 'paused' && (
                    <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm">
                      Resume
                    </button>
                  )}
                  {subscription.status === 'cancelled' && (
                    <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                      Reactivate
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredSubscriptions.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No subscriptions found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
