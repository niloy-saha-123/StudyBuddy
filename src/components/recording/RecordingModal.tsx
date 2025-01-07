'use client'

import { useState, useRef, useEffect } from 'react'

interface RecordingModalProps {
  isOpen: boolean
  onClose: () => void
}

type RecordingStatus = 'idle' | 'recording' | 'paused'
type DialogType = 'none' | 'save' | 'close' | 'discard'

export default function RecordingModal({ isOpen, onClose }: RecordingModalProps) {
  // Core states for recording
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle')
  const [duration, setDuration] = useState(0)
  const [isLightColor, setIsLightColor] = useState(false)
  const [currentDialog, setCurrentDialog] = useState<DialogType>('none')
  const [filename, setFilename] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isExiting, setIsExiting] = useState(false) // Track if save was triggered from exit
  
  // Refs for audio handling
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle close button click
  const handleClose = () => {
    if (recordingStatus === 'recording') {
      pauseRecording()
    }
    if (recordingStatus !== 'idle') {
      setIsExiting(true) // Mark that we're in exit flow
      setCurrentDialog('close')
    } else {
      onClose()
    }
  }

  // Initialize save dialog (either for normal save or exit)
  const initiateSave = (isExiting: boolean) => {
    if (recordingStatus === 'recording') {
      pauseRecording() // Pause recording first if it's still recording
    }
    setIsExiting(isExiting)
    setCurrentDialog('save')
    setFilename('')
  }

  // Handle save button click from normal flow
  const handleSave = async () => {
    if (!filename.trim()) return
    
    setIsSaving(true)
    try {
      const finalFilename = filename.toLowerCase().endsWith('.mp3') 
        ? filename 
        : `${filename}.mp3`
      
      // Simulate save - replace with actual save logic
      await new Promise(resolve => setTimeout(resolve, 1000))
      stopRecording()
      setCurrentDialog('none')
      setFilename('')
      setIsSaving(false)
      
      // Close modal if this was triggered from exit flow
      if (isExiting) {
        onClose()
      }
    } catch (error) {
      console.error('Error saving recording:', error)
      setIsSaving(false)
      alert('Failed to save recording')
    }
  }

  // Handle discard confirmation
  const handleDiscard = () => {
    setCurrentDialog('discard')
  }

  // Confirm discard and close
  const handleConfirmDiscard = () => {
    stopRecording()
    setCurrentDialog('none')
    onClose()
  }

  // Start new recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setRecordingStatus('recording')
      
      // Start timer and color toggle
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
        setIsLightColor(prev => !prev) // Toggle timer color
      }, 2500) // Slower color toggle
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone')
    }
  }

  // Pause current recording
  const pauseRecording = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = false
      })
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
      setRecordingStatus('paused')
    }
  }

  // Resume paused recording
  const resumeRecording = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = true
      })
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
        setIsLightColor(prev => !prev) // Toggle timer color
      }, 1000)
      setRecordingStatus('recording')
    }
  }

  // Stop recording and cleanup
  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setDuration(0)
    setRecordingStatus('idle')
  }

  // Format duration display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
      {/* Save Dialog */}
      {currentDialog === 'save' && (
        <div className="absolute bg-white rounded-lg p-6 shadow-xl z-[10000] w-96 animate-in slide-in-from-top-4 duration-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Save Recording</h3>
          <div className="relative">
            <input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter file name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12 text-gray-800 placeholder-gray-400"
            />
            <span className="absolute right-3 top-2.5 text-gray-500">.mp3</span>
          </div>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setCurrentDialog('none')}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!filename.trim() || isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="text-white">
                {isSaving ? 'Saving...' : (isExiting ? 'Save & Exit' : 'Save')}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Close Dialog */}
      {currentDialog === 'close' && (
        <div className="absolute bg-white rounded-lg p-6 shadow-xl z-[10000] w-96 animate-in zoom-in-95 duration-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recording in Progress</h3>
          <p className="text-gray-600 mb-6">What would you like to do?</p>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => initiateSave(true)}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Save & Exit
            </button>
            <button
              onClick={handleDiscard}
              className="w-full px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              Discard Recording
            </button>
          </div>
        </div>
      )}

      {/* Discard Dialog */}
      {currentDialog === 'discard' && (
        <div className="absolute bg-white rounded-lg p-6 shadow-xl z-[10000] w-96 animate-in zoom-in-95 duration-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Discard</h3>
          <p className="text-gray-600 mb-6">Are you sure you want to discard this recording? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setCurrentDialog('none')}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmDiscard}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Yes, Discard
            </button>
          </div>
        </div>
      )}

      {/* Main Modal */}
      <div className="bg-white rounded-lg p-6 w-96">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            {recordingStatus === 'recording' ? 'Recording in Progress' : 
             recordingStatus === 'paused' ? 'Recording Paused' : 
             'Voice Recording'}
          </h2>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Timer Display */}
        <div className="text-center">
          <div className="relative w-48 h-48 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full bg-white flex items-center justify-center">
              <span 
                className={`text-5xl font-mono transition-all duration-[3000ms] ease-in-out ${
                  recordingStatus === 'recording' 
                    ? isLightColor ? 'text-[rgba(217, 230, 254, 1)' : 'text-blue-600'
                    : 'text-gray-400'
                }`}
              >
                {formatTime(duration)}
              </span>
            </div>

            {/* Recording Animation */}
            {recordingStatus === 'recording' && (
              <div className="absolute inset-0">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 opacity-20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-blue-500 opacity-20 animate-ping"></div>
              </div>
            )}
          </div>

          {/* Status Text */}
          <div className="text-gray-500 mb-6">
            {recordingStatus === 'recording' ? 'Recording...' : 
             recordingStatus === 'paused' ? 'Paused' : 
             'Ready to record'}
          </div>

          {/* Control Buttons */}
          <div className="flex gap-4 justify-center">
            {recordingStatus === 'idle' ? (
              <button
                onClick={startRecording}
                className="w-full py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Start Recording
              </button>
            ) : (
              <>
                <button
                  onClick={recordingStatus === 'recording' ? pauseRecording : resumeRecording}
                  className="flex-1 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {recordingStatus === 'recording' ? 'Pause' : 'Resume'}
                </button>

                <button
                  onClick={() => {
                    if (recordingStatus === 'recording') {
                      pauseRecording()
                    }
                    initiateSave(false)
                  }}
                  className={`flex-1 py-3 rounded-lg text-white transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    recordingStatus === 'paused' 
                      ? 'bg-blue-500 hover:bg-blue-600' 
                      : 'bg-red-500 hover:bg-red-600'
                  }`}
                >
                  {recordingStatus === 'paused' ? 'Save' : 'Stop'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}