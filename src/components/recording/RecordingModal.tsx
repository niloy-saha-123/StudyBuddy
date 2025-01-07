'use client'

import { useState, useRef, useEffect } from 'react'

interface RecordingModalProps {
  isOpen: boolean
  onClose: () => void
}

type RecordingStatus = 'idle' | 'recording' | 'paused'
type DialogType = 'none' | 'save' | 'close' | 'discard'

export default function RecordingModal({ isOpen, onClose }: RecordingModalProps) {
  // States
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle')
  const [duration, setDuration] = useState(0)
  const [currentDialog, setCurrentDialog] = useState<DialogType>('none')
  const [filename, setFilename] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  
  // Refs
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Handle modal close attempt
  const handleClose = () => {
    if (recordingStatus === 'recording') {
      pauseRecording()
    }
    if (recordingStatus !== 'idle') {
      setCurrentDialog('close')
    } else {
      onClose()
    }
  }

  // Handle stop button click
  const handleStop = () => {
    if (recordingStatus === 'recording') {
      pauseRecording()
    }
    setCurrentDialog('save')
  }

  // Handle save confirmation
  const handleSave = async () => {
    if (!filename.trim()) return
    
    setIsSaving(true)
    try {
      // Add .mp3 extension if not present
      const finalFilename = filename.toLowerCase().endsWith('.mp3') 
        ? filename 
        : `${filename}.mp3`
      
      // Simulate saving
      await new Promise(resolve => setTimeout(resolve, 1000))
      // Reset everything after saving
      stopRecording()
      setCurrentDialog('none')
      setFilename('')
      setIsSaving(false)
    } catch (error) {
      console.error('Error saving recording:', error)
      setIsSaving(false)
      alert('Failed to save recording')
    }
  }

  // Handle save and exit
  const handleSaveAndExit = async () => {
    if (!filename.trim()) return
    
    setIsSaving(true)
    try {
      const finalFilename = filename.toLowerCase().endsWith('.mp3') 
        ? filename 
        : `${filename}.mp3`
        
      await new Promise(resolve => setTimeout(resolve, 1000)) 
      stopRecording()
      setIsSaving(false)
      onClose()
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

  // Handle confirmed discard
  const handleConfirmDiscard = () => {
    stopRecording()
    setCurrentDialog('none')
    onClose()
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setRecordingStatus('recording')
      
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('Could not access microphone')
    }
  }

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

  const resumeRecording = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = true
      })
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)
      setRecordingStatus('recording')
    }
  }

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
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
              <span className={isSaving ? 'text-white' : ''}>
                {isSaving ? 'Saving...' : 'Save'}
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
              onClick={() => {
                setCurrentDialog('save')
                setFilename('')
              }}
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

      {/* Discard Confirmation Dialog */}
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
      <div className="bg-white rounded-lg p-6 w-96 animate-in zoom-in-95 duration-200">
        {/* Header with close button */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-semibold text-gray-800">
              {recordingStatus === 'recording' ? 'Recording in Progress' : 
               recordingStatus === 'paused' ? 'Recording Paused' : 
               'Voice Recording'}
            </h2>
            {recordingStatus === 'recording' && (
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
            )}
          </div>
          <button 
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="text-center">
          <div className={`text-4xl font-mono mb-4 transition-colors ${
            recordingStatus === 'recording' ? 'text-blue-600' : 'text-gray-800'
          }`}>
            {formatTime(duration)}
          </div>
          <div className="text-gray-500 mb-6">
            {recordingStatus === 'recording' ? 'Recording...' : 
             recordingStatus === 'paused' ? 'Paused' : 
             'Ready to record'}
          </div>

          {/* Controls */}
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
                {/* Pause/Resume Button */}
                <button
                  onClick={recordingStatus === 'recording' ? pauseRecording : resumeRecording}
                  className="flex-1 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {recordingStatus === 'recording' ? 'Pause' : 'Resume'}
                </button>

                {/* Stop/Save Button - changes based on status */}
                <button
                  onClick={handleStop}
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