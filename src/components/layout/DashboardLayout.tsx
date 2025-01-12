'use client'

import Link from 'next/link'
import LibrarySidebar from '@/components/dashboard/LibrarySidebar'
import ProfileMenu from '@/components/dashboard/ProfileMenu'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center h-20 px-4">
          <div className="flex-grow pl-14">
            <Link href="/dashboard" className="block">
              <span className="text-4xl font-bold text-blue-400">
                StudyBuddy
              </span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <ProfileMenu 
              userName="John Doe"
              userEmail="john@example.com"
            />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <LibrarySidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 pl-24">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}