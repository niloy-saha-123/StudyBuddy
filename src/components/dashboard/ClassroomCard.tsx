'use client'

import { useState, useRef, useEffect } from 'react'

interface ClassroomCardProps {
  name: string
  lectureCount: number
  lastActive: string
  color?: 'blue' | 'purple' | 'green' | 'pink'
  onRename?: () => void
  onDelete?: () => void
}

export default function ClassroomCard({ 
  name, 
  lectureCount, 
  lastActive, 
  color = 'blue',
  onRename,
  onDelete 
}: ClassroomCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

  const colorVariants = {
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    green: 'from-emerald-400 to-emerald-600',
    pink: 'from-pink-400 to-pink-600'
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          {/* Notebook Icon */}
          <div className={`w-12 h-14 relative rounded-lg bg-gradient-to-br ${colorVariants[color]} shadow-lg`}>
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

          {/* Menu Button and Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors relative z-[70]"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-[70] overflow-hidden">
                <div className="py-1">
                  {onRename && (
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false)
                        onRename()
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      <span>Rename</span>
                    </button>
                  )}

                  <button 
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span>Add Recording</span>
                  </button>

                  <button 
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <span>Archive</span>
                  </button>

                  {onDelete && (
                    <button 
                      onClick={() => {
                        setIsMenuOpen(false)
                        onDelete()
                      }}
                      className="w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 border-t border-gray-200"
                    >
                      <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Card Info */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
        <div className="text-sm text-gray-500 space-y-1">
          <p>{lectureCount} Lectures</p>
          <p>Last Active: {lastActive}</p>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  )
}