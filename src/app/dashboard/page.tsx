'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ClassroomCard from '@/components/dashboard/ClassroomCard'
import RecordingOptions from '@/components/recording/RecordingOptions'
import { useAppState } from '@/context/AppStateContext'
import type { DialogType } from '@/components/recording/types'

export default function DashboardPage() {
  // Get state and functions from context
  const { 
    classrooms, 
    setClassrooms,
    addToFavourites, 
    removeFromFavourites, 
    moveToTrash,
    updateClassroomName 
  } = useAppState()

  // Local state for dialogs and form
  const [currentDialog, setCurrentDialog] = useState<DialogType>('none')
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null)
  const [newClassroomName, setNewClassroomName] = useState('')

  // Handle classroom creation
  const handleCreateClassroom = () => {
    if (!newClassroomName.trim()) return

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
    setNewClassroomName('')
    setCurrentDialog('none')
  }

  // Handle renaming a classroom
  const handleRename = () => {
    if (!newClassroomName.trim() || !selectedClassroom) return

    updateClassroomName(selectedClassroom, newClassroomName.trim())
    setNewClassroomName('')
    setSelectedClassroom(null)
    setCurrentDialog('none')
  }

  return (
    <DashboardLayout>
      <div>
        <RecordingOptions />

        <div className="mb-8">
          {/* Classroom Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Your Classrooms</h2>
            <button 
              onClick={() => {
                setNewClassroomName('')
                setCurrentDialog('create')
              }}
              className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New
            </button>
          </div>

          {/* Classroom Grid/Empty State */}
          {classrooms.length === 0 ? (
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Classrooms Yet</h3>
              <p className="text-gray-500">Create your first classroom to get started</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {classrooms.map((classroom) => (
                <ClassroomCard
                  key={classroom.id}
                  {...classroom}
                  onRename={() => {
                    setSelectedClassroom(classroom.id)
                    setNewClassroomName(classroom.name)
                    setCurrentDialog('rename')
                  }}
                  onToggleFavourite={() => 
                    classroom.isFavourite 
                      ? removeFromFavourites(classroom.id)
                      : addToFavourites(classroom)
                  }
                  onDelete={() => moveToTrash(classroom)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dialog Overlays */}
      {(currentDialog === 'create' || currentDialog === 'rename') && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 w-[400px] animate-in slide-in-from-bottom-4 duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {currentDialog === 'create' ? 'Create New Classroom' : 'Rename Classroom'}
            </h3>
            <input
              type="text"
              value={newClassroomName}
              onChange={(e) => setNewClassroomName(e.target.value)}
              placeholder="Enter classroom name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder-gray-400"
              autoFocus
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setCurrentDialog('none')
                  setNewClassroomName('')
                  setSelectedClassroom(null)
                }}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={currentDialog === 'create' ? handleCreateClassroom : handleRename}
                disabled={!newClassroomName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentDialog === 'create' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}