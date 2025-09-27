'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  DollarSign, TrendingUp, TrendingDown, CreditCard, PieChart,
  BarChart3, Calendar, Download, Filter, RefreshCw, ArrowUpRight,
  ArrowDownRight, Wallet, Receipt, Target, AlertCircle, CheckCircle,
  Clock, FileText, Plus, Eye, Edit
} from 'lucide-react'

// Mock financial data
const mockFinanceData = {
  overview: {
    totalRevenue: 1250000,
    totalExpenses: 875000,
    netProfit: 375000,
    cashFlow: 185000,
    previousMonthRevenue: 1180000,
    previousMonthExpenses: 820000,
    previousMonthProfit: 360000,
    previousMonthCashFlow: 165000
  },
  monthlyRevenue: [
    { month: 'Jan', revenue: 980000, expenses: 720000, profit: 260000 },
    { month: 'Feb', revenue: 1050000, expenses: 750000, profit: 300000 },
    { month: 'Mar', revenue: 1180000, expenses: 820000, profit: 360000 },
    { month: 'Apr', revenue: 1250000, expenses: 875000, profit: 375000 },
    { month: 'May', revenue: 1320000, expenses: 910000, profit: 410000 },
    { month: 'Jun', revenue: 1400000, expenses: 950000, profit: 450000 }
  ],
  expenseCategories: [
    { category: 'Salaries & Benefits', amount: 450000, percentage: 51.4, color: 'from-blue-600 to-cyan-600' },
    { category: 'Equipment & Software', amount: 185000, percentage: 21.1, color: 'from-purple-600 to-pink-600' },
    { category: 'Office & Facilities', amount: 125000, percentage: 14.3, color: 'from-green-600 to-emerald-600' },
    { category: 'Marketing & Sales', amount: 85000, percentage: 9.7, color: 'from-orange-600 to-yellow-600' },
    { category: 'Other', amount: 30000, percentage: 3.4, color: 'from-gray-600 to-slate-600' }
  ],
  recentTransactions: [
    {
      id: 'txn-001',
      type: 'income',
      description: 'Client Payment - TechCorp Solutions',
      amount: 45000,
      date: '2024-03-20',
      status: 'completed',
      category: 'Project Revenue'
    },
    {
      id: 'txn-002',
      type: 'expense',
      description: 'AWS Infrastructure Costs',
      amount: -8500,
      date: '2024-03-19',
      status: 'completed',
      category: 'Cloud Services'
    },
    {
      id: 'txn-003',
      type: 'income',
      description: 'Subscription Revenue - Q1',
      amount: 25000,
      date: '2024-03-18',
      status: 'completed',
      category: 'Recurring Revenue'
    },
    {
      id: 'txn-004',
      type: 'expense',
      description: 'Office Equipment Purchase',
      amount: -12000,
      date: '2024-03-17',
      status: 'pending',
      category: 'Equipment'
    },
    {
      id: 'txn-005',
      type: 'income',
      description: 'Consulting Services - FinanceHub',
      amount: 18000,
      date: '2024-03-16',
      status: 'completed',
      category: 'Service Revenue'
    }
  ],
  upcomingPayments: [
    { description: 'Vendor Payment - Dell Technologies', amount: 15000, dueDate: '2024-03-25', status: 'pending' },
    { description: 'Tax Payment - Q1 2024', amount: 45000, dueDate: '2024-03-30', status: 'scheduled' },
    { description: 'Software Licenses Renewal', amount: 8500, dueDate: '2024-04-01', status: 'pending' }
  ]
}

