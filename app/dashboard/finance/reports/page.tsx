'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, DollarSign, TrendingUp, TrendingDown, PieChart, BarChart3, FileSpreadsheet } from 'lucide-react'
import Select from '@/components/ui/select'

const reportTypes = [
  {
    id: 'profit-loss',
    name: 'Profit & Loss Statement',
    description: 'Income and expenses over a period of time',
    icon: TrendingUp,
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
    borderColor: 'border-green-400/30'
  },
  {
    id: 'balance-sheet',
    name: 'Balance Sheet',
    description: 'Assets, liabilities, and equity at a point in time',
    icon: DollarSign,
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
    borderColor: 'border-blue-400/30'
  },
  {
    id: 'cash-flow',
    name: 'Cash Flow Statement',
    description: 'Cash inflows and outflows over time',
    icon: TrendingDown,
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
    borderColor: 'border-purple-400/30'
  },
  {
    id: 'transaction-detail',
    name: 'Transaction Detail Report',
    description: 'Detailed list of all transactions',
    icon: FileText,
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
    borderColor: 'border-yellow-400/30'
  },
  {
    id: 'category-summary',
    name: 'Category Summary',
    description: 'Income and expenses by category',
    icon: PieChart,
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
    borderColor: 'border-pink-400/30'
  },
  {
    id: 'contact-statement',
    name: 'Contact Statement',
    description: 'Transaction history with a specific contact',
    icon: FileSpreadsheet,
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
    borderColor: 'border-cyan-400/30'
  },
  {
    id: 'account-statement',
    name: 'Account Statement',
    description: 'Transaction history for a specific account',
    icon: BarChart3,
    color: 'text-orange-400',
    bgColor: 'bg-orange-400/10',
    borderColor: 'border-orange-400/30'
  },
  {
    id: 'budget-variance',
    name: 'Budget vs. Actual',
    description: 'Compare actual spending against budgets',
    icon: TrendingUp,
    color: 'text-red-400',
    bgColor: 'bg-red-400/10',
    borderColor: 'border-red-400/30'
  }
]

const periodOptions = [
  { value: 'this-month', label: 'This Month' },
  { value: 'last-month', label: 'Last Month' },
  { value: 'this-quarter', label: 'This Quarter' },
  { value: 'last-quarter', label: 'Last Quarter' },
  { value: 'this-year', label: 'This Year' },
  { value: 'last-year', label: 'Last Year' },
  { value: 'custom', label: 'Custom Range' }
]

