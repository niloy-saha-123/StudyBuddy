'use client'

import { useState } from 'react'
import RecordingsPanel from '@/components/dashboard/RecordingsPanel'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Recordings Panel */}
      <RecordingsPanel />
      
      {/* Main Content Area */}
      <div className="flex-1">
        <div className="p-8">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          {/* Content will go here */}
        </div>
      </div>
    </div>
  )
}