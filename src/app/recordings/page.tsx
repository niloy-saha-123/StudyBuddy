'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical, Plus, Check } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppState } from '@/context/AppStateContext'
import type { RecordingWithMeta } from '@/components/recording/types'

export default function RecordingsPage() {
  const router = useRouter()
  const [recordings, setRecordings] = useState<RecordingWithMeta[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null)
  const [isRenaming, setIsRenaming] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [showClassroomModal, setShowClassroomModal] = useState(false)
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null)
  const [showCreateClassroom, setShowCreateClassroom] = useState(false)
  const [newClassroomName, setNewClassroomName] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  const { 
    recordings: contextRecordings,
    classrooms,
    addRecordingToClassroom,
    addRecordingToFavourites,
    moveRecordingToTrash,
    updateRecordingTitle,
    setClassrooms
  } = useAppState()

  // Initialize recordings with sorted data
  useEffect(() => {
    const sortedRecordings = [...contextRecordings].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setRecordings(sortedRecordings)
  }, [contextRecordings])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  const handleRename = (recording: RecordingWithMeta) => {
    setIsRenaming(recording.id)
    setNewTitle(recording.title || '')
    setIsMenuOpen(null)
  }

  const saveRename = (id: string) => {
    if (!newTitle.trim()) return
    updateRecordingTitle(id, newTitle.trim())
    setIsRenaming(null)
    setNewTitle('')
  }

  const handleAddToClassroom = (recording: RecordingWithMeta) => {
    setSelectedRecording(recording.id)
    setShowClassroomModal(true)
    setIsMenuOpen(null)
  }

  const handleCreateClassroom = () => {
    if (!newClassroomName.trim() || !selectedRecording) return

    const colors = ['blue', 'purple', 'green', 'pink'] as const
    const newClassroom = {
      id: Date.now().toString(),
      name: newClassroomName.trim(),
      lectureCount: 0,
      lastActive: 'Just created',
      color: colors[classrooms.length % colors.length],
      isFavourite: false,
      type: 'classroom' as const
    }

    setClassrooms([...classrooms, newClassroom])
    addRecordingToClassroom(selectedRecording, newClassroom.id)
    setNewClassroomName('')
    setShowCreateClassroom(false)
    setShowClassroomModal(false)
    setSelectedRecording(null)
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Recordings</h1>
        
        {recordings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No recordings yet</p>
            <p className="text-gray-400 mt-2">Start recording to see your recordings here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recordings.map((recording) => (
              <div 
                key={recording.id} 
                className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-grow cursor-pointer"
                    onClick={() => router.push(`/recordings/${recording.id}`)}
                  >
                    {isRenaming === recording.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          className="flex-grow px-3 py-1 border border-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            saveRename(recording.id)
                          }}
                          className="px-3 py-1 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setIsRenaming(null)
                          }}
                          className="px-3 py-1 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {recording.title || `Recording from ${formatDate(recording.createdAt)}`}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Recorded on {formatDate(recording.createdAt)}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsMenuOpen(isMenuOpen === recording.id ? null : recording.id)
                      }}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {isMenuOpen === recording.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleRename(recording)
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addRecordingToFavourites(recording)
                              setIsMenuOpen(null)
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Add to Favorites
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleAddToClassroom(recording)
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Add to Classroom
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              moveRecordingToTrash(recording)
                              setIsMenuOpen(null)
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Move to Trash
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Classroom Modal */}
        {showClassroomModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add to Classroom</h2>
              <div className="space-y-4">
                {classrooms.map((classroom) => (
                  <button
                    key={classroom.id}
                    onClick={() => {
                      addRecordingToClassroom(selectedRecording!, classroom.id)
                      setShowClassroomModal(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                  >
                    <Check className="w-4 h-4 text-green-500" />
                    {classroom.name}
                  </button>
                ))}
                <button
                  onClick={() => setShowCreateClassroom(true)}
                  className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Create New Classroom
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Classroom Modal */}
        {showCreateClassroom && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Classroom</h2>
              <input
                type="text"
                placeholder="Classroom Name"
                value={newClassroomName}
                onChange={(e) => setNewClassroomName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowCreateClassroom(false)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClassroom}
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}