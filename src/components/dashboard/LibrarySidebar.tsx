'use client'

import { useState } from 'react'
import Link from 'next/link'

type TabType = 'recordings' | 'favorites' | 'archived'

export default function LibrarySidebar() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<TabType>('recordings')

  return (
    <div>
      {/* Hamburger Menu Button - Fixed on main page */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed top-[20px] left-6 z-50 p-2.5 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <svg 
          className="w-5 h-5 text-blue-500" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 6h16M4 12h16M4 18h16" 
          />
        </svg>
      </button>

      {/* Overlay when sidebar is open */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/30 transition-opacity z-40"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <div 
        className={`fixed top-0 left-0 w-80 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Library</h2>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('recordings')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'recordings'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              Recordings
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'favorites'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              Favorites
            </button>
            <button
              onClick={() => setActiveTab('archived')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'archived'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-600 border-transparent hover:text-gray-800 hover:border-gray-300'
              }`}
            >
              Archived
            </button>
          </div>

          {/* Search and Filters */}
          <div className="p-4 space-y-4 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Search recordings..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
              <svg
                className="absolute left-3 top-2.5 w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex justify-between items-center">
              <select className="pl-3 pr-8 py-1.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Latest First</option>
                <option>Oldest First</option>
                <option>A-Z</option>
              </select>
              <button className="text-sm text-blue-600 font-medium hover:text-blue-700">
                Filter
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'recordings' && (
              <div className="space-y-3">
                {/* Recording Item */}
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-sm font-medium text-gray-800">Recording Title</h3>
                      <p className="text-xs text-gray-500 mt-0.5">2 minutes • Just now</p>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>

                  <div className="mb-3">
                    <audio 
                      controls 
                      className="w-full h-8"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                      Transcribe
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty State for Favorites/Archived */}
            {(activeTab === 'favorites' || activeTab === 'archived') && (
              <div className="text-center py-12">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {activeTab === 'favorites' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    )}
                  </svg>
                </div>
                <p className="text-sm text-gray-500">
                  {activeTab === 'favorites' 
                    ? 'No favorite recordings yet' 
                    : 'No archived recordings'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}