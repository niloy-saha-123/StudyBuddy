'use client'

import { useState } from 'react'
import RecordingsPanel from '@/components/dashboard/RecordingsPanel'

export default function DashboardPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50">
      <RecordingsPanel />
      
      {/* Main content with proper spacing */}
      <div className="p-8 pl-24">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600">Here&apos;s what&apos;s happening with your studies</p>
        </div>

        <div className="mb-8">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-8 py-4 bg-blue-500 text-white text-xl rounded-xl hover:bg-blue-600 
                     transition-colors"
          >
            Create New Classroom
          </button>
        </div>
      </div>
    </div>
  )
}