'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2, Mail, Phone, Globe, Building, DollarSign, Calendar, Tag, FileText, TrendingUp, TrendingDown } from 'lucide-react'
import { Contact, FinanceTransaction } from '@/types/finance'
import { formatWithCurrency, formatDate } from '@/lib/finance-utils'

const currency = { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 }

export default function ContactDetailPage({ params }: { params: { id: string } }) {
  const [isLoading, setIsLoading] = useState(true)
  const [contact, setContact] = useState<Contact | null>(null)
  const [recentTransactions, setRecentTransactions] = useState<FinanceTransaction[]>([])

  useEffect(() => {
    const fetchContactData = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 500))

        // Mock contact data
        const mockContact: Contact = {
          id: params.id,
          tenantId: 'tenant1',
          type: 'vendor',
          name: 'Cairo Properties',
          displayName: 'Cairo Properties - Landlord',
          email: 'contact@cairoprops.com',
          phone: '+20 111 222 3333',
          website: 'https://cairoprops.com',
          taxId: '987-654-321',
          paymentTerms: 'net-30',
          currency: 'EGP',
          outstandingBalance: -8500,
          billingAddress: '123 Nile Street, Cairo, Egypt',
          shippingAddress: '',
          notes: 'Primary landlord for Cairo office space. Monthly rent due on the 1st of each month.',
          tags: ['recurring', 'office', 'priority'],
          isActive: true,
          createdAt: new Date('2024-01-15'),
          updatedAt: new Date('2024-03-01')
        }

        // Mock recent transactions
        const mockTransactions: FinanceTransaction[] = [
          {
            id: '1',
            tenantId: 'tenant1',
            type: 'expense',
            amount: 8500,
            currency: 'EGP',
            accountId: 'acc1',
            accountName: 'CIB - EGP Main Account',
            contactId: params.id,
            contactName: 'Cairo Properties',
            description: 'Office rent - March 2024',
            categoryPath: 'Expense/Office/Rent',
            state: 'posted',
            postedAt: new Date('2024-03-01'),
            requiresApproval: false,
            attachments: [],
            createdBy: 'user1',
            createdAt: new Date('2024-03-01')
          },
          {
            id: '2',
            tenantId: 'tenant1',
            type: 'expense',
            amount: 8500,
            currency: 'EGP',
            accountId: 'acc1',
            accountName: 'CIB - EGP Main Account',
            contactId: params.id,
            contactName: 'Cairo Properties',
            description: 'Office rent - February 2024',
            categoryPath: 'Expense/Office/Rent',
            state: 'posted',
            postedAt: new Date('2024-02-01'),
            requiresApproval: false,
            attachments: [],
            createdBy: 'user1',
            createdAt: new Date('2024-02-01')
          }
        ]

        setContact(mockContact)
        setRecentTransactions(mockTransactions)
      } catch (error) {
        console.error('Error fetching contact:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContactData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading contact...</p>
        </div>
      </div>
    )
  }

  if (!contact) {
    return (
      <div className="p-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 max-w-2xl mx-auto">
          <p className="text-red-400">Contact not found</p>
          <Link
            href="/dashboard/finance/contacts"
            className="text-purple-400 hover:text-purple-300 mt-4 inline-block"
          >
            Back to Contacts
          </Link>
        </div>
      </div>
    )
  }

  const getContactTypeIcon = () => {
    switch (contact.type) {
      case 'client':
        return <Building className="w-5 h-5 text-green-400" />
      case 'vendor':
        return <Building className="w-5 h-5 text-blue-400" />
      case 'partner':
        return <Building className="w-5 h-5 text-purple-400" />
      case 'employee':
        return <Building className="w-5 h-5 text-yellow-400" />
      default:
        return <Building className="w-5 h-5 text-gray-400" />
    }
  }

  const totalPaid = recentTransactions.reduce((sum, txn) => sum + txn.amount, 0)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/finance/contacts"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Contacts
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
              {contact.name}
            </h1>
            {contact.displayName && contact.displayName !== contact.name && (
              <p className="text-gray-400">{contact.displayName}</p>
            )}
          </div>
          <Link
            href={`/dashboard/finance/contacts/${contact.id}/edit`}
            className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit Contact</span>
          </Link>
        </div>
      </div>

      {/* Status Banner */}
      {!contact.isActive && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">
            This contact is currently <strong>inactive</strong> and cannot be used in new transactions.
          </p>
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Outstanding Balance */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Outstanding Balance</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <p className={`text-3xl font-bold mb-1 ${
            contact.outstandingBalance > 0 ? 'text-green-400' :
            contact.outstandingBalance < 0 ? 'text-red-400' :
            'text-gray-400'
          }`}>
            {contact.outstandingBalance > 0 ? '+' : ''}
            {formatWithCurrency(contact.outstandingBalance, currency)}
          </p>
          <p className="text-gray-400 text-sm">
            {contact.outstandingBalance > 0 ? 'They owe you' :
             contact.outstandingBalance < 0 ? 'You owe them' :
             'Balanced'}
          </p>
        </div>

        {/* Contact Type */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Contact Type</span>
            {getContactTypeIcon()}
          </div>
          <p className="text-2xl font-bold text-white mb-1 capitalize">{contact.type}</p>
          <p className="text-gray-400 text-sm">{contact.paymentTerms.replace('-', ' ')}</p>
        </div>

        {/* Total Transactions */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Transactions</span>
            <FileText className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white mb-1">{recentTransactions.length}</p>
          <p className="text-gray-400 text-sm">{formatWithCurrency(totalPaid, currency)} total</p>
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
        <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          {contact.email && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <p className="text-gray-400 text-sm">Email</p>
              </div>
              <a href={`mailto:${contact.email}`} className="text-blue-400 hover:text-blue-300">
                {contact.email}
              </a>
            </div>
          )}

          {/* Phone */}
          {contact.phone && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <p className="text-gray-400 text-sm">Phone</p>
              </div>
              <a href={`tel:${contact.phone}`} className="text-white font-medium">
                {contact.phone}
              </a>
            </div>
          )}

          {/* Website */}
          {contact.website && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-gray-400" />
                <p className="text-gray-400 text-sm">Website</p>
              </div>
              <a
                href={contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300"
              >
                {contact.website}
              </a>
            </div>
          )}

          {/* Tax ID */}
          {contact.taxId && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <p className="text-gray-400 text-sm">Tax ID</p>
              </div>
              <p className="text-white font-medium font-mono">{contact.taxId}</p>
            </div>
          )}

          {/* Currency */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400 text-sm">Preferred Currency</p>
            </div>
            <p className="text-white font-medium font-mono">{contact.currency}</p>
          </div>

          {/* Payment Terms */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400 text-sm">Payment Terms</p>
            </div>
            <p className="text-white font-medium capitalize">{contact.paymentTerms.replace('-', ' ')}</p>
          </div>

          {/* Status */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Building className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400 text-sm">Status</p>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              contact.isActive
                ? 'bg-green-400/10 text-green-400'
                : 'bg-red-400/10 text-red-400'
            }`}>
              {contact.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Created */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <p className="text-gray-400 text-sm">Created</p>
            </div>
            <p className="text-white font-medium">{formatDate(contact.createdAt, 'short')}</p>
          </div>
        </div>

        {/* Tags */}
        {contact.tags && contact.tags.length > 0 && (
          <>
            <div className="border-t border-gray-700 my-6"></div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-gray-400" />
                <p className="text-gray-400 text-sm">Tags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-400/10 text-purple-400 border border-purple-400/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Addresses */}
      {(contact.billingAddress || contact.shippingAddress) && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Addresses</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Billing Address */}
            {contact.billingAddress && (
              <div>
                <p className="text-gray-400 text-sm mb-2">Billing Address</p>
                <p className="text-white whitespace-pre-wrap">{contact.billingAddress}</p>
              </div>
            )}

            {/* Shipping Address */}
            {contact.shippingAddress && (
              <div>
                <p className="text-gray-400 text-sm mb-2">Shipping Address</p>
                <p className="text-white whitespace-pre-wrap">{contact.shippingAddress}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Notes */}
      {contact.notes && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Notes</h2>
          <p className="text-white whitespace-pre-wrap">{contact.notes}</p>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 mb-8">
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Recent Transactions
          </h2>
          <Link
            href={`/dashboard/finance/transactions?contactId=${contact.id}`}
            className="text-purple-400 hover:text-purple-300 text-sm"
          >
            View All →
          </Link>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300 text-sm">
                      {txn.postedAt && formatDate(txn.postedAt, 'short')}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{txn.description}</div>
                      {txn.categoryPath && (
                        <div className="text-gray-400 text-xs mt-1">{txn.categoryPath}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        txn.type === 'income'
                          ? 'bg-green-400/10 text-green-400'
                          : txn.type === 'expense'
                          ? 'bg-red-400/10 text-red-400'
                          : 'bg-blue-400/10 text-blue-400'
                      }`}>
                        {txn.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <span className={`font-semibold ${
                        txn.type === 'income' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {txn.type === 'income' ? '+' : '-'}
                        {formatWithCurrency(txn.amount, currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                        {txn.state}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-400">
            No transactions found for this contact
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href={`/dashboard/finance/transactions/new?contactId=${contact.id}`}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors"
        >
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            {contact.type === 'client' ? <TrendingUp className="w-5 h-5 text-green-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
            New Transaction
          </h3>
          <p className="text-gray-400 text-sm">
            Record a new {contact.type === 'client' ? 'income from' : 'payment to'} this contact
          </p>
        </Link>

        <Link
          href={`/dashboard/finance/transactions?contactId=${contact.id}`}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors"
        >
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            Transaction History
          </h3>
          <p className="text-gray-400 text-sm">View all transactions with this contact</p>
        </Link>

        <Link
          href={`/dashboard/finance/reports?contactId=${contact.id}`}
          className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700 hover:border-purple-500 transition-colors"
        >
          <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Contact Statement
          </h3>
          <p className="text-gray-400 text-sm">Generate detailed statement report</p>
        </Link>
      </div>
    </div>
  )
}
