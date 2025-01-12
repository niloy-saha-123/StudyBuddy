'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ClassroomCard from '@/components/dashboard/ClassroomCard'
import { useAppState } from '@/context/AppStateContext'
import type { DialogType } from '@/components/recording/types'

export default function FavouritesPage() {
  // Get state and functions from context
  const { 
    favourites, 
    removeFromFavourites, 
    moveToTrash,
    updateClassroomName
  } = useAppState()

  // Local state for rename dialog
  const [currentDialog, setCurrentDialog] = useState<DialogType>('none')
  const [selectedClassroom, setSelectedClassroom] = useState<string | null>(null)
  const [newClassroomName, setNewClassroomName] = useState('')

  // Handle rename
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
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Favourite Classrooms
        </h1>

        {(!favourites || favourites.length === 0) ? (
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
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Favourite Classrooms
            </h3>
            <p className="text-gray-500">
              Add classrooms to favourites to see them here
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favourites.map((classroom) => (
              <ClassroomCard
                key={classroom.id}
                {...classroom}
                isFavourite={true}
                onToggleFavourite={() => removeFromFavourites(classroom.id)}
                onDelete={() => moveToTrash(classroom)}
                onRename={() => {
                  setSelectedClassroom(classroom.id)
                  setNewClassroomName(classroom.name)
                  setCurrentDialog('rename')
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Rename Dialog */}
      {currentDialog === 'rename' && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 w-[400px] animate-in slide-in-from-bottom-4 duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Rename Classroom
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
                onClick={handleRename}
                disabled={!newClassroomName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}