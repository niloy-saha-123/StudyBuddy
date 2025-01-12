'use client'

import Link from 'next/link'
import LibrarySidebar from '@/components/dashboard/LibrarySidebar'
import { useAppState } from '@/context/AppStateContext'

export default function TrashPage() {
  const { trashedItems, restoreFromTrash, deletePermanently } = useAppState()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center h-20 px-4">
          <div className="flex-grow pl-14">
            <Link href="/dashboard" className="block">
              <span className="text-4xl font-bold text-blue-400">
                StudyBuddy
              </span>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <LibrarySidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 pl-24">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-semibold text-gray-800 mb-6">Trash</h1>

            {trashedItems.length === 0 ? (
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
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Trash is Empty</h3>
                <p className="text-gray-500">Items in trash will be automatically deleted after 30 days</p>
              </div>
            ) : (
              <div className="space-y-4">
                {trashedItems.map((item) => (
                  <div 
                    key={item.id} 
                    className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6"
                  >
                    <div className="flex items-center justify-between">
                      {/* Left side with icon and info */}
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 shadow-sm flex items-center justify-center`}>
                          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                          </svg>
                        </div>
                        
                        {/* Info */}
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>{item.lectureCount} Lectures</span>
                              <span>•</span>
                              <span>Last Active: {item.lastActive}</span>
                            </div>
                            {/* Days remaining info moved here and styled */}
                            {item.deletedAt && (
                              <span className="text-sm text-gray-500">
                                {Math.ceil((new Date(item.deletedAt).getTime() + (30 * 24 * 60 * 60 * 1000) - new Date().getTime()) / (1000 * 60 * 60 * 24))} days until permanent deletion
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right side with actions */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => restoreFromTrash(item.id)}
                          className="px-6 py-2.5 text-[15px] font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Restore
                        </button>
                        <button
                          onClick={() => deletePermanently(item.id)}
                          className="px-6 py-2.5 text-[15px] font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Delete Permanently
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}