'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppState } from '@/context/AppStateContext'
import type { Classroom } from '@/components/recording/types'

export default function ClassroomPage() {
  const params = useParams()
  const { classrooms } = useAppState()
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [isAddingRecording, setIsAddingRecording] = useState(false)

  useEffect(() => {
    const currentClassroom = classrooms.find(c => c.id === params.id)
    if (currentClassroom) {
      setClassroom(currentClassroom)
    }
  }, [params.id, classrooms])

  if (!classroom) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center">
          <p className="text-gray-500">Classroom not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div>
        {/* Classroom Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{classroom.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {classroom.lectureCount} Lectures • Last Active: {classroom.lastActive}
          </p>
        </div>

        <div className="space-y-6">
          {/* Action Buttons */}
          <div className="flex justify-end">
            <button 
              onClick={() => setIsAddingRecording(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Recording
            </button>
          </div>

          {/* Recordings List */}
          <div className="bg-white rounded-lg shadow">
            {classroom.lectureCount === 0 ? (
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
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recordings Yet</h3>
                <p className="text-gray-500">Add recordings to this classroom to get started</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                <p className="p-4 text-gray-500 text-center">Recordings will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Recording Modal */}
      {isAddingRecording && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 w-[600px] animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add Recording</h3>
              <button 
                onClick={() => setIsAddingRecording(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="text-center py-8 text-gray-500">
              Recording selection will be implemented later
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsAddingRecording(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Add Selected
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}