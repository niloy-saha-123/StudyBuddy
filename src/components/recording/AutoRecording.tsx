'use client'

import { useState, useRef, useEffect } from 'react'

// Recording states
type RecordingState = 'idle' | 'requesting' | 'recording' | 'paused' | 'stopped' | 'naming'

export default function AutoRecording() {
  // States
  const [recordingState, setRecordingState] = useState<RecordingState>('idle')
  const [duration, setDuration] = useState(0)
  const [fileName, setFileName] = useState('')

  // Refs
  const mediaRecorder = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const timerInterval = useRef<NodeJS.Timeout | null>(null)

  // Request microphone access
  const requestMicAccess = async () => {
    try {
      setRecordingState('requesting')
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorder.current = new MediaRecorder(stream)
      
      // Handle recorded data
      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data)
      }

      // When recording stops
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' })
        // Here we'll handle the recorded audio
        setRecordingState('naming')
      }

      setRecordingState('idle')
    } catch (error) {
      console.error('Error accessing microphone:', error)
      // Handle error appropriately
    }
  }

  // Start recording
  const startRecording = () => {
    if (mediaRecorder.current) {
      audioChunks.current = []
      mediaRecorder.current.start()
      setRecordingState('recording')
      
      // Start timer
      timerInterval.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } else {
      requestMicAccess()
    }
  }

  // Pause recording
  const pauseRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.pause()
      setRecordingState('paused')
      // Pause timer
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
    }
  }

  // Resume recording
  const resumeRecording = () => {
    if (mediaRecorder.current?.state === 'paused') {
      mediaRecorder.current.resume()
      setRecordingState('recording')
      // Resume timer
      timerInterval.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop()
      setRecordingState('stopped')
      // Stop timer
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
    }
  }

  // Format duration for display
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Save recording
  const saveRecording = () => {
    if (!fileName.trim()) return
    // Here we'll handle saving the recording
    // This will connect to your backend/storage
    console.log('Saving recording:', fileName)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerInterval.current) {
        clearInterval(timerInterval.current)
      }
      if (mediaRecorder.current) {
        if (mediaRecorder.current.state === 'recording') {
          mediaRecorder.current.stop()
        }
        mediaRecorder.current.stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  return (
    <div className="p-6">
      {recordingState === 'naming' ? (
        // File naming interface
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">Name your recording</h3>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="Enter file name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setRecordingState('idle')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={saveRecording}
              disabled={!fileName.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              Save Recording
            </button>
          </div>
        </div>
      ) : (
        // Recording interface
        <div className="text-center space-y-6">
          {/* Recording visualization (placeholder) */}
          <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
            {recordingState === 'recording' ? (
              <div className="flex items-center gap-1">
                <div className="w-1 h-8 bg-blue-500 animate-pulse"></div>
                <div className="w-1 h-12 bg-blue-500 animate-pulse delay-75"></div>
                <div className="w-1 h-6 bg-blue-500 animate-pulse delay-100"></div>
                <div className="w-1 h-10 bg-blue-500 animate-pulse delay-150"></div>
                <div className="w-1 h-8 bg-blue-500 animate-pulse delay-200"></div>
              </div>
            ) : (
              <span className="text-gray-400">Audio Visualization</span>
            )}
          </div>

          {/* Timer */}
          <div className="text-2xl font-mono text-gray-700">
            {formatDuration(duration)}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {recordingState === 'recording' ? (
              <>
                <button
                  onClick={pauseRecording}
                  className="p-3 bg-gray-100 rounded-full hover:bg-gray-200"
                >
                  <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={stopRecording}
                  className="p-3 bg-red-100 rounded-full hover:bg-red-200"
                >
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                </button>
              </>
            ) : recordingState === 'paused' ? (
              <>
                <button
                  onClick={resumeRecording}
                  className="p-3 bg-blue-100 rounded-full hover:bg-blue-200"
                >
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                <button
                  onClick={stopRecording}
                  className="p-3 bg-red-100 rounded-full hover:bg-red-200"
                >
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={startRecording}
                className="p-3 bg-blue-500 rounded-full hover:bg-blue-600 text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}