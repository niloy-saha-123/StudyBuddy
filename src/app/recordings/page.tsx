'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical, Plus, Check } from 'lucide-react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppState } from '@/context/AppStateContext'
import type { RecordingWithMeta } from '@/components/recording/types'

export default function RecordingsPage() {
  const router = useRouter()
  const { 
    recordings: contextRecordings,
    classrooms,
    addRecordingToClassroom,
    addRecordingToFavourites,
    removeRecordingFromFavourites,
    moveRecordingToTrash,
    updateRecordingTitle,
    updateRecordingTranscription,
    setClassrooms
  } = useAppState()

  const [recordings, setRecordings] = useState<RecordingWithMeta[]>([])
  const [isMenuOpen, setIsMenuOpen] = useState<string | null>(null)
  const [isRenaming, setIsRenaming] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [showClassroomModal, setShowClassroomModal] = useState(false)
  const [selectedRecording, setSelectedRecording] = useState<string | null>(null)
  const [showCreateClassroom, setShowCreateClassroom] = useState(false)
  const [newClassroomName, setNewClassroomName] = useState('')
  const [currentlyRenamingId, setCurrentlyRenamingId] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [addedToClassrooms, setAddedToClassrooms] = useState<Set<string>>(new Set())

  useEffect(() => {
    const uniqueRecordings = [...new Map(contextRecordings.map(rec => [rec.id, rec])).values()]
    const sortedRecordings = uniqueRecordings.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    setRecordings(sortedRecordings)
  }, [contextRecordings])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement
      if (!target.closest('.menu-button') && !target.closest('.menu-content')) {
        setIsMenuOpen(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatDate = (date: Date) => {
    // Convert to UTC string format to ensure consistency between server and client
    const utcDate = new Date(date);
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'UTC' // Ensure consistent timezone handling
    }).format(utcDate)
}

  const handleRename = (recording: RecordingWithMeta, e: React.MouseEvent) => {
    e.stopPropagation()
    const extension = recording.title?.split('.').pop() || 'wav'
    const nameWithoutExt = recording.title 
      ? recording.title.replace(`.${extension}`, '')
      : recording.title || ''
      
    setNewTitle(nameWithoutExt)
    setCurrentlyRenamingId(recording.id)
    setIsRenaming(recording.id)
    setIsMenuOpen(null)
  }

  const saveRename = (id: string) => {
    if (!newTitle.trim()) return
    
    const recording = recordings.find(r => r.id === id)
    const extension = recording?.title?.split('.').pop() || 'wav'
    
    const fullTitle = `${newTitle.trim()}.${extension}`
    updateRecordingTitle(id, fullTitle)
    setIsRenaming(null)
    setCurrentlyRenamingId(null)
    setNewTitle('')
  }

  const handleAddToClassroom = (recording: RecordingWithMeta, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedRecording(recording.id)
    // Get classrooms this recording is already in
    const existingClassrooms = classrooms
      .filter(classroom => classroom.recordings?.includes(recording.id))
      .map(classroom => classroom.id)
    setAddedToClassrooms(new Set(existingClassrooms))
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
      lastActive: new Date().toISOString(),
      color: colors[classrooms.length % colors.length],
      isFavourite: false,
      type: 'classroom' as const
    }

    setClassrooms([...classrooms, newClassroom])
    addRecordingToClassroom(selectedRecording, newClassroom.id)
    setAddedToClassrooms(prev => new Set([...prev, newClassroom.id]))
    setNewClassroomName('')
    setShowCreateClassroom(false)
    setShowClassroomModal(false)
    setSelectedRecording(null)
  }

  const handleDelete = (recording: RecordingWithMeta, e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(recording.id)
    setIsMenuOpen(null)
  }

  const confirmDelete = (id: string) => {
    const recording = recordings.find(r => r.id === id)
    if (recording) {
      moveRecordingToTrash(recording)
    }
    setShowDeleteConfirm(null)
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
                    <h3 className="text-lg font-semibold text-gray-800">
                      {recording.title || `Recording from ${formatDate(recording.createdAt)}`}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {recording.method === 'uploaded' ? 'Uploaded' : 'Recorded'} on {formatDate(recording.createdAt)}
                    </p>
                     
                  </div>

                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors menu-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsMenuOpen(isMenuOpen === recording.id ? null : recording.id)
                      }}
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>

                    {isMenuOpen === recording.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 menu-content">
                        <div className="py-1">
                          <button
                            onClick={(e) => handleRename(recording, e)}
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
                              recording.isFavourite 
                                ? removeRecordingFromFavourites(recording.id)
                                : addRecordingToFavourites(recording)
                              setIsMenuOpen(null)
                            }}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center gap-2"
                          >
                            <svg 
                              className="w-4 h-4" 
                              fill={recording.isFavourite ? "currentColor" : "none"} 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            {recording.isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
                          </button>
                          <button
                            onClick={(e) => handleAddToClassroom(recording, e)}
                            className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center gap-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            Add to Classroom
                          </button>
                          <button
                            onClick={(e) => handleDelete(recording, e)}
                            className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2 border-t border-gray-200"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
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

        {/* Rename Modal */}
        {isRenaming && currentlyRenamingId && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[400px]">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Rename Recording</h2>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 text-gray-900 rounded-md 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <span className="text-gray-500 text-sm">
                  {`.${recordings.find(r => r.id === currentlyRenamingId)?.title?.split('.').pop() || 'wav'}`}
                </span>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setIsRenaming(null)
                    setCurrentlyRenamingId(null)
                    setNewTitle('')
                  }}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveRename(currentlyRenamingId)}
                  disabled={!newTitle.trim()}
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 
                           disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Classroom Modal */}
        {showClassroomModal && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">Add to Classroom</h2>
                <button
                  onClick={() => {
                    setShowClassroomModal(false)
                    setSelectedRecording(null)
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                {classrooms.map((classroom) => {
                  const isAdded = addedToClassrooms.has(classroom.id)
                  return (
                    <button
                      key={classroom.id}
                      onClick={() => {
                        if (!isAdded) {
                          addRecordingToClassroom(selectedRecording!, classroom.id)
                          setAddedToClassrooms(prev => new Set([...prev, classroom.id]))
                        }
                      }}
                      disabled={isAdded}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-lg flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        <span className="text-gray-700">{classroom.name}</span>
                      </div>
                      <div className={`flex items-center gap-2 ${isAdded ? 'text-gray-400' : 'text-blue-500'}`}>
                        {isAdded ? (
                          <>
                            <Check className="w-4 h-4" />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4" />
                            <span>Add</span>
                          </>
                        )}
                      </div>
                    </button>
                  )
                })}

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
                placeholder="Enter classroom name"
                value={newClassroomName}
                onChange={(e) => setNewClassroomName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-gray-900"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowCreateClassroom(false)
                    setNewClassroomName('')
                  }}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateClassroom}
                  disabled={!newClassroomName.trim()}
                  className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-[400px]">
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Delete Recording</h2>
              <p className="text-gray-600 mb-4">Are you sure you want to delete this recording? Items in trash will be automatically deleted after 30 days.</p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(showDeleteConfirm)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}