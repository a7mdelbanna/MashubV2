'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft, FileText, Download, Eye, Upload, Plus,
  Calendar, DollarSign, AlertCircle, CheckCircle,
  Clock, Search, Filter, MoreVertical, Edit,
  Trash2, Send, Archive, Shield, TrendingUp
} from 'lucide-react'

// Mock contracts data
const contracts = [
  {
    id: 'con1',
    name: 'Master Service Agreement',
    type: 'MSA',
    status: 'active',
    value: 500000,
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    autoRenew: true,
    signedDate: '2023-12-15',
    signedBy: 'John Smith',
    lastModified: '2024-03-15',
    documents: [
      { name: 'MSA_TechCorp_2024.pdf', size: '2.4 MB', uploaded: '2023-12-15' },
      { name: 'Amendment_1.pdf', size: '450 KB', uploaded: '2024-03-15' }
    ],
    terms: {
      paymentTerms: 'Net 30',
      jurisdiction: 'California, USA',
      confidentiality: 'Mutual NDA',
      liability: 'Limited to contract value'
    }
  },
  {
    id: 'con2',
    name: 'Project Alpha Contract',
    type: 'Fixed Price',
    status: 'active',
    value: 150000,
    startDate: '2024-02-01',
    endDate: '2024-08-31',
    autoRenew: false,
    signedDate: '2024-01-28',
    signedBy: 'Jane Doe',
    lastModified: '2024-02-01',
    documents: [
      { name: 'Project_Alpha_Contract.pdf', size: '1.8 MB', uploaded: '2024-01-28' }
    ],
    terms: {
      paymentTerms: 'Milestone-based',
      jurisdiction: 'California, USA',
      confidentiality: 'Project NDA',
      liability: 'Capped at $200,000'
    }
  },
  {
    id: 'con3',
    name: 'Support & Maintenance Agreement',
    type: 'Retainer',
    status: 'pending_renewal',
    value: 60000,
    startDate: '2023-04-01',
    endDate: '2024-03-31',
    autoRenew: true,
    signedDate: '2023-03-25',
    signedBy: 'John Smith',
    lastModified: '2023-03-25',
    documents: [
      { name: 'Support_Agreement_2023.pdf', size: '980 KB', uploaded: '2023-03-25' }
    ],
    terms: {
      paymentTerms: 'Monthly retainer',
      jurisdiction: 'California, USA',
      confidentiality: 'Standard',
      liability: 'As per MSA'
    }
  },
  {
    id: 'con4',
    name: 'Consulting Services Agreement',
    type: 'Time & Materials',
    status: 'expired',
    value: 80000,
    startDate: '2023-01-01',
    endDate: '2023-12-31',
    autoRenew: false,
    signedDate: '2022-12-20',
    signedBy: 'Michael Chen',
    lastModified: '2023-06-15',
    documents: [
      { name: 'Consulting_Agreement_2023.pdf', size: '1.2 MB', uploaded: '2022-12-20' },
      { name: 'Rate_Schedule.pdf', size: '320 KB', uploaded: '2023-06-15' }
    ],
    terms: {
      paymentTerms: 'Net 15',
      jurisdiction: 'New York, USA',
      confidentiality: 'One-way NDA',
      liability: 'Uncapped'
    }
  }
]

const statusColors = {
  active: 'bg-green-500/20 text-green-400 border-green-500/30',
  pending_renewal: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  expired: 'bg-red-500/20 text-red-400 border-red-500/30',
  draft: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
} as const

const typeColors = {
  'MSA': 'from-violet-600 to-purple-600',
  'Fixed Price': 'from-blue-600 to-cyan-600',
  'Time & Materials': 'from-green-600 to-emerald-600',
  'Retainer': 'from-orange-600 to-yellow-600'
} as const

// Type-safe helpers with fallbacks
const getStatusColor = (status: string): string => {
  return statusColors[status as keyof typeof statusColors] || statusColors.draft
}

const getTypeColor = (type: string): string => {
  return typeColors[type as keyof typeof typeColors] || 'from-gray-600 to-gray-700'
}