export default function FinancePage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [selectedView, setSelectedView] = useState('overview')

  const { overview, monthlyRevenue, expenseCategories, recentTransactions, upcomingPayments } = mockFinanceData

  // Calculate percentage changes
  const revenueChange = ((overview.totalRevenue - overview.previousMonthRevenue) / overview.previousMonthRevenue * 100)
  const expenseChange = ((overview.totalExpenses - overview.previousMonthExpenses) / overview.previousMonthExpenses * 100)
  const profitChange = ((overview.netProfit - overview.previousMonthProfit) / overview.previousMonthProfit * 100)
  const cashFlowChange = ((overview.cashFlow - overview.previousMonthCashFlow) / overview.previousMonthCashFlow * 100)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Finance Dashboard</h1>
          <p className="text-gray-400">Track revenue, expenses, and financial performance</p>
        </div>

        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white focus:border-purple-500 focus:outline-none transition-colors"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 rounded-lg bg-gray-800/50 border border-gray-700 text-white hover:bg-gray-800 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
          <button className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Sync Data</span>
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-green">
              <DollarSign className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${revenueChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {revenueChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(revenueChange).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">${(overview.totalRevenue / 1000).toFixed(0)}K</p>
          <p className="text-gray-400 text-sm">Total Revenue</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-red">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${expenseChange <= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {expenseChange <= 0 ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              <span>{Math.abs(expenseChange).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">${(overview.totalExpenses / 1000).toFixed(0)}K</p>
          <p className="text-gray-400 text-sm">Total Expenses</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-purple">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${profitChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profitChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(profitChange).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">${(overview.netProfit / 1000).toFixed(0)}K</p>
          <p className="text-gray-400 text-sm">Net Profit</p>
        </div>

        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl gradient-blue">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${cashFlowChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {cashFlowChange >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(cashFlowChange).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-2xl font-bold text-white">${(overview.cashFlow / 1000).toFixed(0)}K</p>
          <p className="text-gray-400 text-sm">Cash Flow</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Revenue Trend</h3>
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <BarChart3 className="h-4 w-4 text-gray-400" />
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
                <Download className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {monthlyRevenue.map((month, index) => (
              <div key={month.month} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">{month.month}</span>
                  <span className="text-white font-medium">${(month.revenue / 1000).toFixed(0)}K</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className="h-2 rounded-full gradient-purple"
                    style={{ width: `${(month.revenue / 1500000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Expense Breakdown */}
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Expense Breakdown</h3>
            <button className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <PieChart className="h-4 w-4 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            {expenseCategories.map((category, index) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{category.category}</span>
                  <div className="text-right">
                    <span className="text-white font-medium">${(category.amount / 1000).toFixed(0)}K</span>
                    <span className="text-gray-400 text-xs ml-2">{category.percentage.toFixed(1)}%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
            <Link href="/dashboard/finance/transactions" className="text-purple-400 hover:text-purple-300 text-sm">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    transaction.type === 'income' ? 'gradient-green' : 'gradient-red'
                  }`}>
                    {transaction.type === 'income' ?
                      <ArrowUpRight className="h-4 w-4 text-white" /> :
                      <ArrowDownRight className="h-4 w-4 text-white" />
                    }
                  </div>
                  <div>
                    <p className="text-white font-medium">{transaction.description}</p>
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="text-gray-400">{transaction.category}</span>
                      <span className="text-gray-600">•</span>
                      <span className="text-gray-400">{new Date(transaction.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${
                    transaction.type === 'income' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {transaction.type === 'income' ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${
                    transaction.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {transaction.status === 'completed' ? <CheckCircle className="h-3 w-3 mr-1" /> : <Clock className="h-3 w-3 mr-1" />}
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Upcoming Payments</h3>
            <Link href="/dashboard/finance/payments" className="text-purple-400 hover:text-purple-300 text-sm">
              View All
            </Link>
          </div>

          <div className="space-y-4">
            {upcomingPayments.map((payment, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg gradient-orange">
                    <Receipt className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{payment.description}</p>
                    <p className="text-xs text-gray-400">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-medium">${payment.amount.toLocaleString()}</p>
                  <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs ${
                    payment.status === 'scheduled' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {payment.status === 'scheduled' ? <Clock className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-800">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Total Due This Month</span>
              <span className="text-lg font-bold text-white">
                ${upcomingPayments.reduce((sum, payment) => sum + payment.amount, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800 p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/invoices/new" className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-center group">
            <FileText className="h-8 w-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium">Create Invoice</p>
            <p className="text-xs text-gray-400">Generate new invoice</p>
          </Link>

          <button className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-center group">
            <Download className="h-8 w-8 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium">Export Reports</p>
            <p className="text-xs text-gray-400">Download financial data</p>
          </button>

          <button className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-center group">
            <Target className="h-8 w-8 text-green-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium">Set Budget</p>
            <p className="text-xs text-gray-400">Configure spending limits</p>
          </button>

          <button className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors text-center group">
            <Calendar className="h-8 w-8 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
            <p className="text-white font-medium">Schedule Payment</p>
            <p className="text-xs text-gray-400">Set up recurring payments</p>
          </button>
        </div>
      </div>
    </div>
  )
}