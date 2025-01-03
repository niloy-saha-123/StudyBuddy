'use client'

import { useState } from 'react'
import Sidebar from '@/components/dashboard/Sidebar'

export default function DashboardPage() {
  // Track if create classroom modal is open
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      {/* Main Content */}
      <div className="flex-1 p-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600">Here&apos;s what&apos;s happening with your studies</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create New Classroom
          </button>
        </div>

        {/* Classrooms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Will add classroom cards here */}
        </div>
      </div>
    </div>
  )
}