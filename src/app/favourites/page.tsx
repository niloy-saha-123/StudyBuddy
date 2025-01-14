'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppState } from '@/context/AppStateContext'
import type { DialogType, TrashableItem } from '@/components/recording/types'

export default function FavouritesPage() {
  const router = useRouter()
  const { favourites, removeFromFavourites, moveToTrash, updateClassroomName } = useAppState()

  // Local state for rename dialog
  const [currentDialog, setCurrentDialog] = useState<DialogType>('none')
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [newName, setNewName] = useState('')

  // Format date helper
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  return (
    <DashboardLayout>
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          Favourites
        </h1>

        {favourites.length === 0 ? (
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
              No Favourites
            </h3>
            <p className="text-gray-500">
              Add items to favourites to see them here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {favourites.map((item) => {
              if (item.type === 'classroom') {
                return (
                  <div key={item.id} 
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/classroom/${item.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-800">{item.name}</span>
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded-full">
                            Classroom
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          {item.lectureCount} Lectures • Last Active: {item.lastActive}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromFavourites(item.id)
                          }}
                          className="text-blue-500 hover:text-blue-600 p-2"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              } else {
                // Recording item
                return (
                  <div key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => router.push(`/recordings/${item.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-semibold text-gray-800">
                            {item.title || `Recording from ${formatDate(item.createdAt)}`}
                          </span>
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-600 rounded-full">
                            Recording
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">
                          Recorded on {formatDate(item.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            removeFromFavourites(item.id)
                          }}
                          className="text-blue-500 hover:text-blue-600 p-2"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}