const formatOptions = [
  { value: 'pdf', label: 'PDF Document' },
  { value: 'excel', label: 'Excel Spreadsheet' },
  { value: 'csv', label: 'CSV File' }
]

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('')
  const [period, setPeriod] = useState('this-month')
  const [format, setFormat] = useState('pdf')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock data for accounts and contacts
  const accounts = [
    { id: '', label: 'All Accounts' },
    { id: '1', label: 'CIB - EGP Main Account' },
    { id: '2', label: 'Stripe USD' },
    { id: '3', label: 'Cash - Cairo Office' }
  ]

  const contacts = [
    { id: '', label: 'All Contacts' },
    { id: '1', label: 'Tech Corp Ltd' },
    { id: '2', label: 'Cairo Properties' },
    { id: '3', label: 'Dell Technologies' }
  ]

  const [filters, setFilters] = useState({
    accountId: '',
    contactId: '',
    categoryId: ''
  })

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      alert('Please select a report type')
      return
    }

    setIsGenerating(true)

    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Generating report:', {
        type: selectedReport,
        period,
        format,
        startDate,
        endDate,
        filters
      })

      // In real implementation, this would download the file
      alert(`Report generated successfully! (${format.toUpperCase()})`)
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Failed to generate report. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const selectedReportDetails = reportTypes.find(r => r.id === selectedReport)

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
          Financial Reports
        </h1>
        <p className="text-gray-400">
          Generate comprehensive financial reports for analysis and compliance
        </p>
      </div>

      {/* Report Type Selection */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Select Report Type</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((report) => {
            const Icon = report.icon
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  selectedReport === report.id
                    ? `${report.borderColor} ${report.bgColor}`
                    : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                }`}
              >
                <Icon className={`w-8 h-8 mb-3 ${selectedReport === report.id ? report.color : 'text-gray-400'}`} />
                <h3 className="text-white font-semibold mb-1">{report.name}</h3>
                <p className="text-gray-400 text-sm">{report.description}</p>
              </button>
            )
          })}
        </div>
      </div>

      {/* Report Configuration */}
      {selectedReport && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-6">Report Configuration</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Period Selection */}
            <Select
              label="Time Period"
              options={periodOptions}
              value={period}
              onChange={setPeriod}
            />

            {/* Format Selection */}
            <Select
              label="Export Format"
              options={formatOptions}
              value={format}
              onChange={setFormat}
            />

            {/* Custom Date Range */}
            {period === 'custom' && (
              <>
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </>
            )}
          </div>

          {/* Additional Filters */}
          {(selectedReport === 'transaction-detail' || selectedReport === 'account-statement' || selectedReport === 'contact-statement') && (
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Filters (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {(selectedReport === 'transaction-detail' || selectedReport === 'account-statement') && (
                  <Select
                    label="Account"
                    options={accounts.map(acc => ({ value: acc.id, label: acc.label }))}
                    value={filters.accountId}
                    onChange={(value) => setFilters({ ...filters, accountId: value })}
                  />
                )}

                {(selectedReport === 'transaction-detail' || selectedReport === 'contact-statement') && (
                  <Select
                    label="Contact"
                    options={contacts.map(c => ({ value: c.id, label: c.label }))}
                    value={filters.contactId}
                    onChange={(value) => setFilters({ ...filters, contactId: value })}
                  />
                )}
              </div>
            </div>
          )}

          {/* Report Preview */}
          {selectedReportDetails && (
            <div className={`mt-6 p-4 rounded-lg border ${selectedReportDetails.borderColor} ${selectedReportDetails.bgColor}`}>
              <div className="flex items-center gap-3">
                <selectedReportDetails.icon className={`w-5 h-5 ${selectedReportDetails.color}`} />
                <div className="flex-1">
                  <p className="text-white font-medium">{selectedReportDetails.name}</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {period === 'custom' && startDate && endDate
                      ? `${startDate} to ${endDate}`
                      : periodOptions.find(p => p.value === period)?.label
                    } • {formatOptions.find(f => f.value === format)?.label}
                  </p>
                </div>
                <button
                  onClick={handleGenerateReport}
                  disabled={isGenerating}
                  className="px-6 py-3 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2 disabled:opacity-50"
                >
                  <Download className="h-4 w-4" />
                  <span>{isGenerating ? 'Generating...' : 'Generate Report'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Reports */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Reports</h2>
        <p className="text-gray-400 text-sm mb-6">
          Generate commonly used reports with one click
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <span className="text-white font-medium">Current Month P&L</span>
            </div>
            <p className="text-gray-400 text-sm">Profit & Loss for current month</p>
          </button>

          <button className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <DollarSign className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">YTD Cash Flow</span>
            </div>
            <p className="text-gray-400 text-sm">Year-to-date cash flow statement</p>
          </button>

          <button className="p-4 bg-gray-900/50 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors text-left">
            <div className="flex items-center gap-3 mb-2">
              <PieChart className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Expense Breakdown</span>
            </div>
            <p className="text-gray-400 text-sm">Current month expenses by category</p>
          </button>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-400" />
          About Financial Reports
        </h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            <strong className="text-white">Profit & Loss:</strong> Shows your revenue, costs, and profit over a period. Essential for understanding business performance.
          </p>
          <p>
            <strong className="text-white">Balance Sheet:</strong> Snapshot of your financial position—what you own (assets) and what you owe (liabilities).
          </p>
          <p>
            <strong className="text-white">Cash Flow:</strong> Tracks actual cash moving in and out, crucial for managing liquidity.
          </p>
          <p>
            <strong className="text-white">Export Formats:</strong> PDF for sharing, Excel for analysis, CSV for importing into other systems.
          </p>
        </div>
      </div>
    </div>
  )
}
