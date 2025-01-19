'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppState } from '@/context/AppStateContext'
import { Check, Plus, ChevronLeft, Trash2 } from 'lucide-react'
import type { Classroom, RecordingWithMeta } from '@/components/recording/types'

export default function ClassroomPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  
  const { 
    classrooms, 
    recordings: allRecordings, 
    addRecordingToClassroom,
    removeRecordingFromClassroom 
  } = useAppState()
  
  const [classroom, setClassroom] = useState<Classroom | null>(null)
  const [recordings, setRecordings] = useState<RecordingWithMeta[]>([])
  const [isSelectingRecording, setIsSelectingRecording] = useState(false)
  const [addedRecordingIds, setAddedRecordingIds] = useState<Set<string>>(new Set())

  // Load classroom and its recordings
  useEffect(() => {
    const currentClassroom = classrooms.find(c => c.id === params.id)
    if (currentClassroom) {
      setClassroom(currentClassroom)
      
      // Get recordings for this classroom
      const classroomRecordings = allRecordings
        .filter(rec => currentClassroom.recordings?.includes(rec.id))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      
      setRecordings(classroomRecordings)
      setAddedRecordingIds(new Set(classroomRecordings.map(rec => rec.id)))
    }
  }, [params.id, classrooms, allRecordings])

  // Get available recordings (not already in this classroom)
  const availableRecordings = allRecordings
    .filter(rec => !addedRecordingIds.has(rec.id))
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  const handleAddRecording = (recordingId: string) => {
    if (classroom && !addedRecordingIds.has(recordingId)) {
      const recordingToAdd = allRecordings.find(r => r.id === recordingId)
      if (recordingToAdd) {
        addRecordingToClassroom(recordingId, classroom.id)
        setRecordings(prev => [recordingToAdd, ...prev])
        setAddedRecordingIds(prev => new Set([...prev, recordingId]))
      }
    }
  }

  const handleRemoveRecording = (recordingId: string) => {
    if (classroom) {
      removeRecordingFromClassroom(recordingId, classroom.id)
      setRecordings(prev => prev.filter(rec => rec.id !== recordingId))
      setAddedRecordingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(recordingId)
        return newSet
      })
    }
  }

  const formatLastActive = (dateStr: string) => {
    const now = new Date()
    const date = new Date(dateStr)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return diffInHours === 0 ? 'Just now' : `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
    }
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
  }

  const getBackButtonText = () => {
    switch(from) {
      case '/favourites':
        return 'Back to Favourites'
      default:
        return 'Back to Dashboard'
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(new Date(date))
  }

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
        {/* Back Button */}
        <button
          onClick={() => router.push(from || '/dashboard')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {getBackButtonText()}
        </button>

        {/* Classroom Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{classroom.name}</h1>
          <p className="mt-1 text-sm text-gray-500">
            {recordings.length} {recordings.length === 1 ? 'Lecture' : 'Lectures'} • Last Active: {formatLastActive(classroom.lastActive)}
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
            {recordings.length === 0 ? (
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
                <p className="text-gray-500">No recordings to add</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {recordings.map((recording) => (
                  <div 
                    key={recording.id} 
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex-1"
                        onClick={() => router.push(`/recordings/${recording.id}?from=/classroom/${classroom.id}`)}
                      >
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
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveRecording(recording.id)
                        }}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
                <div className="text-center py-8">
                  <p className="text-gray-500">No recordings to add</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {availableRecordings.map((recording) => {
                    const isAdded = addedRecordingIds.has(recording.id)
                    return (
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
                          onClick={() => !isAdded && handleAddRecording(recording.id)}
                          disabled={isAdded}
                          className={`flex items-center gap-2 px-4 py-2 text-sm rounded-lg transition-colors ${
                            isAdded 
                              ? 'bg-gray-100 text-gray-500 cursor-default'
                              : 'bg-blue-500 text-white hover:bg-blue-600'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4" />
                              Added
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Add
                            </>
                          )}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}