'use client'

import { useState, useEffect } from 'react'
import { FileText, AlertCircle } from 'lucide-react'
import SettingsItemList, { SettingsItem } from '@/components/settings/SettingsItemList'
import SettingsItemForm from '@/components/settings/SettingsItemForm'
import {
  STORAGE_KEYS,
  getSettings,
  addSettingsItem,
  updateSettingsItem,
  deleteSettingsItem,
  toggleSettingsItemActive,
  reorderSettings
} from '@/lib/settings-data'

export default function InvoicesSettingsPage() {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SettingsItem | null>(null)
  const [paymentTerms, setPaymentTerms] = useState<SettingsItem[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setPaymentTerms(getSettings(STORAGE_KEYS.INVOICE_PAYMENT_TERMS))
  }

  const handleSave = (data: Partial<SettingsItem>) => {
    if (editingItem) {
      updateSettingsItem(STORAGE_KEYS.INVOICE_PAYMENT_TERMS, editingItem.id, data)
    } else {
      addSettingsItem(STORAGE_KEYS.INVOICE_PAYMENT_TERMS, data)
    }
    loadData()
    setIsFormOpen(false)
    setEditingItem(null)
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Invoices Settings</h1>
            <p className="text-gray-400">Configure payment terms and invoice defaults</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-300 font-medium">Invoice Configuration</p>
            <p className="text-blue-400/80 text-sm mt-1">
              Define payment terms to standardize billing cycles and improve cash flow management.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-gray-900/30 backdrop-blur-xl border border-gray-800 p-6">
        <SettingsItemList
          items={paymentTerms}
          title="Payment Terms"
          description="Define standard payment terms for invoices"
          onAdd={() => { setEditingItem(null); setIsFormOpen(true) }}
          onEdit={(item) => { setEditingItem(item); setIsFormOpen(true) }}
          onDelete={(id) => { deleteSettingsItem(STORAGE_KEYS.INVOICE_PAYMENT_TERMS, id); loadData() }}
          onToggleActive={(id) => { toggleSettingsItemActive(STORAGE_KEYS.INVOICE_PAYMENT_TERMS, id); loadData() }}
          onReorder={(newOrder) => { reorderSettings(STORAGE_KEYS.INVOICE_PAYMENT_TERMS, newOrder); loadData() }}
          showColor={false}
          addButtonText="Add Payment Term"
          emptyMessage="No payment terms configured"
        />
      </div>

      <SettingsItemForm
        item={editingItem}
        isOpen={isFormOpen}
        onClose={() => { setIsFormOpen(false); setEditingItem(null) }}
        onSave={handleSave}
        title="Payment Term"
        showColor={false}
      />
    </div>
  )
}
