'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import ReactMarkdown from 'react-markdown'
import { 
  PlayCircle,
  PauseCircle,
  FileText, 
  ClipboardList,
  ChevronLeft,
  Volume2,
  AlertTriangle,
  Plus,
  Check
} from 'lucide-react'
import type { RecordingWithMeta } from '@/components/recording/types'
import { useAppState } from '@/context/AppStateContext'

export default function RecordingPage() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const { classrooms, addRecordingToClassroom } = useAppState()
  
  // Core states
  const [isMounted, setIsMounted] = useState(false)
  const [recording, setRecording] = useState<RecordingWithMeta | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [expandedTranscription, setExpandedTranscription] = useState(false)
  const [expandedSummary, setExpandedSummary] = useState(false)
  const [isAddingToClassroom, setIsAddingToClassroom] = useState(false)
  const [addedClassroomIds, setAddedClassroomIds] = useState<Set<string>>(new Set())
  const [showCreateClassroom, setShowCreateClassroom] = useState(false)
  const [newClassroomName, setNewClassroomName] = useState('')
  const [transcribingRecordingId, setTranscribingRecordingId] = useState<string | null>(null)
  const [transcriptionError, setTranscriptionError] = useState<string | null>(null)
  
  // Audio refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)

  // Initialize mounting state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load recording from localStorage
  useEffect(() => {
    if (isMounted) {
      const storedRecordings = localStorage.getItem('voiceRecordings')
      if (storedRecordings) {
        const parsedRecordings: RecordingWithMeta[] = JSON.parse(storedRecordings).map((rec: RecordingWithMeta) => ({
          ...rec,
          createdAt: new Date(rec.createdAt),
          audioBlob: typeof rec.audioBlob === 'string' ? rec.audioBlob : ''
        }))
        const currentRecording = parsedRecordings.find(rec => rec.id === params.id)
        if (currentRecording) {
          setRecording(currentRecording)
          // Initialize audio element
          const audio = new Audio(currentRecording.audioUrl)
          audio.volume = volume
          audioRef.current = audio
          
          // Set up audio event listeners
          audio.addEventListener('loadedmetadata', () => {
            setDuration(audio.duration)
          })
          
          audio.addEventListener('timeupdate', () => {
            setCurrentTime(audio.currentTime)
          })
          
          audio.addEventListener('ended', () => {
            setIsPlaying(false)
            setCurrentTime(0)
          })

          // Initialize added classrooms
          const recordingClassrooms = classrooms
            .filter(c => c.recordings?.includes(currentRecording.id))
            .map(c => c.id)
          setAddedClassroomIds(new Set(recordingClassrooms))
        }
      }
    }
  }, [params.id, isMounted, volume, classrooms])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener('loadedmetadata', () => {})
        audioRef.current.removeEventListener('timeupdate', () => {})
        audioRef.current.removeEventListener('ended', () => {})
      }
    }
  }, [])

  const handleAddToClassroom = (classroomId: string) => {
    if (recording && !addedClassroomIds.has(classroomId)) {
      addRecordingToClassroom(recording.id, classroomId)
      setAddedClassroomIds(prev => new Set([...prev, classroomId]))
    }
  }

  const handleCreateClassroom = () => {
    if (!newClassroomName.trim() || !recording) return

    const colors = ['blue', 'purple', 'green', 'pink'] as const
    const newClassroom = {
      id: Date.now().toString(),
      name: newClassroomName.trim(),
      lectureCount: 0,
      lastActive: new Date().toISOString(),
      color: colors[classrooms.length % colors.length],
      isFavourite: false,
      type: 'classroom' as const
    }

    addRecordingToClassroom(recording.id, newClassroom.id)
    setAddedClassroomIds(prev => new Set([...prev, newClassroom.id]))
    setNewClassroomName('')
    setShowCreateClassroom(false)
    setIsAddingToClassroom(false)
  }

  const handleTranscribe = async () => {
    if (!recording) return
  
    const supportedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav']
  
    try {
      setTranscribingRecordingId(recording.id)
      setTranscriptionError(null)
  
      if (!recording.audioUrl) {
        throw new Error('No audio file available')
      }
  
      const response = await fetch(recording.audioUrl)
      const blob = await response.blob()
  
      if (!supportedTypes.includes(blob.type)) {
        throw new Error('Unsupported audio file type')
      }
  
      const audioFile = new File([blob], 'recording.wav', { type: blob.type })
  
      if (audioFile.size > 50 * 1024 * 1024) {
        throw new Error('File size exceeds 50MB limit')
      }
  
      const formData = new FormData()
      formData.append('file', audioFile)
  
      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData
      })
  
      if (!transcribeResponse.ok) {
        const errorData = await transcribeResponse.json()
        throw new Error(errorData.error || 'Transcription failed')
      }
  
      const data = await transcribeResponse.json()
  
      const updatedRecording = {
        ...recording,
        transcription: data.transcription,
        isTranscribing: false,
        error: undefined
      }
  
      setRecording(updatedRecording)
      updateLocalStorage(updatedRecording)
  
    } catch (err: any) {
      console.error('Transcription Error:', {
        message: err.message,
        name: err.name,
        stack: err.stack
      })
  
      const errorMessage = err.message || 'Unable to transcribe audio'
      setTranscriptionError(errorMessage)
      setRecording(prev => prev ? {
        ...prev,
        error: errorMessage
      } : null)
  
    } finally {
      setTranscribingRecordingId(null)
    }
  }

  const getBackButtonText = () => {
    if (from?.startsWith('/classroom/')) {
      const classroomId = from.split('/')[2]
      const classroom = classrooms.find(c => c.id === classroomId)
      return `Back to ${classroom?.name || 'Classroom'}`
    }

    switch(from) {
      case '/favourites':
        return 'Back to Favourites'
      case '/dashboard':
        return 'Back to Dashboard'
      default:
        return 'Back to Recordings'
    }
  }

  // Transcribe functionality
  const transcribeAudio = async () => {
    if (!recording) return

    try {
      setRecording(prev => prev ? {
        ...prev,
        isTranscribing: true,
        error: undefined
      } : null)

      const response = await fetch(recording.audioUrl)
      const audioBlob = await response.blob()
      const formData = new FormData()
      formData.append('file', audioBlob, 'recording.wav')

      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      })

      if (!transcribeResponse.ok) {
        throw new Error(`Transcription failed: ${transcribeResponse.statusText}`)
      }

      const data = await transcribeResponse.json()
      
      if (!data.success) {
        throw new Error(data.message || 'No speech detected in the recording')
      }

      const updatedRecording = {
        ...recording,
        transcription: data.transcription,
        isTranscribing: false,
        audioUrl: data.fileUrl
      }

      setRecording(updatedRecording)
      updateLocalStorage(updatedRecording)
    } catch (err) {
      setRecording(prev => prev ? {
        ...prev,
        isTranscribing: false,
        error: err instanceof Error ? err.message : 'Transcription failed'
      } : null)
      console.error('Transcription error:', err)
    }
  }

  // Summarize functionality
  const summarizeTranscription = async () => {
    if (!recording?.transcription) {
      alert('Please transcribe the recording first')
      return
    }

    try {
      setRecording(prev => prev ? {
        ...prev,
        isSummarizing: true,
        error: undefined
      } : null)

      const response = await fetch('/api/summarise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcription: recording.transcription
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate summary')
      }

      const data = await response.json()

      const updatedRecording = {
        ...recording,
        summary: data.summary,
        isSummarizing: false,
        error: undefined
      }

      setRecording(updatedRecording)
      updateLocalStorage(updatedRecording)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate summary'
      setRecording(prev => prev ? {
        ...prev,
        isSummarizing: false,
        error: errorMessage,
        summary: undefined
      } : null)
    }
  }

  // Audio control functions
  const togglePlayPause = () => {
    if (!audioRef.current) return

    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audioRef.current || !progressBarRef.current) return

    const bounds = progressBarRef.current.getBoundingClientRect()
    const x = e.clientX - bounds.left
    const percentage = x / bounds.width
    const newTime = percentage * duration

    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  // Helper functions
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const updateLocalStorage = (updatedRecording: RecordingWithMeta) => {
    const storedRecordings = localStorage.getItem('voiceRecordings')
    if (storedRecordings) {
      const recordings: RecordingWithMeta[] = JSON.parse(storedRecordings)
      const updatedRecordings = recordings.map(rec => 
        rec.id === updatedRecording.id ? updatedRecording : rec
      )
      localStorage.setItem('voiceRecordings', JSON.stringify(updatedRecordings))
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  if (!isMounted) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          <p className="text-gray-500">Loading...</p>
        </div>
      </DashboardLayout>
    )
  }

  if (!recording) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
          <p className="text-gray-500">Recording not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push(from || '/recordings')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          {getBackButtonText()}
        </button>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {recording.title || `Recording from ${formatDate(recording.createdAt)}`}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {recording.method === 'uploaded' ? 'Uploaded' : 'Recorded'} on {formatDate(recording.createdAt)}
              </p>
            </div>
            <button
              onClick={() => setIsAddingToClassroom(true)}
              className="flex items-center gap-2 px-4 py-2 text-blue-500 hover:bg-blue-50 rounded-lg"
            >
              <Plus className="w-5 h-5" />
              Add to Classroom
            </button>
          </div>

          {/* Audio Player */}
          <div className="mb-8 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center gap-4 mb-4">
              <button 
                onClick={togglePlayPause}
                className="text-blue-500 hover:text-blue-600"
              >
                {isPlaying ? (
                  <PauseCircle className="w-12 h-12" />
                ) : (
                  <PlayCircle className="w-12 h-12" />
                )}
              </button>

              <div className="flex-1">
                <div 
                  ref={progressBarRef}
                  onClick={handleProgressClick}
                  className="h-2 bg-gray-200 rounded-full cursor-pointer"
                >
                  <div 
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-gray-500" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-24"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-8">
            {!recording.transcription && (
              <button
                onClick={handleTranscribe}
                disabled={transcribingRecordingId === recording.id}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  transcribingRecordingId === recording.id
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                <FileText className="w-5 h-5" />
                {transcribingRecordingId === recording.id ? 'Transcribing...' : 'Transcribe'}
              </button>
            )}

            {recording.transcription && (
              <button
              onClick={summarizeTranscription}
              disabled={recording.isSummarizing}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                recording.isSummarizing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              <ClipboardList className="w-5 h-5" />
              {recording.isSummarizing ? 'Summarizing...' : 'Summarize'}
            </button>
          )}
        </div>

        {/* Error Message */}
        {recording.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-600">{recording.error}</p>
          </div>
        )}

        {/* Content Sections */}
        <div className="space-y-6">
          {/* Transcription Section */}
          {recording.transcription && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Transcription
                </h2>
              </div>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {recording.transcription.length > 300 && !expandedTranscription
                    ? `${recording.transcription.slice(0, 300)}...`
                    : recording.transcription}
                </p>
                {recording.transcription.length > 300 && (
                  <button
                    onClick={() => setExpandedTranscription(!expandedTranscription)}
                    className="text-blue-500 hover:text-blue-600 mt-4"
                  >
                    {expandedTranscription ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Summary Section */}
          {recording.summary && (
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-green-800 flex items-center gap-2">
                  <ClipboardList className="w-5 h-5" />
                  Summary
                </h2>
              </div>
              <div className="prose max-w-none">
                <ReactMarkdown 
                  className="text-gray-700 leading-relaxed"
                  components={{
                    h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-4" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-4 mb-3" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-medium mt-3 mb-2" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                    em: ({node, ...props}) => <em className="italic" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <blockquote className="border-l-4 border-green-500 pl-4 my-4 italic" {...props} />
                    ),
                    ul: ({node, ...props}) => <ul className="list-disc pl-6 my-4" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal pl-6 my-4" {...props} />,
                    li: ({node, ...props}) => <li className="my-1" {...props} />,
                    p: ({node, ...props}) => <p className="my-2" {...props} />,
                  }}
                >
                  {recording.summary.length > 300 && !expandedSummary
                    ? `${recording.summary.slice(0, 300)}...`
                    : recording.summary
                  }
                </ReactMarkdown>
                {recording.summary.length > 300 && (
                  <button
                    onClick={() => setExpandedSummary(!expandedSummary)}
                    className="text-green-500 hover:text-green-600 mt-4"
                  >
                    {expandedSummary ? 'Show less' : 'Show more'}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add to Classroom Modal */}
      {isAddingToClassroom && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Add to Classroom</h3>
              <button 
                onClick={() => setIsAddingToClassroom(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              {classrooms.map((classroom) => {
                const isAdded = addedClassroomIds.has(classroom.id)
                return (
                  <button
                    key={classroom.id}
                    onClick={() => !isAdded && handleAddToClassroom(classroom.id)}
                    disabled={isAdded}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <span className="text-gray-700">{classroom.name}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isAdded ? 'text-gray-400' : 'text-blue-500'}`}>
                      {isAdded ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add</span>
                        </>
                      )}
                    </div>
                  </button>
                )
              })}

              <button
                onClick={() => setShowCreateClassroom(true)}
                className="w-full px-4 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 rounded-lg flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Create New Classroom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Classroom Modal */}
      {showCreateClassroom && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Create New Classroom</h2>
            <input
              type="text"
              placeholder="Enter classroom name"
              value={newClassroomName}
              onChange={(e) => setNewClassroomName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 text-gray-900"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowCreateClassroom(false)
                  setNewClassroomName('')
                }}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateClassroom}
                disabled={!newClassroomName.trim()}
                className="px-4 py-2 text-sm text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </DashboardLayout>
)
}