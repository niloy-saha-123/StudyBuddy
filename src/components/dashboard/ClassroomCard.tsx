'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MoreVertical } from 'lucide-react'
import type { Classroom } from '@/components/recording/types'

interface ClassroomCardProps extends Classroom {
  onRename: () => void
  onToggleFavourite: () => void
  onDelete: () => void
  isInTrash?: boolean
  onRestore?: () => void
  onPermanentDelete?: () => void
}

export default function ClassroomCard({
  id,
  name,
  lectureCount,
  lastActive,
  color = 'blue',
  isFavourite = false,
  isInTrash = false,
  deletedAt,
  onRename,
  onDelete,
  onRestore,
  onToggleFavourite,
  onPermanentDelete
}: ClassroomCardProps) {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showPermanentDeleteConfirm, setShowPermanentDeleteConfirm] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const formatLastActive = (dateStr: string) => {
    try {
      const now = new Date()
      const date = new Date(dateStr)
      
      // Get time differences
      const diffInMs = now.getTime() - date.getTime()
      const diffInMins = Math.floor(diffInMs / (1000 * 60))
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))
      
      // Less than 1 minute
      if (diffInMins < 1) {
        return 'Just now'
      }
      
      // 1-59 minutes
      if (diffInMins < 60) {
        return `${diffInMins} ${diffInMins === 1 ? 'minute' : 'minutes'} ago`
      }
      
      // 1-23 hours
      if (diffInHours < 24) {
        return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`
      }
      
      // Days
      return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`
    } catch (error) {
      return 'Recently'
    }
  }

  const colorVariants = {
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    green: 'from-emerald-400 to-emerald-600',
    pink: 'from-pink-400 to-pink-600'
  }

  return (
    <>
      <div className="relative bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group">
        <div className="flex items-start justify-between">
          <div 
            className="flex-1 cursor-pointer"
            onClick={() => {
              if (!isInTrash) {
                router.push(`/classroom/${id}`)
              }
            }}
          >
            {/* Icon */}
            <div className={`w-10 h-12 relative rounded-lg bg-gradient-to-br ${colorVariants[color]} shadow-lg mb-3`}>
              <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-evenly">
                <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
                <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
                <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
              </div>
              <div className="absolute right-2 top-2 bottom-2 w-6">
                <div className="h-full flex flex-col justify-evenly">
                  <div className="w-full h-[1px] bg-white opacity-40"></div>
                  <div className="w-full h-[1px] bg-white opacity-40"></div>
                  <div className="w-full h-[1px] bg-white opacity-40"></div>
                  <div className="w-full h-[1px] bg-white opacity-40"></div>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-blue-500 transition-colors">
              {name}
            </h3>
            <p className="text-sm text-gray-500">
              {lectureCount} {lectureCount === 1 ? 'Lecture' : 'Lectures'}
            </p>
            <p className="text-sm text-gray-500">
              Last Active: {formatLastActive(lastActive)}
            </p>
          </div>

          {!isInTrash && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setIsMenuOpen(!isMenuOpen)
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onRename()
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Rename</span>
                    </button>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleFavourite()
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left flex items-center gap-2"
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill={isFavourite ? "currentColor" : "none"} 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                      {isFavourite ? 'Remove from Favourites' : 'Add to Favourites'}
                    </button>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowDeleteConfirm(true)
                        setIsMenuOpen(false)
                      }}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left flex items-center gap-2 border-t border-gray-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {isInTrash && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-2">
              <button
                onClick={onRestore}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Restore
              </button>
              <button
                onClick={() => setShowPermanentDeleteConfirm(true)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 w-[400px] animate-in slide-in-from-bottom-4 duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Move to Trash</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to move &quot;{name}&quot; to trash? Items in trash will be automatically deleted after 30 days.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete()
                  setShowDeleteConfirm(false)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Move to Trash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Permanent Delete Confirmation Modal */}
      {showPermanentDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
          <div className="bg-white rounded-lg p-6 w-[400px] animate-in slide-in-from-bottom-4 duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Delete Permanently</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to permanently delete &quot;{name}&quot;? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPermanentDeleteConfirm(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onPermanentDelete?.()
                  setShowPermanentDeleteConfirm(false)
                }}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}