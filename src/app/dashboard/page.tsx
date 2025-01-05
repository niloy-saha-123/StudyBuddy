'use client'

import { useState } from 'react'
import Link from 'next/link'
import RecordingsPanel from '@/components/dashboard/RecordingsPanel'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center h-20 px-4">
          <div className="flex-grow pl-14">
            <Link href="/dashboard" className="block">
              <span className="text-4xl font-bold text-blue-400">
                StudyBuddy
              </span>
            </Link>
          </div>

          {/* Profile Menu */}
          <button className="bg-gradient-to-r from-blue-400 to-blue-600 w-10 h-10 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Main content goes here */}
      </main>

      <RecordingsPanel />
    </div>
  )
}