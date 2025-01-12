'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAppState } from '@/context/AppStateContext'
import { TrashIcon, PlayCircleIcon, PauseCircleIcon, FileTextIcon } from 'lucide-react'

// Define the Recording type to match the previous implementation
type Recording = {
  id: string;
  audioBlob: Blob;
  audioUrl: string;
  transcription: string | null;
  createdAt: Date;
  title?: string;
};

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null)

  // Load recordings from local storage on component mount
  useEffect(() => {
    const storedRecordings = localStorage.getItem('voiceRecordings')
    if (storedRecordings) {
      const parsedRecordings: Recording[] = JSON.parse(storedRecordings).map((rec: Recording) => ({
        ...rec,
        createdAt: new Date(rec.createdAt)
      }))
      setRecordings(parsedRecordings)
    }
  }, [])

  // Play/Pause audio functionality
  const toggleAudio = (recording: Recording) => {
    if (audioPlayer) {
      audioPlayer.pause()
      setIsPlaying(false)
    }

    if (selectedRecording?.id !== recording.id) {
      const audio = new Audio(recording.audioUrl)
      audio.onended = () => {
        setIsPlaying(false)
        setSelectedRecording(null)
      }
      audio.play()
      setAudioPlayer(audio)
      setSelectedRecording(recording)
      setIsPlaying(true)
    } else {
      setSelectedRecording(null)
    }
  }

  // Delete a recording
  const deleteRecording = (id: string) => {
    const updatedRecordings = recordings.filter(rec => rec.id !== id)
    setRecordings(updatedRecordings)
    localStorage.setItem('voiceRecordings', JSON.stringify(updatedRecordings))
    
    // If the deleted recording was playing, stop the audio
    if (selectedRecording?.id === id) {
      audioPlayer?.pause()
      setSelectedRecording(null)
      setIsPlaying(false)
    }
  }

  // Edit recording title
  const editRecordingTitle = (id: string, newTitle: string) => {
    const updatedRecordings = recordings.map(rec => 
      rec.id === id ? { ...rec, title: newTitle } : rec
    )
    setRecordings(updatedRecordings)
    localStorage.setItem('voiceRecordings', JSON.stringify(updatedRecordings))
  }

  // Formatting date helper
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">My Recordings</h1>
        
        {recordings.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No recordings yet</p>
            <p className="text-gray-400 mt-2">Start recording to see your recordings here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {recordings.map((recording) => (
              <div 
                key={recording.id} 
                className="bg-white border border-gray-200 rounded-lg p-4 flex items-center space-x-4 hover:shadow-sm transition-all"
              >
                {/* Audio Controls */}
                <button 
                  onClick={() => toggleAudio(recording)}
                  className="text-blue-500 hover:text-blue-600"
                >
                  {selectedRecording?.id === recording.id && isPlaying ? (
                    <PauseCircleIcon className="w-10 h-10" />
                  ) : (
                    <PlayCircleIcon className="w-10 h-10" />
                  )}
                </button>

                {/* Recording Details */}
                <div className="flex-grow">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {recording.title || `Recording from ${formatDate(recording.createdAt)}`}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-500">
                    Recorded on {formatDate(recording.createdAt)}
                  </p>
                </div>

                {/* Transcription */}
                {recording.transcription && (
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FileTextIcon className="w-5 h-5" />
                    <span className="text-sm">Transcribed</span>
                  </div>
                )}

                {/* Delete Button */}
                <button 
                  onClick={() => deleteRecording(recording.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}