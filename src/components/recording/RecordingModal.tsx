'use client'

import { useState, useRef, useEffect } from 'react'
import { type ModalType, type RecordingStatus, type DialogType } from './types'
import UploadRecording from './UploadRecording'

interface RecordingModalProps {
  isOpen: boolean
  onClose: () => void
  modalType: ModalType
}

export default function RecordingModal({ isOpen, onClose, modalType }: RecordingModalProps) {
  // Core states for recording functionality
  const [recordingStatus, setRecordingStatus] = useState<RecordingStatus>('idle')
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isLightColor, setIsLightColor] = useState(false)
  const [currentDialog, setCurrentDialog] = useState<DialogType>('none')
  const [filename, setFilename] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  
  // Refs for managing audio stream and timers
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<{
    timer: ReturnType<typeof setInterval> | null;
    color: ReturnType<typeof setInterval> | null;
  } | null>(null)

  // Timer management functions
  const startTimer = () => {
    const startTime = Date.now() - elapsedTime
    const timer = setInterval(() => {
      setElapsedTime(Date.now() - startTime)
    }, 10)

    const colorInterval = setInterval(() => {
      setIsLightColor(prev => !prev)
    }, 1500)

    timerRef.current = { timer, color: colorInterval }
  }

  const stopTimer = () => {
    if (timerRef.current?.timer) {
      clearInterval(timerRef.current.timer)
    }
    if (timerRef.current?.color) {
      clearInterval(timerRef.current.color)
    }
    timerRef.current = null
  }

  // Recording control functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      setRecordingStatus('recording')
      startTimer()
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
      stopTimer()
      setRecordingStatus('paused')
    }
  }

  const resumeRecording = () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = true
      })
      startTimer()
      setRecordingStatus('recording')
    }
  }

  const stopRecording = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    stopTimer()
    setElapsedTime(0)
    setRecordingStatus('idle')
  }

  // Dialog management functions
  const handleClose = () => {
    if (recordingStatus === 'recording') {
      pauseRecording()
    }
    if (recordingStatus !== 'idle') {
      setIsExiting(true)
      setCurrentDialog('close')
    } else {
      onClose()
    }
  }

  const initiateSave = (isExiting: boolean) => {
    if (recordingStatus === 'recording') {
      pauseRecording()
    }
    setIsExiting(isExiting)
    setCurrentDialog('save')
    setFilename('')
  }

  const handleSave = async () => {
    if (!filename.trim()) return
    
    setIsSaving(true)
    try {
      const finalFilename = filename.toLowerCase().endsWith('.mp3') 
        ? filename 
        : `${filename}.mp3`
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      stopRecording()
      setCurrentDialog('none')
      setFilename('')
      setIsSaving(false)
      
      if (isExiting) {
        onClose()
      }
    } catch (error) {
      console.error('Error saving recording:', error)
      setIsSaving(false)
      alert('Failed to save recording')
    }
  }

  const handleDiscard = () => {
    setCurrentDialog('discard')
  }

  const handleConfirmDiscard = () => {
    stopRecording()
    setCurrentDialog('none')
    onClose()
  }

  // Time formatting helper
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000)
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    const ms = Math.floor((milliseconds % 1000) / 10)
    return (
      <>
        {mins > 0 && `${mins}:`}
        {secs.toString().padStart(2, '0')}
        <span className="text-3xl">:{ms.toString().padStart(2, '0')}</span>
      </>
    )
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer()
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  if (!isOpen) return null

  // Render the recording interface or upload interface based on modalType
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
      {modalType === 'upload' ? (
        <UploadRecording onClose={onClose} />
      ) : (
        // Main recording modal content (implementation continued...)
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
                  className={`text-5xl font-mono transition-all duration-[4000ms] ease-in-out ${
                    recordingStatus === 'recording' 
                      ? isLightColor ? 'text-[#d9e6fe]' : 'text-[#3473ef]'
                      : 'text-gray-400'
                  }`}
                >
                  {formatTime(elapsedTime)}
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
      )}

      {/* Save Dialog */}
      {currentDialog === 'save' && (
        <div className="absolute bg-white rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),0_-4px_12px_-2px_rgba(0,0,0,0.08)] z-[10000] w-96 animate-in slide-in-from-top-4 duration-200">
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
        <div className="absolute bg-white rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),0_-4px_12px_-2px_rgba(0,0,0,0.08)] z-[10000] w-96 animate-in zoom-in-95 duration-200">
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
        <div className="absolute bg-white rounded-lg p-6 shadow-[0_4px_12px_-2px_rgba(0,0,0,0.08),0_-4px_12px_-2px_rgba(0,0,0,0.08)] z-[10000] w-96 animate-in zoom-in-95 duration-200">
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
    </div>
  )
}