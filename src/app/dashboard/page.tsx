'use client'

import Sidebar from '../../components/dashboard/Sidebar'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1>Dashboard Content</h1>
      </div>
    </div>
  )
}