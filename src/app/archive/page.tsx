'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Classroom } from '@/components/recording/types'


export default function ArchivePage() {
  const [archivedClassrooms, setArchivedClassrooms] = useState<Classroom[]>([])

  // Calculate remaining days for an archived classroom
  const getRemainingDays = (archiveDate: string) => {
    const archived = new Date(archiveDate)
    const now = new Date()
    const thirtyDaysFromArchive = new Date(archived.getTime() + 30 * 24 * 60 * 60 * 1000)
    const remainingTime = thirtyDaysFromArchive.getTime() - now.getTime()
    return Math.ceil(remainingTime / (1000 * 60 * 60 * 24))
  }

  // Format archive date for display
  const formatArchiveDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <Link 
                href="/dashboard"
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Archived Classrooms</h1>
            <div className="w-20">{/* Spacer for alignment */}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {archivedClassrooms.length === 0 ? (
          <div className="text-center py-12">
            <svg 
              className="w-16 h-16 mx-auto text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Archived Classrooms</h3>
            <p className="text-gray-500">Archived classrooms will appear here</p>
          </div>
        ) : (
          <div className="space-y-6">
            {archivedClassrooms.map((classroom) => (
              <div 
                key={classroom.id}
                className="bg-white shadow rounded-lg overflow-hidden"
              >
                <div className="px-6 py-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{classroom.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {classroom.lectureCount} Lectures • Archived on {formatArchiveDate(classroom.archiveDate!)}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Days Remaining Badge */}
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                        {getRemainingDays(classroom.archiveDate!)} days remaining
                      </span>
                      {/* Restore Button */}
                      <button
                        onClick={() => {
                          // Handle restore logic
                        }}
                        className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Restore
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}