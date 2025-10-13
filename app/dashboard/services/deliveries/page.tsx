'use client'

import { useState } from 'react'
import { Package, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp, Search, Eye, Download } from 'lucide-react'

interface Delivery {
  id: string
  orderNumber: string
  serviceId: string
  serviceName: string
  clientId: string
  clientName: string
  status: 'not_started' | 'in_progress' | 'delivered' | 'accepted' | 'rejected'
  completionPercentage: number
  totalDeliverables: number
  completedDeliverables: number
  startDate: string
  expectedDeliveryDate: string
  actualDeliveryDate?: string
  hoursSpent: number
  budgetedHours: number
  leadUserName: string
  teamSize: number
  qualityScore?: number
}

const mockDeliveries: Delivery[] = [
  {
    id: 'd1',
    orderNumber: 'DEL-2024-001',
    serviceId: 's1',
    serviceName: 'ShopLeez POS Implementation',
    clientId: 'c1',
    clientName: 'TechCorp Inc.',
    status: 'delivered',
    completionPercentage: 100,
    totalDeliverables: 8,
    completedDeliverables: 8,
    startDate: '2024-02-01',
    expectedDeliveryDate: '2024-02-15',
    actualDeliveryDate: '2024-02-14',
    hoursSpent: 120,
    budgetedHours: 140,
    leadUserName: 'John Smith',
    teamSize: 3,
    qualityScore: 4.8
  },
  {
    id: 'd2',
    orderNumber: 'DEL-2024-002',
    serviceId: 's3',
    serviceName: 'Mobile Banking App Development',
    clientId: 'c2',
    clientName: 'FinanceHub',
    status: 'in_progress',
    completionPercentage: 68,
    totalDeliverables: 12,
    completedDeliverables: 8,
    startDate: '2024-01-15',
    expectedDeliveryDate: '2024-03-30',
    hoursSpent: 450,
    budgetedHours: 640,
    leadUserName: 'Sarah Johnson',
    teamSize: 5,
    qualityScore: undefined
  },
  {
    id: 'd3',
    orderNumber: 'DEL-2024-003',
    serviceId: 's4',
    serviceName: 'CRM System Setup',
    clientId: 'c3',
    clientName: 'GlobalHR Solutions',
    status: 'accepted',
    completionPercentage: 100,
    totalDeliverables: 6,
    completedDeliverables: 6,
    startDate: '2024-02-20',
    expectedDeliveryDate: '2024-03-05',
    actualDeliveryDate: '2024-03-04',
    hoursSpent: 85,
    budgetedHours: 90,
    leadUserName: 'Mike Chen',
    teamSize: 2,
    qualityScore: 4.6
  },
  {
    id: 'd4',
    orderNumber: 'DEL-2024-004',
    serviceId: 's2',
    serviceName: 'E-Commerce Platform Migration',
    clientId: 'c4',
    clientName: 'RetailChain Pro',
    status: 'in_progress',
    completionPercentage: 42,
    totalDeliverables: 10,
    completedDeliverables: 4,
    startDate: '2024-02-25',
    expectedDeliveryDate: '2024-03-28',
    hoursSpent: 145,
    budgetedHours: 350,
    leadUserName: 'Emily Davis',
    teamSize: 4,
    qualityScore: undefined
  },
  {
    id: 'd5',
    orderNumber: 'DEL-2024-005',
    serviceId: 's5',
    serviceName: 'Restaurant Management System',
    clientId: 'c5',
    clientName: 'Gourmet Bistro',
    status: 'not_started',
    completionPercentage: 0,
    totalDeliverables: 7,
    completedDeliverables: 0,
    startDate: '2024-03-15',
    expectedDeliveryDate: '2024-03-29',
    hoursSpent: 0,
    budgetedHours: 120,
    leadUserName: 'Alex Rodriguez',
    teamSize: 2,
    qualityScore: undefined
  },
  {
    id: 'd6',
    orderNumber: 'DEL-2024-006',
    serviceId: 's1',
    serviceName: 'ShopLeez POS - Advanced Setup',
    clientId: 'c6',
    clientName: 'Fashion Retail Co.',
    status: 'in_progress',
    completionPercentage: 85,
    totalDeliverables: 9,
    completedDeliverables: 8,
    startDate: '2024-02-10',
    expectedDeliveryDate: '2024-03-10',
    hoursSpent: 95,
    budgetedHours: 110,
    leadUserName: 'John Smith',
    teamSize: 2,
    qualityScore: undefined
  }
]

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(mockDeliveries)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const stats = {
    total: deliveries.length,
    notStarted: deliveries.filter(d => d.status === 'not_started').length,
    inProgress: deliveries.filter(d => d.status === 'in_progress').length,
    delivered: deliveries.filter(d => d.status === 'delivered').length,
    accepted: deliveries.filter(d => d.status === 'accepted').length,
    onTime: deliveries.filter(d => {
      if (!d.actualDeliveryDate) return false
      return new Date(d.actualDeliveryDate) <= new Date(d.expectedDeliveryDate)
    }).length,
    avgCompletion: deliveries.reduce((sum, d) => sum + d.completionPercentage, 0) / deliveries.length,
    avgQuality: deliveries.filter(d => d.qualityScore).reduce((sum, d) => sum + (d.qualityScore || 0), 0) / deliveries.filter(d => d.qualityScore).length
  }

  const filteredDeliveries = deliveries.filter(d => {
    const matchesSearch = d.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          d.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || d.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'not_started':
        return 'bg-gray-500/20 text-gray-400'
      case 'in_progress':
        return 'bg-blue-500/20 text-blue-400'
      case 'delivered':
        return 'bg-green-500/20 text-green-400'
      case 'accepted':
        return 'bg-purple-500/20 text-purple-400'
      case 'rejected':
        return 'bg-red-500/20 text-red-400'
      default:
        return 'bg-gray-500/20 text-gray-400'
    }
  }

  const isOverdue = (delivery: Delivery) => {
    if (delivery.status === 'delivered' || delivery.status === 'accepted') return false
    return new Date() > new Date(delivery.expectedDeliveryDate)
  }

  const getDaysRemaining = (date: string) => {
    const now = new Date()
    const expected = new Date(date)
    const diff = expected.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }

  return (
    <div className="p-8 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Service Deliveries</h1>
          <p className="text-gray-400">Track and manage service delivery progress</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-5 h-5 text-blue-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.total}</p>
          <p className="text-sm text-gray-400">Total Deliveries</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.inProgress}</p>
          <p className="text-sm text-gray-400">In Progress</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.avgCompletion.toFixed(0)}%</p>
          <p className="text-sm text-gray-400">Avg Completion</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle className="w-5 h-5 text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-white mb-1">{stats.avgQuality.toFixed(1)}</p>
          <p className="text-sm text-gray-400">Avg Quality Score</p>
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search deliveries..."
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
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="delivered">Delivered</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {filteredDeliveries.map((delivery) => {
          const daysRemaining = getDaysRemaining(delivery.expectedDeliveryDate)
          const overdue = isOverdue(delivery)

          return (
            <div
              key={delivery.id}
              className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 hover:bg-gray-700/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-white">{delivery.orderNumber}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(delivery.status)}`}>
                      {delivery.status.replace('_', ' ').toUpperCase()}
                    </span>
                    {overdue && (
                      <span className="flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-xs font-medium">
                        <AlertTriangle className="w-3 h-3" />
                        OVERDUE
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{delivery.serviceName} • {delivery.clientName}</p>

                  <div className="grid grid-cols-6 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Progress</p>
                      <p className="text-lg font-semibold text-white">{delivery.completionPercentage}%</p>
                      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                          style={{ width: `${delivery.completionPercentage}%` }}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Deliverables</p>
                      <p className="text-lg font-semibold text-white">
                        {delivery.completedDeliverables}/{delivery.totalDeliverables}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Hours Spent</p>
                      <p className="text-lg font-semibold text-white">{delivery.hoursSpent}h</p>
                      <p className="text-xs text-gray-500">of {delivery.budgetedHours}h</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Expected Delivery</p>
                      <p className="text-sm text-white">
                        {new Date(delivery.expectedDeliveryDate).toLocaleDateString()}
                      </p>
                      {delivery.status === 'in_progress' && (
                        <p className={`text-xs ${overdue ? 'text-red-400' : 'text-gray-500'}`}>
                          {overdue ? `${Math.abs(daysRemaining)} days overdue` : `${daysRemaining} days left`}
                        </p>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Team</p>
                      <p className="text-sm text-white">{delivery.leadUserName}</p>
                      <p className="text-xs text-gray-500">{delivery.teamSize} members</p>
                    </div>
                    {delivery.qualityScore && (
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Quality Score</p>
                        <p className="text-lg font-semibold text-yellow-400">{delivery.qualityScore}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredDeliveries.length === 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-12 text-center">
          <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No deliveries found matching your criteria</p>
        </div>
      )}
    </div>
  )
}