export default function ClientContractsPage({ params }: { params: { id: string } }) {
  const [selectedContract, setSelectedContract] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalValue = contracts.reduce((sum, c) => sum + c.value, 0)
  const activeContracts = contracts.filter(c => c.status === 'active').length
  const pendingRenewals = contracts.filter(c => c.status === 'pending_renewal').length

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
            <h1 className="text-3xl font-bold text-white">Contracts & Agreements</h1>
            <p className="text-gray-400">Manage client contracts and legal documents</p>
          </div>
        </div>

        <button className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Contract</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Contracts</span>
            <FileText className="h-5 w-5 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{contracts.length}</p>
          <p className="text-xs text-gray-500 mt-1">All time</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Active</span>
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{activeContracts}</p>
          <p className="text-xs text-green-400 mt-1">Currently active</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Total Value</span>
            <DollarSign className="h-5 w-5 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">${(totalValue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500 mt-1">Combined value</p>
        </div>

        <div className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">Pending Renewal</span>
            <AlertCircle className="h-5 w-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">{pendingRenewals}</p>
          <p className="text-xs text-yellow-400 mt-1">Action required</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search contracts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="pending_renewal">Pending Renewal</option>
          <option value="expired">Expired</option>
          <option value="draft">Draft</option>
        </select>

        <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-gray-300 hover:bg-gray-800 transition-all flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </button>
      </div>

      {/* Contracts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {filteredContracts.map((contract) => (
          <div
            key={contract.id}
            className="bg-gray-900/50 backdrop-blur-xl rounded-xl border border-gray-800 p-6 hover:border-purple-500/50 transition-all cursor-pointer"
            onClick={() => setSelectedContract(contract)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getTypeColor(contract.type)} flex items-center justify-center`}>
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{contract.name}</h3>
                  <p className="text-sm text-gray-400">{contract.type}</p>
                </div>
              </div>
              <button className="p-1 rounded-lg hover:bg-gray-800 transition-colors">
                <MoreVertical className="h-4 w-4 text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Contract Value</span>
                <span className="font-semibold text-white">${(contract.value / 1000).toFixed(0)}K</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Duration</span>
                <span className="text-sm text-white">
                  {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Status</span>
                <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(contract.status)}`}>
                  {contract.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Contract Documents */}
            <div className="border-t border-gray-800 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400">{contract.documents.length} document(s)</span>
                {contract.autoRenew && (
                  <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>Auto-renew</span>
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button className="flex-1 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 transition-all flex items-center justify-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span className="text-sm">View</span>
                </button>
                <button className="flex-1 py-2 rounded-lg bg-gray-800/50 text-gray-300 hover:bg-gray-800 transition-all flex items-center justify-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">Download</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contract Detail Modal */}
      {selectedContract && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-gray-900 rounded-xl border border-gray-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${getTypeColor(selectedContract.type)} flex items-center justify-center`}>
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedContract.name}</h2>
                    <p className="text-gray-400">{selectedContract.type} Agreement</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedContract(null)}
                  className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Contract Details */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Contract Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className={`px-2 py-1 rounded-lg text-xs border ${getStatusColor(selectedContract.status)}`}>
                        {selectedContract.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Value</span>
                      <span className="text-white font-semibold">${selectedContract.value.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Start Date</span>
                      <span className="text-white">{new Date(selectedContract.startDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">End Date</span>
                      <span className="text-white">{new Date(selectedContract.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Auto-renewal</span>
                      <span className="text-white">{selectedContract.autoRenew ? 'Enabled' : 'Disabled'}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Signature Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Signed By</span>
                      <span className="text-white">{selectedContract.signedBy}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Signed Date</span>
                      <span className="text-white">{new Date(selectedContract.signedDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Last Modified</span>
                      <span className="text-white">{new Date(selectedContract.lastModified).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Terms & Conditions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <DollarSign className="h-4 w-4 text-green-400" />
                      <span className="text-sm text-gray-400">Payment Terms</span>
                    </div>
                    <p className="text-white">{selectedContract.terms.paymentTerms}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Shield className="h-4 w-4 text-blue-400" />
                      <span className="text-sm text-gray-400">Jurisdiction</span>
                    </div>
                    <p className="text-white">{selectedContract.terms.jurisdiction}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Eye className="h-4 w-4 text-purple-400" />
                      <span className="text-sm text-gray-400">Confidentiality</span>
                    </div>
                    <p className="text-white">{selectedContract.terms.confidentiality}</p>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm text-gray-400">Liability</span>
                    </div>
                    <p className="text-white">{selectedContract.terms.liability}</p>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Documents</h3>
                <div className="space-y-2">
                  {selectedContract.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-white">{doc.name}</p>
                          <p className="text-xs text-gray-400">{doc.size} • Uploaded {doc.uploaded}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                          <Eye className="h-4 w-4 text-gray-400" />
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors">
                          <Download className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-3 pt-4 border-t border-gray-800">
                <button className="flex-1 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center justify-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit Contract</span>
                </button>
                <button className="flex-1 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-all flex items-center justify-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Send for Signature</span>
                </button>
                <button className="flex-1 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition-all flex items-center justify-center space-x-2">
                  <Archive className="h-4 w-4" />
                  <span>Archive</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}