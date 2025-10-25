'use client'

import { PermissionGuard } from '@/components/auth/permission-guard'
import ClientForm from '@/components/clients/client-form'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewClientPage() {
  return (
    <PermissionGuard permission="write:clients">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/clients"
            className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-white">New Client</h1>
            <p className="text-gray-400 mt-1">Add a new client to your CRM</p>
          </div>
        </div>

        {/* Form */}
        <ClientForm mode="create" />
      </div>
    </PermissionGuard>
  )
}