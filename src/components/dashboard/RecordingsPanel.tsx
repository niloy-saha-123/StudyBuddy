'use client'

import { useState } from 'react'

export default function RecordingsPanel() {
  const [isPanelOpen, setIsPanelOpen] = useState(false)

  return (
    <div className="fixed top-0 left-0 h-full w-full pointer-events-none">
      {/* Toggle button - needs pointer events */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed top-4 left-4 z-30 pointer-events-auto bg-white rounded-full 
                 p-3 shadow-lg hover:bg-gray-50 transition-all duration-300"
      >
        <svg
          className={`w-6 h-6 text-gray-700 transition-transform duration-300 
                     ${isPanelOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Backdrop overlay */}
      {isPanelOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 pointer-events-auto"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Panel itself */}
      <div
        className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-lg z-40 
                   pointer-events-auto transform transition-transform duration-300 
                   ease-in-out ${isPanelOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recordings</h2>
          {/* Rest of the recordings panel content */}
        </div>
      </div>
    </div>
  )
}