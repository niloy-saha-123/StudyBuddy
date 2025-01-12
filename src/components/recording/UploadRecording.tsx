'use client'

import { useState, useRef, useCallback } from 'react'
import { Recording, UploadStatus } from './types'

interface UploadRecordingProps {
  onClose: () => void
}

export default function UploadRecording({ onClose }: UploadRecordingProps) {
  // States for handling drag and drop
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [transcription, setTranscription] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle')

  // Ref for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Supported file types
  const supportedTypes = ['audio/mp3', 'audio/mpeg', 'audio/wav']

  // Handle file validation
  const validateFile = (file: File) => {
    if (!supportedTypes.includes(file.type)) {
      setError('Please upload an audio file (MP3 or WAV)')
      return false
    }
    
    // 50MB size limit
    if (file.size > 50 * 1024 * 1024) {
      setError('File size should be less than 50MB')
      return false
    }

    return true
  }

  // Handle file selection
  const handleFile = (file: File) => {
    setError(null)
    setTranscription(null)
    
    if (validateFile(file)) {
      setFile(file)
      // Create URL for audio preview
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl)
      }
      const newAudioUrl = URL.createObjectURL(file)
      setAudioUrl(newAudioUrl)
    }
  }

  // Handle transcription
  const handleTranscribe = async () => {
    if (!file) return;
    
    try {
      setUploadStatus('transcribing');
      setError(null);

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();
      setTranscription(data.transcription);
      setUploadStatus('success');
    } catch (error) {
      console.error('Transcription error:', error);
      setError(error instanceof Error ? error.message : 'Failed to transcribe audio');
      setUploadStatus('error');
    }
  };

  // Save recording to localStorage
  const saveRecordingToLocalStorage = useCallback(() => {
    if (!file || !audioUrl) return;

    try {
      // Create the recording object
      const newRecording: Recording = {
        id: crypto.randomUUID(),
        audioBlob: file,
        audioUrl: URL.createObjectURL(file),
        transcription: transcription,
        createdAt: new Date(),
        title: file.name || `Uploaded Recording ${new Date().toLocaleString()}`
      };

      // Get existing recordings
      const savedRecordings = JSON.parse(localStorage.getItem('voiceRecordings') || '[]');
      
      // Add new recording
      const updatedRecordings = [...savedRecordings, newRecording];
      
      // Save back to localStorage
      localStorage.setItem('voiceRecordings', JSON.stringify(updatedRecordings));

      alert('Recording saved successfully!');
      onClose();
    } catch (err) {
      console.error('Error saving recording:', err);
      setError('Failed to save recording');
    }
  }, [file, audioUrl, transcription, onClose]);

  // Handle drag events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true)
    } else if (e.type === 'dragleave') {
      setIsDragging(false)
    }
  }

  // Handle drop event
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }

  // Handle file input change
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFile(e.target.files[0])
    }
  }

  // Handle click on drop zone
  const handleDropZoneClick = () => {
    fileInputRef.current?.click()
  }

  // Cleanup on unmount
  const handleClose = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl)
    }
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999] animate-in fade-in duration-200">
      <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Upload Recording
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

        {/* Drop Zone */}
        <div 
          onClick={handleDropZoneClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`w-full h-48 border-2 border-dashed rounded-lg
            flex flex-col items-center justify-center gap-2 cursor-pointer
            transition-colors mb-4
            ${isDragging 
              ? 'border-blue-500 bg-blue-50' 
              : file 
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-blue-500 hover:bg-gray-50'
            }`}
        >
          {file ? (
            <>
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-sm text-gray-600">{file.name}</p>
            </>
          ) : (
            <>
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600">
                Drag & drop your audio file here or <span className="text-blue-500">browse</span>
              </p>
              <p className="text-xs text-gray-500">Supports MP3, WAV (up to 50MB)</p>
            </>
          )}
        </div>

        {/* Audio Preview */}
        {audioUrl && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Preview</h3>
            <audio 
              controls 
              src={audioUrl}
              className="w-full"
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500 mb-4">{error}</p>
        )}

        {/* Transcription Result */}
        {transcription && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Transcription</h3>
            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
              {transcription}
            </p>
          </div>
        )}

        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept="audio/*"
          className="hidden"
        />

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          {file && !transcription && (
            <button
              onClick={handleTranscribe}
              disabled={uploadStatus === 'transcribing'}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadStatus === 'transcribing' ? 'Transcribing...' : 'Transcribe'}
            </button>
          )}
          {file && (
            <button
              onClick={saveRecordingToLocalStorage}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              Save Recording
            </button>
          )}
        </div>
      </div>
    </div>
  )
}