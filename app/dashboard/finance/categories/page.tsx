'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Edit2, ChevronRight, ChevronDown, Tags, TrendingUp, TrendingDown, DollarSign } from 'lucide-react'
import { Category, CategoryType } from '@/types/finance'
import { formatWithCurrency } from '@/lib/finance-utils'

const currency = { code: 'EGP', symbol: 'E£', symbolPosition: 'before' as const, decimalPlaces: 2 }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    // Income categories
    { id: '1', tenantId: 'tenant1', name: 'Services', type: 'income', path: 'Income/Services', level: 1, order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 125000 },
    { id: '2', tenantId: 'tenant1', name: 'Development', type: 'income', parentId: '1', path: 'Income/Services/Development', level: 2, order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 85000 },
    { id: '3', tenantId: 'tenant1', name: 'Consulting', type: 'income', parentId: '1', path: 'Income/Services/Consulting', level: 2, order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 40000 },
    { id: '4', tenantId: 'tenant1', name: 'Products', type: 'income', path: 'Income/Products', level: 1, order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 35000 },
    { id: '5', tenantId: 'tenant1', name: 'Recurring', type: 'income', path: 'Income/Recurring', level: 1, order: 3, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 28000 },

    // Expense categories
    { id: '6', tenantId: 'tenant1', name: 'Office', type: 'expense', path: 'Expense/Office', level: 1, order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 45000, budgetAmount: 50000, budgetPeriod: 'monthly' },
    { id: '7', tenantId: 'tenant1', name: 'Rent', type: 'expense', parentId: '6', path: 'Expense/Office/Rent', level: 2, order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 25500, budgetAmount: 30000, budgetPeriod: 'monthly' },
    { id: '8', tenantId: 'tenant1', name: 'Utilities', type: 'expense', parentId: '6', path: 'Expense/Office/Utilities', level: 2, order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 12000 },
    { id: '9', tenantId: 'tenant1', name: 'Supplies', type: 'expense', parentId: '6', path: 'Expense/Office/Supplies', level: 2, order: 3, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 7500 },
    { id: '10', tenantId: 'tenant1', name: 'Salaries', type: 'expense', path: 'Expense/Salaries', level: 1, order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 180000, budgetAmount: 200000, budgetPeriod: 'monthly' },
    { id: '11', tenantId: 'tenant1', name: 'Marketing', type: 'expense', path: 'Expense/Marketing', level: 1, order: 3, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 32000, budgetAmount: 40000, budgetPeriod: 'monthly' },
    { id: '12', tenantId: 'tenant1', name: 'Digital Ads', type: 'expense', parentId: '11', path: 'Expense/Marketing/Digital Ads', level: 2, order: 1, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 18000 },
    { id: '13', tenantId: 'tenant1', name: 'Content', type: 'expense', parentId: '11', path: 'Expense/Marketing/Content', level: 2, order: 2, isActive: true, createdAt: new Date(), updatedAt: new Date(), totalSpent: 14000 }
  ])

  const [expandedIds, setExpandedIds] = useState<string[]>(['1', '6', '11'])
  const [selectedType, setSelectedType] = useState<'all' | CategoryType>('all')

  // Build tree structure
  const buildTree = (parentId: string | undefined = undefined): Category[] => {
    return categories
      .filter(cat => {
        const matchesParent = cat.parentId === parentId
        const matchesType = selectedType === 'all' || cat.type === selectedType
        return matchesParent && matchesType
      })
      .sort((a, b) => a.order - b.order)
      .map(cat => ({
        ...cat,
        children: buildTree(cat.id)
      }))
  }

  const toggleExpand = (id: string) => {
    setExpandedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const incomeCategories = categories.filter(c => c.type === 'income')
  const expenseCategories = categories.filter(c => c.type === 'expense')
  const totalIncome = incomeCategories.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
  const totalExpenses = expenseCategories.reduce((sum, c) => sum + (c.totalSpent || 0), 0)
  const categoriesWithBudget = categories.filter(c => c.budgetAmount).length

  const CategoryRow = ({ category, depth = 0 }: { category: Category & { children?: Category[] }, depth?: number }) => {
    const hasChildren = category.children && category.children.length > 0
    const isExpanded = expandedIds.includes(category.id)
    const budgetUtilization = category.budgetAmount
      ? ((category.totalSpent || 0) / category.budgetAmount) * 100
      : 0

    return (
      <>
        <tr className="hover:bg-gray-700/30 transition-colors">
          <td className="px-6 py-4" style={{ paddingLeft: `${24 + depth * 32}px` }}>
            <div className="flex items-center gap-2">
              {hasChildren && (
                <button
                  onClick={() => toggleExpand(category.id)}
                  className="p-1 hover:bg-gray-600 rounded transition-colors"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              )}
              {!hasChildren && <div className="w-6" />}
              <span className="text-white font-medium">{category.name}</span>
            </div>
          </td>
          <td className="px-6 py-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              category.type === 'income'
                ? 'bg-green-400/10 text-green-400'
                : 'bg-red-400/10 text-red-400'
            }`}>
              {category.type}
            </span>
          </td>
          <td className="px-6 py-4 text-gray-400 text-sm font-mono">
            {category.path}
          </td>
          <td className="px-6 py-4 text-right">
            <span className={`font-semibold ${category.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
              {formatWithCurrency(category.totalSpent || 0, currency)}
            </span>
          </td>
          <td className="px-6 py-4">
            {category.budgetAmount ? (
              <div>
                <div className="text-gray-300 text-sm mb-1">
                  {formatWithCurrency(category.budgetAmount, currency)} / {category.budgetPeriod}
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      budgetUtilization > 100 ? 'bg-red-500' :
                      budgetUtilization > 85 ? 'bg-yellow-500' :
                      'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetUtilization, 100)}%` }}
                  />
                </div>
                <div className={`text-xs mt-1 ${
                  budgetUtilization > 100 ? 'text-red-400' :
                  budgetUtilization > 85 ? 'text-yellow-400' :
                  'text-gray-400'
                }`}>
                  {budgetUtilization.toFixed(0)}% used
                </div>
              </div>
            ) : (
              <span className="text-gray-500 text-sm">No budget</span>
            )}
          </td>
          <td className="px-6 py-4">
            <Link
              href={`/dashboard/finance/categories/${category.id}/edit`}
              className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors inline-flex"
            >
              <Edit2 className="w-4 h-4" />
            </Link>
          </td>
        </tr>
        {hasChildren && isExpanded && category.children!.map(child => (
          <CategoryRow key={child.id} category={child} depth={depth + 1} />
        ))}
      </>
    )
  }

  const tree = buildTree()

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-purple bg-clip-text text-transparent mb-2">
            Categories
          </h1>
          <p className="text-gray-400">
            Organize income and expenses with nested categories
          </p>
        </div>
        <Link
          href="/dashboard/finance/categories/new"
          className="px-4 py-2 rounded-lg gradient-purple text-white font-medium hover:opacity-90 transition-all flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Category</span>
        </Link>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Categories</span>
            <Tags className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white">{categories.length}</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Income</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            {formatWithCurrency(totalIncome, currency)}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Total Expenses</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <p className="text-2xl font-bold text-red-400">
            {formatWithCurrency(totalExpenses, currency)}
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">With Budgets</span>
            <DollarSign className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{categoriesWithBudget}</p>
          <p className="text-gray-400 text-xs mt-1">Categories with budget tracking</p>
        </div>
      </div>

      {/* Type Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedType === 'all'
              ? 'bg-gradient-purple text-white'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
          }`}
        >
          All Categories
        </button>
        <button
          onClick={() => setSelectedType('income')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedType === 'income'
              ? 'bg-green-500/20 text-green-400 border border-green-500'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Income Categories
        </button>
        <button
          onClick={() => setSelectedType('expense')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            selectedType === 'expense'
              ? 'bg-red-500/20 text-red-400 border border-red-500'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
          }`}
        >
          Expense Categories
        </button>
      </div>

      {/* Categories Tree Table */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Category Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Path
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {tree.map(category => (
                <CategoryRow key={category.id} category={category} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-8 bg-blue-500/10 border border-blue-500/30 rounded-lg p-6">
        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
          <Tags className="w-5 h-5 text-blue-400" />
          About Categories
        </h3>
        <div className="text-gray-300 space-y-2 text-sm">
          <p>
            <strong className="text-white">Nested Structure:</strong> Create subcategories with unlimited depth
            (e.g., Expense → Office → Rent → Cairo HQ).
          </p>
          <p>
            <strong className="text-white">Budgets:</strong> Set monthly, quarterly, or annual budgets for any category.
            Track utilization and get alerts when approaching limits.
          </p>
          <p>
            <strong className="text-white">Total Amounts:</strong> Shows the sum of all transactions in that category,
            including subcategories.
          </p>
        </div>
      </div>
    </div>
  )
}
