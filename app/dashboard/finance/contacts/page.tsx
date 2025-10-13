'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Eye, UserCircle, Building, Users, DollarSign, TrendingUp } from 'lucide-react'
import Select from '@/components/ui/select'
import { Contact, ContactType } from '@/types/finance'
import { formatWithCurrency, formatDate } from '@/lib/finance-utils'
import { contactTypeOptions } from '@/lib/select-options'

const currency = { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 }

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([
    {
      id: '1',
      tenantId: 'tenant1',
      type: 'client',
      name: 'Tech Corp Ltd',
      email: 'billing@techcorp.com',
      phone: '+20 123 456 7890',
      taxId: '123-456-789',
      paymentTerms: 'net-30',
      currency: 'EGP',
      outstandingBalance: 45000,
      tags: ['enterprise', 'priority'],
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-10')
    },
    {
      id: '2',
      tenantId: 'tenant1',
      type: 'vendor',
      name: 'Cairo Properties',
      displayName: 'Cairo Properties - Landlord',
      email: 'contact@cairoprops.com',
      phone: '+20 111 222 3333',
      paymentTerms: 'due-on-receipt',
      currency: 'EGP',
      outstandingBalance: -8500, // Prepaid
      tags: ['recurring', 'office'],
      isActive: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-03-01')
    },
    {
      id: '3',
      tenantId: 'tenant1',
      type: 'vendor',
      name: 'Dell Technologies',
      email: 'sales@dell-mea.com',
      website: 'https://dell.com',
      paymentTerms: 'net-45',
      currency: 'USD',
      outstandingBalance: 0,
      tags: ['hardware', 'technology'],
      isActive: true,
      createdAt: new Date('2024-02-01'),
      updatedAt: new Date('2024-02-01')
    },
    {
      id: '4',
      tenantId: 'tenant1',
      type: 'partner',
      name: 'Marketing Solutions Co',
      displayName: 'MS Co',
      email: 'info@msc.com',
      phone: '+20 100 111 2222',
      paymentTerms: 'net-15',
      currency: 'EGP',
      outstandingBalance: 12000,
      tags: ['marketing', 'services'],
      isActive: true,
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-03-05')
    },
    {
      id: '5',
      tenantId: 'tenant1',
      type: 'client',
      name: 'Startup Inc',
      email: 'finance@startup.io',
      paymentTerms: 'net-15',
      currency: 'USD',
      outstandingBalance: 8400,
      tags: ['startup', 'tech'],
      isActive: true,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date('2024-03-08')
    },
    {
      id: '6',
      tenantId: 'tenant1',
      type: 'vendor',
      name: 'Office Supplies Plus',
      email: 'sales@officesupplies.com',
      phone: '+20 122 333 4444',
      paymentTerms: 'net-30',
      currency: 'EGP',
      outstandingBalance: 0,
      tags: ['office', 'supplies'],
      isActive: false,
      createdAt: new Date('2024-01-10'),
      updatedAt: new Date('2024-02-20')
    }
  ])

  const [typeFilter, setTypeFilter] = useState<string>('')
  const [searchText, setSearchText] = useState('')

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    if (typeFilter && contact.type !== typeFilter) return false
    if (searchText) {
      const search = searchText.toLowerCase()
      return (
        contact.name.toLowerCase().includes(search) ||
        contact.email?.toLowerCase().includes(search) ||
        contact.displayName?.toLowerCase().includes(search) ||
        contact.tags.some(tag => tag.toLowerCase().includes(search))
      )
    }
    return true
  })

  // Statistics
  const activeContacts = contacts.filter(c => c.isActive).length
  const totalReceivable = contacts
    .filter(c => c.outstandingBalance > 0)
    .reduce((sum, c) => sum + c.outstandingBalance, 0)
  const totalPayable = Math.abs(contacts
    .filter(c => c.outstandingBalance < 0)
    .reduce((sum, c) => sum + c.outstandingBalance, 0))
  const contactsByType = contacts.reduce((acc, c) => {
    acc[c.type] = (acc[c.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const getContactTypeIcon = (type: ContactType) => {
    switch (type) {
      case 'client':
        return <Building className="w-5 h-5 text-green-400" />
      case 'vendor':
        return <Building className="w-5 h-5 text-blue-400" />
      case 'partner':
        return <Users className="w-5 h-5 text-purple-400" />
      default:
        return <UserCircle className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Contacts
          </h1>
          <p className="text-gray-400">
            Manage vendors, clients, partners, and other financial contacts
          </p>
        </div>
        <Link
          href="/dashboard/finance/contacts/new"
          className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Contact</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Contacts</span>
            <UserCircle className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{contacts.length}</p>
          <p className="text-gray-400 text-xs mt-1">{activeContacts} active</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Accounts Receivable</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            {formatWithCurrency(totalReceivable, currency)}
          </p>
          <p className="text-gray-400 text-xs mt-1">Outstanding from clients</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Accounts Payable</span>
            <DollarSign className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">
            {formatWithCurrency(totalPayable, currency)}
          </p>
          <p className="text-gray-400 text-xs mt-1">Owed to vendors</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Contact Types</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="space-y-1">
            {Object.entries(contactsByType).map(([type, count]) => (
              <div key={type} className="text-sm">
                <span className="text-white font-semibold">{count}</span>
                <span className="text-gray-400 ml-1 capitalize">{type}s</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Contact Type"
            options={[{ value: '', label: 'All Types' }, ...contactTypeOptions]}
            value={typeFilter}
            onChange={setTypeFilter}
          />

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Search
            </label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search name, email, tags..."
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {(typeFilter || searchText) && (
          <div className="mt-4">
            <button
              onClick={() => {
                setTypeFilter('')
                setSearchText('')
              }}
              className="text-sm text-purple-400 hover:text-purple-300"
            >
              Clear filters
            </button>
            <span className="text-gray-400 text-sm ml-4">
              Showing {filteredContacts.length} of {contacts.length} contacts
            </span>
          </div>
        )}
      </div>

      {/* Contacts Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment Terms
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Outstanding Balance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Tags
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filteredContacts.map((contact) => (
                <tr key={contact.id} className={`hover:bg-gray-700/30 transition-colors ${!contact.isActive ? 'opacity-60' : ''}`}>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{contact.name}</div>
                      {contact.displayName && (
                        <div className="text-gray-400 text-xs mt-1">{contact.displayName}</div>
                      )}
                      {contact.phone && (
                        <div className="text-gray-500 text-xs mt-1">{contact.phone}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getContactTypeIcon(contact.type)}
                      <span className="text-gray-300 capitalize">{contact.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300 text-sm">
                        {contact.email}
                      </a>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-300 text-sm capitalize">
                      {contact.paymentTerms.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {contact.outstandingBalance !== 0 ? (
                      <span className={`font-semibold ${
                        contact.outstandingBalance > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {contact.outstandingBalance > 0 ? '+' : ''}
                        {formatWithCurrency(contact.outstandingBalance, currency)}
                      </span>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {contact.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-400/10 text-purple-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/finance/contacts/${contact.id}`}
                        className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/dashboard/finance/contacts/${contact.id}/edit`}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Edit Contact"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <UserCircle className="w-5 h-5 text-blue-400" />
          About Contacts
        </h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            <strong className="text-white">Unified System:</strong> Manage all your financial counterparties in one place—
            vendors, clients, partners, employees, landlords, etc.
          </p>
          <p>
            <strong className="text-white">Outstanding Balance:</strong> Positive balance = amount owed to you (receivable).
            Negative balance = amount you owe (payable).
          </p>
          <p>
            <strong className="text-white">Payment Terms:</strong> Default terms for new transactions with this contact
            (e.g., Net-30 means payment due in 30 days).
          </p>
          <p>
            <strong className="text-white">Tags:</strong> Organize contacts with custom tags for easy filtering and reporting.
          </p>
        </div>
      </div>
    </div>
  )
}
