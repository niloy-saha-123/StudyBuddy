'use client'

import { useState } from 'react'
import Link from 'next/link'
import RecordingsPanel from '@/components/dashboard/RecordingsPanel'
import ClassroomCard from '@/components/dashboard/ClassroomCard'
import RecordingOptions from '@/components/recording/RecordingOptions'


export default function DashboardPage() {
  // Sample classroom data
  const classrooms = [
    { name: 'Physics 101', lectureCount: 12, lastActive: '2h ago', color: 'blue' },
    { name: 'Calculus', lectureCount: 8, lastActive: '1d ago', color: 'purple' },
    { name: 'Chemistry', lectureCount: 15, lastActive: '3h ago', color: 'green' },
    { name: 'Biology', lectureCount: 10, lastActive: '5h ago', color: 'pink' }
  ] as const

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
        {/* Classrooms Section */}

        <RecordingOptions />

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Your Classrooms</h2>
            <button className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New
            </button>
          </div>

          {/* Classrooms Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {classrooms.map((classroom) => (
              <ClassroomCard
                key={classroom.name}
                name={classroom.name}
                lectureCount={classroom.lectureCount}
                lastActive={classroom.lastActive}
                color={classroom.color}
              />
            ))}
          </div>
        </div>
      </main>

      <RecordingsPanel />
    </div>
  )
}