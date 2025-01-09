'use client'

import { useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import ClassroomCard from '@/components/dashboard/ClassroomCard'
import ProfileMenu from '@/components/dashboard/ProfileMenu'

// Dynamic imports
const LibrarySidebar = dynamic(
  () => import('@/components/dashboard/LibrarySidebar'),
  { ssr: false }
)

const RecordingOptions = dynamic(
  () => import('@/components/recording/RecordingOptions'),
  { ssr: false }
)

// Define the structure for classroom data
interface Classroom {
  id: string          // Unique identifier for each classroom
  name: string        // Name of the classroom
  lectureCount: number // Number of lectures in the classroom
  lastActive: string  // Last activity timestamp/text
  color: 'blue' | 'purple' | 'green' | 'pink' // Color theme of the classroom card
}

// Type for dialog states
type DialogType = 'none' | 'create' | 'rename' | 'delete'

export default function DashboardPage() {
  // State management
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [currentDialog, setCurrentDialog] = useState<DialogType>('none')
  const [newClassroomName, setNewClassroomName] = useState('')
  const [selectedClassroom, setSelectedClassroom] = useState<Classroom | null>(null)

  // Define available colors for classroom cards
  const colors = ['blue', 'purple', 'green', 'pink'] as const

  // Get the next color in rotation based on current number of classrooms
  const getNextColor = () => {
    return colors[classrooms.length % colors.length]
  }

  // Handle classroom creation
  const handleCreateClassroom = () => {
    if (!newClassroomName.trim()) return

    const newClassroom: Classroom = {
      id: Date.now().toString(),
      name: newClassroomName.trim(),
      lectureCount: 0,
      lastActive: 'Just created',
      color: getNextColor()
    }

    setClassrooms(prev => [...prev, newClassroom])
    setNewClassroomName('')
    setCurrentDialog('none')
  }

  // Handle classroom rename
  const handleRenameClassroom = () => {
    if (!selectedClassroom || !newClassroomName.trim()) return

    setClassrooms(prev => prev.map(classroom => 
      classroom.id === selectedClassroom.id 
        ? { ...classroom, name: newClassroomName.trim() }
        : classroom
    ))
    setNewClassroomName('')
    setSelectedClassroom(null)
    setCurrentDialog('none')
  }

  // Handle classroom deletion
  const handleDeleteClassroom = () => {
    if (!selectedClassroom) return

    setClassrooms(prev => prev.filter(classroom => classroom.id !== selectedClassroom.id))
    setSelectedClassroom(null)
    setCurrentDialog('none')
  }

  // Handler for opening the rename dialog
  const openRenameDialog = (classroom: Classroom) => {
    setSelectedClassroom(classroom)
    setNewClassroomName(classroom.name)
    setCurrentDialog('rename')
  }

  // Handler for opening the delete dialog
  const openDeleteDialog = (classroom: Classroom) => {
    setSelectedClassroom(classroom)
    setCurrentDialog('delete')
  }

  // Close any open dialog
  const closeDialog = () => {
    setCurrentDialog('none')
    setNewClassroomName('')
    setSelectedClassroom(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center h-20 px-4">
          <div className="flex-grow pl-14">
            <Link href="/dashboard" className="block">
              <span className="text-4xl font-bold text-blue-400">
                StudyBuddy
              </span>
            </Link>
          </div>

          <ProfileMenu 
            userName="Mohd Faraz" // Replace with actual user name
            userEmail="farazkabbo@example.com" // Replace with actual email
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <RecordingOptions />

        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Your Classrooms</h2>
            <button 
              onClick={() => setCurrentDialog('create')}
              className="flex items-center gap-2 px-4 py-2 text-blue-400 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New
            </button>
          </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {classrooms.map((classroom) => (
                <ClassroomCard
                  key={classroom.id}
                  name={classroom.name}
                  lectureCount={classroom.lectureCount}
                  lastActive={classroom.lastActive}
                  color={classroom.color}
                  onRename={() => openRenameDialog(classroom)}
                  onDelete={() => openDeleteDialog(classroom)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Dialogs */}
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
                onClick={closeDialog}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={currentDialog === 'create' ? handleCreateClassroom : handleRenameClassroom}
                disabled={!newClassroomName.trim()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentDialog === 'create' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {currentDialog === 'delete' && selectedClassroom && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 w-[400px] animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Classroom</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{selectedClassroom.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={closeDialog}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClassroom}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <LibrarySidebar />
    </div>
  )
}