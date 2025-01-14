'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  PlayCircleIcon, 
  PauseCircleIcon, 
  FileTextIcon, 
  ClipboardListIcon,
  ChevronLeftIcon
} from 'lucide-react'

type Recording = {
  id: string;
  audioBlob: Blob | string;
  audioUrl: string;
  transcription: string | null;
  createdAt: Date;
  title?: string;
  isTranscribing?: boolean;
  isSummarizing?: boolean;
  summary?: string;
  error?: string;
};

export default function RecordingPage() {
  const params = useParams()
  const router = useRouter()
  const [recording, setRecording] = useState<Recording | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null)
  const [expandedTranscription, setExpandedTranscription] = useState(false)
  const [expandedSummary, setExpandedSummary] = useState(false)

  // Load specific recording from local storage
  useEffect(() => {
    const storedRecordings = localStorage.getItem('voiceRecordings')
    if (storedRecordings) {
      const parsedRecordings: Recording[] = JSON.parse(storedRecordings).map((rec: Recording) => ({
        ...rec,
        createdAt: new Date(rec.createdAt),
        audioBlob: typeof rec.audioBlob === 'string' ? rec.audioBlob : ''
      }))
      const currentRecording = parsedRecordings.find(rec => rec.id === params.id)
      if (currentRecording) {
        setRecording(currentRecording)
      }
    }
  }, [params.id])

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioPlayer) {
        audioPlayer.pause()
      }
    }
  }, [audioPlayer])

  // Transcribe audio functionality
  const transcribeAudio = async (recording: Recording) => {
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
      alert(err instanceof Error ? err.message : 'Transcription failed')
    }
  }

  // Summarization functionality
  const summarizeTranscription = async (recording: Recording) => {
    if (!recording.transcription) {
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

      const contentType = response.headers.get("content-type")
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Server returned non-JSON response')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Summarization failed')
      }

      const updatedRecording = {
        ...recording,
        summary: data.summary,
        isSummarizing: false,
        error: undefined
      }

      setRecording(updatedRecording)
      updateLocalStorage(updatedRecording)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Summarization failed'
      
      setRecording(prev => prev ? {
        ...prev,
        isSummarizing: false,
        error: errorMessage,
        summary: undefined
      } : null)

      alert(errorMessage)
    }
  }

  // Update local storage helper
  const updateLocalStorage = (updatedRecording: Recording) => {
    const storedRecordings = localStorage.getItem('voiceRecordings')
    if (storedRecordings) {
      const recordings: Recording[] = JSON.parse(storedRecordings)
      const updatedRecordings = recordings.map(rec => 
        rec.id === updatedRecording.id ? updatedRecording : rec
      )
      localStorage.setItem('voiceRecordings', JSON.stringify(updatedRecordings))
    }
  }

  // Play/Pause functionality
  const toggleAudio = () => {
    if (!recording) return

    if (audioPlayer) {
      if (isPlaying) {
        audioPlayer.pause()
        setIsPlaying(false)
      } else {
        audioPlayer.play()
        setIsPlaying(true)
      }
    } else {
      const audio = new Audio(recording.audioUrl)
      audio.onended = () => {
        setIsPlaying(false)
        setAudioPlayer(null)
      }
      audio.play()
      setAudioPlayer(audio)
      setIsPlaying(true)
    }
  }

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
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeftIcon className="w-5 h-5 mr-1" />
          Back to Recordings
        </button>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {recording.title || `Recording from ${formatDate(recording.createdAt)}`}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Recorded on {formatDate(recording.createdAt)}
              </p>
            </div>

            {/* Audio Controls */}
            <div className="flex items-center gap-4">
              <button 
                onClick={toggleAudio}
                className="text-blue-500 hover:text-blue-600"
              >
                {isPlaying ? (
                  <PauseCircleIcon className="w-12 h-12" />
                ) : (
                  <PlayCircleIcon className="w-12 h-12" />
                )}
              </button>
            </div>
          </div>

          {/* Processing Buttons */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => transcribeAudio(recording)}
              disabled={recording.isTranscribing}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                recording.isTranscribing
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <FileTextIcon className="w-5 h-5" />
              {recording.isTranscribing ? 'Transcribing...' : 'Transcribe'}
            </button>

            {recording.transcription && (
              <button
                onClick={() => summarizeTranscription(recording)}
                disabled={recording.isSummarizing}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  recording.isSummarizing
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <ClipboardListIcon className="w-5 h-5" />
                {recording.isSummarizing ? 'Summarizing...' : 'Summarize'}
              </button>
            )}
          </div>

          {/* Content Sections */}
          <div className="space-y-6">
            {/* Transcription Section */}
            {recording.transcription && (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FileTextIcon className="w-5 h-5" />
                    Transcription
                  </h2>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
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
                    <ClipboardListIcon className="w-5 h-5" />
                    Summary
                  </h2>
                </div>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {recording.summary.length > 300 && !expandedSummary
                      ? `${recording.summary.slice(0, 300)}...`
                      : recording.summary}
                  </p>
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
      </div>
    </DashboardLayout>
  )
}