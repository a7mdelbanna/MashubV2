'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, Power, PowerOff, CreditCard, Image, DollarSign, CheckCircle } from 'lucide-react'
import { PaymentMethod } from '@/types/finance'
import { formatDate } from '@/lib/finance-utils'

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      tenantId: 'tenant1',
      name: 'Stripe - Credit/Debit Cards',
      description: 'Pay securely with credit or debit card',
      type: 'stripe',
      isActive: true,
      isAutomated: true,
      displayOrder: 1,
      accountMappings: [
        { currency: 'USD', accountId: 'acc1', accountName: 'Stripe USD' },
        { currency: 'EUR', accountId: 'acc2', accountName: 'Stripe EUR' }
      ],
      apiConfig: {
        provider: 'stripe',
        apiKeyId: 'sk_live_***',
        isLive: true
      },
      instructions: {
        en: 'Click "Pay with Stripe" and enter your card details on the secure payment page.',
        ar: 'انقر على "الدفع بواسطة Stripe" وأدخل تفاصيل بطاقتك في صفحة الدفع الآمنة.'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '2',
      tenantId: 'tenant1',
      name: 'Paymob - Local Payment Gateway',
      description: 'Pay with local cards and mobile wallets',
      type: 'paymob',
      isActive: true,
      isAutomated: true,
      displayOrder: 2,
      accountMappings: [
        { currency: 'EGP', accountId: 'acc3', accountName: 'Paymob EGP' }
      ],
      apiConfig: {
        provider: 'paymob',
        apiKeyId: 'paymob_***',
        isLive: true
      },
      instructions: {
        en: 'Choose Paymob to pay with Egyptian cards or mobile wallets.',
        ar: 'اختر Paymob للدفع ببطاقات مصرية أو محافظ الهاتف المحمول.'
      },
      createdAt: new Date('2024-01-20'),
      updatedAt: new Date('2024-01-20')
    },
    {
      id: '3',
      tenantId: 'tenant1',
      name: 'Bank Transfer - CIB',
      description: 'Direct bank transfer to our CIB account',
      type: 'bank-transfer',
      isActive: true,
      isAutomated: false,
      displayOrder: 3,
      accountMappings: [
        { currency: 'EGP', accountId: 'acc4', accountName: 'CIB - EGP Main' }
      ],
      instructions: {
        en: 'Transfer to:\nBank: CIB\nAccount: 1234567890\nPlease include invoice number in the reference.',
        ar: 'التحويل إلى:\nالبنك: CIB\nالحساب: 1234567890\nيرجى تضمين رقم الفاتورة في المرجع.'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: '4',
      tenantId: 'tenant1',
      name: 'Cash Payment',
      description: 'Pay in cash at our office',
      type: 'cash',
      isActive: false,
      isAutomated: false,
      displayOrder: 4,
      accountMappings: [
        { currency: 'EGP', accountId: 'acc5', accountName: 'Cash - Cairo Office' }
      ],
      instructions: {
        en: 'Visit our Cairo office during business hours to pay in cash.',
        ar: 'قم بزيارة مكتبنا في القاهرة خلال ساعات العمل للدفع نقدًا.'
      },
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-02-20')
    }
  ])

  const handleToggleStatus = (id: string) => {
    setPaymentMethods(paymentMethods.map(pm =>
      pm.id === id ? { ...pm, isActive: !pm.isActive, updatedAt: new Date() } : pm
    ))
  }

  const activePaymentMethods = paymentMethods.filter(pm => pm.isActive)
  const inactivePaymentMethods = paymentMethods.filter(pm => !pm.isActive)
  const automatedCount = paymentMethods.filter(pm => pm.isAutomated && pm.isActive).length

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Payment Methods
          </h1>
          <p className="text-gray-400">
            Manage client-facing payment options and account mappings
          </p>
        </div>
        <Link
          href="/dashboard/finance/payment-methods/new"
          className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Payment Method</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Methods</span>
            <CreditCard className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{paymentMethods.length}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active</span>
            <Power className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{activePaymentMethods.length}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Automated</span>
            <CheckCircle className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{automatedCount}</p>
          <p className="text-gray-400 text-xs mt-1">Auto-post via webhooks</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Currencies Supported</span>
            <DollarSign className="w-4 h-4 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {[...new Set(paymentMethods.flatMap(pm => pm.accountMappings.map(m => m.currency)))].length}
          </p>
        </div>
      </div>

      {/* Active Payment Methods */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 mb-6">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Power className="w-5 h-5 text-green-400" />
            Active Payment Methods
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Account Mappings
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Automation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {activePaymentMethods.map((method) => (
                <tr key={method.id} className="hover:bg-gray-700/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-gray-300 font-semibold">{method.displayOrder}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-white font-medium">{method.name}</div>
                      {method.description && (
                        <div className="text-gray-400 text-sm mt-1">{method.description}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-400/10 text-purple-400 capitalize">
                      {method.type.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {method.accountMappings.map((mapping, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="text-gray-300 font-mono font-semibold">{mapping.currency}</span>
                          <span className="text-gray-500 mx-2">→</span>
                          <span className="text-gray-400">{mapping.accountName}</span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {method.isAutomated ? (
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                          Automated
                        </span>
                        {method.apiConfig && (
                          <div className="text-xs text-gray-500 mt-1">
                            {method.apiConfig.isLive ? 'Live' : 'Test'} mode
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-400/10 text-gray-400">
                        Manual
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/dashboard/finance/payment-methods/${method.id}/edit`}
                        className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                        title="Edit Payment Method"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(method.id)}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                        title="Deactivate"
                      >
                        <PowerOff className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inactive Payment Methods */}
      {inactivePaymentMethods.length > 0 && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <PowerOff className="w-5 h-5 text-red-400" />
              Inactive Payment Methods
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {inactivePaymentMethods.map((method) => (
                  <tr key={method.id} className="hover:bg-gray-700/30 transition-colors opacity-60">
                    <td className="px-6 py-4">
                      <div className="text-white font-medium">{method.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-400 capitalize">{method.type.replace('-', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                      {formatDate(method.updatedAt, 'short')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/finance/payment-methods/${method.id}/edit`}
                          className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleToggleStatus(method.id)}
                          className="p-2 text-green-400 hover:bg-green-400/10 rounded-lg transition-colors"
                          title="Activate"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-blue-400" />
          About Payment Methods
        </h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            <strong className="text-white">Client-Facing:</strong> Payment methods are shown to clients during checkout.
            Configure logos, descriptions, and instructions in both English and Arabic.
          </p>
          <p>
            <strong className="text-white">Account Mapping:</strong> Each payment method maps to one or more accounts by currency.
            When a payment is received in USD via Stripe, it automatically posts to your "Stripe USD" account.
          </p>
          <p>
            <strong className="text-white">Automation:</strong> Automated methods (Stripe, Paymob) can auto-post transactions
            via webhooks. Manual methods (bank transfer, cash) require manual transaction entry.
          </p>
          <p>
            <strong className="text-white">Display Order:</strong> Control the order in which payment methods appear to clients.
            Lower numbers appear first.
          </p>
        </div>
      </div>
    </div>
  )
}
