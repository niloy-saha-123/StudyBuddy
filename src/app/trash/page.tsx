'use client'

import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppState } from '@/context/AppStateContext'
import { useRouter } from 'next/navigation'
import GlobalLayout from '@/components/layout/GlobalLayout';
export default function TrashPage() {
  const router = useRouter()
  const { trashedItems, restoreFromTrash, deletePermanently } = useAppState()

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
    <GlobalLayout>
    <DashboardLayout>
      <div>
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
                    {/* Icon - Different for classroom and recording */}
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${
                      item.type === 'classroom' ? 'from-blue-400 to-blue-600' : 'from-purple-400 to-purple-600'
                    } shadow-sm flex items-center justify-center`}>
                      {item.type === 'classroom' ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {item.type === 'classroom' ? item.name : (item.title || `Recording from ${formatDate(item.createdAt)}`)}
                        </h3>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.type === 'classroom' 
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-purple-100 text-purple-600'
                        }`}>
                          {item.type === 'classroom' ? 'Classroom' : 'Recording'}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        {item.type === 'classroom' ? (
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>{item.lectureCount} Lectures</span>
                            <span>•</span>
                            <span>Last Active: {item.lastActive}</span>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            Recorded on {formatDate(item.createdAt)}
                          </p>
                        )}
                        {item.deletedAt && (
                          <span className="text-sm text-red-500">
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
    </DashboardLayout>
    </GlobalLayout>
  )
}