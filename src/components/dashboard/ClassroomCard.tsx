'use client'

interface ClassroomCardProps {
  name: string
  lectureCount: number
  lastActive: string
  color?: 'blue' | 'purple' | 'green' | 'pink'
}

export default function ClassroomCard({ name, lectureCount, lastActive, color = 'blue' }: ClassroomCardProps) {
  // Color variants
  const colorVariants = {
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    green: 'from-emerald-400 to-emerald-600',
    pink: 'from-pink-400 to-pink-600'
  }

  return (
    <div className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        {/* Notebook Icon with gradient background */}
        <div className={`w-12 h-14 relative mb-4 rounded-lg bg-gradient-to-br ${colorVariants[color]} shadow-lg`}>
          {/* Notebook spine details */}
          <div className="absolute left-2 top-0 bottom-0 flex flex-col justify-evenly">
            <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
            <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
            <div className="w-1 h-1 rounded-full bg-white opacity-60"></div>
          </div>
          {/* Notebook page lines */}
          <div className="absolute right-2 top-2 bottom-2 w-6">
            <div className="h-full flex flex-col justify-evenly">
              <div className="w-full h-[1px] bg-white opacity-40"></div>
              <div className="w-full h-[1px] bg-white opacity-40"></div>
              <div className="w-full h-[1px] bg-white opacity-40"></div>
              <div className="w-full h-[1px] bg-white opacity-40"></div>
            </div>
          </div>
        </div>

        {/* Classroom Info */}
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{name}</h3>
        <div className="text-sm text-gray-500 space-y-1">
          <p>{lectureCount} Lectures</p>
          <p>Last Active: {lastActive}</p>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/0 to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
    </div>
  )
}