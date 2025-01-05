'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Fredoka } from 'next/font/google'
import RecordingsPanel from '@/components/dashboard/RecordingsPanel'

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['600'],  // Using 600 for a bolder look
})

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="h-20 flex items-center">
            {/* Logo and brand name - Adjusted spacing */}
            <Link href="/dashboard" className="flex items-center gap-3 ml-2">  
              <div className="w-12 h-12 bg-[#00BFFF] rounded-full"></div>
              <span className={`${fredoka.className} text-[1.75rem] font-semibold
                             text-[#00BFFF]`}>
                StudyBuddy
              </span>
            </Link>

            {/* Profile Menu */}
            <div className="ml-auto mr-6">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100">
                <span className="text-gray-700">Profile Menu</span>
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Main content goes here */}
      </main>

      <RecordingsPanel />
    </div>
  )
}
