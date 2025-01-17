'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppState } from '@/context/AppStateContext'
import { Check, Plus } from 'lucide-react'
import type { Classroom, RecordingWithMeta } from '@/components/recording/types'
import GlobalLayout from '@/components/layout/GlobalLayout';

export default function ClassroomPage() {
  // Navigation hooks for routing and params
  const params = useParams()
  const router = useRouter()
  
  // Get necessary functions and state from global context
  const { 
    classrooms, 
    recordings, 
    addRecordingToClassroom 
  } = useAppState()
  
  // Local state management
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [classroomRecordings, setClassroomRecordings] = useState<RecordingWithMeta[]>([])
  const [isSelectingRecording, setIsSelectingRecording] = useState(false)

  // Initialize classroom and its recordings
  useEffect(() => {
    const currentClassroom = classrooms.find(c => c.id === params.id)
    if (currentClassroom) {
      setClassroom(currentClassroom)
      // Get recordings for this classroom and sort by newest first
      const classroomRecs = recordings
        .filter(rec => rec.classroomId === currentClassroom.id)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      setClassroomRecordings(classroomRecs)
    }
  }, [params.id, classrooms, recordings])

  // Get available recordings (not in this classroom)
  const availableRecordings = recordings
    .filter(rec => !classroomRecordings.some(cr => cr.id === rec.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  // Handler for adding recording to classroom
  const handleAddRecording = (recordingId: string) => {
    if (classroom) {
      addRecordingToClassroom(recordingId, classroom.id)
      setIsSelectingRecording(false)
    }
  }

  // Date formatter for consistent date display
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date))
  }

  // Loading/Error state
  if (!classroom) {
    return (
      <GlobalLayout>
      <DashboardLayout>
        <div className="flex items-center justify-center">
          <p className="text-gray-500">Classroom not found</p>
        </div>
      </DashboardLayout>
      </GlobalLayout>
    )
  }

  return (
    <GlobalLayout>
    <DashboardLayout>
      <div>
        {/* Classroom Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{classroom.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {classroom.lectureCount} Lectures • Last Active: {classroom.lastActive}
          </p>
        </div>

        <div className="space-y-6">
          {/* Add Recording Button */}
          <div className="flex justify-end">
            <button 
              onClick={() => setIsSelectingRecording(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Recording
            </button>
          </div>

          {/* Recordings List */}
          <div className="bg-white rounded-lg shadow">
            {classroomRecordings.length === 0 ? (
              // Empty state when no recordings
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
              // List of recordings
              <div className="divide-y divide-gray-200">
                {classroomRecordings.map((recording) => (
                  <div 
                    key={recording.id} 
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/recordings/${recording.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">
                          {recording.title || `Recording from ${formatDate(recording.createdAt)}`}
                        </h4>
                        <p className="text-sm text-gray-500">
                          Recorded on {formatDate(recording.createdAt)}
                        </p>
                        {recording.transcription && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                            Transcribed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recording Selection Modal */}
      {isSelectingRecording && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add Recording</h3>
              <button 
                onClick={() => setIsSelectingRecording(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            {availableRecordings.length === 0 ? (
              // Empty state when no recordings available
              <div className="text-center py-8">
                <p className="text-gray-500">No recordings available to add</p>
                <button
                  onClick={() => router.push('/recordings')}
                  className="mt-4 text-blue-500 hover:text-blue-600"
                >
                  Create a new recording
                </button>
              </div>
            ) : (
              // List of available recordings to add
              <div className="space-y-2">
                {availableRecordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {recording.title || `Recording from ${formatDate(recording.createdAt)}`}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Recorded on {formatDate(recording.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => handleAddRecording(recording.id)}
                      className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </DashboardLayout>
    </GlobalLayout>
  )
}