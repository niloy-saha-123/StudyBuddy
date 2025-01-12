'use client'

import { useState, useRef, useCallback } from 'react'
import UploadRecording from './UploadRecording'

type ModalType = 'record' | 'upload'
type RecordingStatus = 'idle' | 'recording' | 'paused'
type DialogType = 'none' | 'save' | 'close' | 'discard'

type Recording = {
  id: string;
  audioBlob: Blob;
  audioUrl: string;
  transcription: string | null;
  isTranscribing?: boolean;
  error?: string;
  createdAt: Date;
  title?: string;
};

interface RecordingModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalType: ModalType;
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
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [error, setError] = useState<string | null>(null)
  
  // Refs for managing audio stream and timers
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
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

  const startRecording = useCallback(async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorderRef.current = mediaRecorder;
      audioChunks.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setRecordings((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            audioBlob,
            audioUrl,
            transcription: null,
            createdAt: new Date(),
          },
        ]);

        // Clean up stream tracks
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setRecordingStatus('recording');
      startTimer();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      console.error('Recording error:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecordingStatus('idle');
      stopTimer();
      setElapsedTime(0);

      // Create a callback to handle saving the recording
      const saveRecording = () => {
        const newRecording = recordings[recordings.length - 1]; // Get the most recent recording
        
        if (newRecording) {
          // Prepare the recording to match the format in RecordingsPage
          const recordingToSave = {
            id: newRecording.id,
            audioBlob: newRecording.audioBlob,
            audioUrl: URL.createObjectURL(newRecording.audioBlob),
            transcription: newRecording.transcription,
            createdAt: new Date(),
            title: `Recording from ${new Date().toLocaleString()}`,
          };

          // Retrieve existing recordings from local storage
          const savedRecordings = JSON.parse(localStorage.getItem('voiceRecordings') || '[]');

          // Add the new recording to the list
          const updatedRecordings = [...savedRecordings, recordingToSave];

          // Save the updated list to local storage
          localStorage.setItem('voiceRecordings', JSON.stringify(updatedRecordings));
        }
      };

      // Use a timeout to ensure the recording is fully stopped
      setTimeout(saveRecording, 100);
    }
  }, [recordings]);

  const pauseRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      stopTimer();
      setRecordingStatus('paused');
    }
  };

  const resumeRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      startTimer();
      setRecordingStatus('recording');
    }
  };

  const transcribeAudio = useCallback(async (recording: Recording) => {
    try {
      setRecordings(prev =>
        prev.map(rec =>
          rec.id === recording.id
            ? { ...rec, isTranscribing: true, error: undefined }
            : rec
        )
      );

      const formData = new FormData();
      formData.append('file', recording.audioBlob, 'recording.wav');

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Transcription failed: ${response.statusText}`);
      }

      const data = await response.json();

      setRecordings(prev =>
        prev.map(rec =>
          rec.id === recording.id
            ? {
                ...rec,
                transcription: data.transcription,
                audioUrl: data.fileUrl,
                isTranscribing: false
              }
            : rec
        )
      );
    } catch (err) {
      setRecordings(prev =>
        prev.map(rec =>
          rec.id === recording.id
            ? {
                ...rec,
                isTranscribing: false,
                error: err instanceof Error ? err.message : 'Transcription failed'
              }
            : rec
        )
      );
      console.error('Transcription error:', err);
    }
  }, []);

  const saveRecordingToLocalStorage = useCallback((recording: Recording) => {
    try {
      // Retrieve existing recordings from local storage
      const savedRecordings = JSON.parse(localStorage.getItem('voiceRecordings') || '[]');
  
      // Prepare the recording to match the format in RecordingsPage
      const recordingToSave = {
        ...recording,
        title: recording.title || `Recording from ${new Date().toLocaleString()}`,
        audioUrl: URL.createObjectURL(recording.audioBlob)
      };
  
      // Add the new recording to the list
      const updatedRecordings = [...savedRecordings, recordingToSave];
  
      // Save the updated list to local storage
      localStorage.setItem('voiceRecordings', JSON.stringify(updatedRecordings));
  
      // Optionally, provide user feedback
      alert('Recording saved successfully!');
    } catch (error) {
      console.error('Error saving recording:', error);
      alert('Failed to save recording');
    }
  }, []);

  const deleteRecording = useCallback((id: string) => {
    setRecordings(prev => {
      const recording = prev.find(rec => rec.id === id);
      if (recording) {
        URL.revokeObjectURL(recording.audioUrl);
      }
      return prev.filter(rec => rec.id !== id);
    });
  }, []);

  // Dialog management functions
  const handleClose = () => {
    if (recordingStatus === 'recording') {
      pauseRecording();
    }
    if (recordingStatus !== 'idle') {
      setIsExiting(true);
      setCurrentDialog('close');
    } else {
      onClose();
    }
  };

  const handleDiscard = () => {
    setCurrentDialog('discard');
  };

  const handleConfirmDiscard = () => {
    stopRecording();
    setCurrentDialog('none');
    onClose();
  };

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[9999]">
      {modalType === 'upload' ? (
        <UploadRecording onClose={onClose} />
      ) : (
        <div className="bg-white rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              {recordingStatus === 'recording'
                ? 'Recording in Progress'
                : recordingStatus === 'paused'
                ? 'Recording Paused'
                : 'Voice Recording'}
            </h2>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Timer Display */}
          <div className="text-center">
            <div className="relative w-48 h-48 mx-auto mb-8">
              <div className="absolute inset-0 rounded-full bg-white flex items-center justify-center">
                <span
                  className={`text-5xl font-mono transition-all duration-[4000ms] ease-in-out ${
                    recordingStatus === 'recording'
                      ? isLightColor
                        ? 'text-[#d9e6fe]'
                        : 'text-[#3473ef]'
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

            {/* Control Buttons */}
            <div className="flex gap-4 justify-center mb-6">
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
                    onClick={
                      recordingStatus === 'recording'
                        ? pauseRecording
                        : resumeRecording
                    }
                    className="flex-1 py-3 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    {recordingStatus === 'recording' ? 'Pause' : 'Resume'}
                  </button>
                  <button
                    onClick={stopRecording}
                    className="flex-1 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
                  >
                    Stop
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Recordings List */}
          {recordings.length > 0 && (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-medium text-gray-700">Recordings</h3>
              {recordings.map((recording) => (
                <div
                  key={recording.id}
                  className="p-3 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <audio
                    controls
                    src={recording.audioUrl}
                    className="w-full mb-2"
                  />
                 <div className="flex gap-2">
  <button
    onClick={() => transcribeAudio(recording)}
    disabled={recording.isTranscribing}
    className={`flex-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
      recording.isTranscribing
        ? 'bg-gray-100 text-gray-400'
        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
    }`}
  >
    {recording.isTranscribing ? 'Transcribing...' : 'Transcribe'}
  </button>
  <button
    onClick={() => saveRecordingToLocalStorage(recording)}
    className="flex-1 px-3 py-1.5 text-sm rounded-md bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
  >
    Save
  </button>
  <button
    onClick={() => deleteRecording(recording.id)}
    className="px-3 py-1.5 text-sm rounded-md bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
  >
    Delete
  </button>
</div>
                  {recording.error && (
                    <p className="mt-2 text-sm text-red-500">{recording.error}</p>
                  )}
                  {recording.transcription && (
                    <p className="mt-2 text-sm text-gray-700 bg-white p-2 rounded border border-gray-200">
                      {recording.transcription}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Discard Dialog */}
      {currentDialog === 'discard' && (
        <div className="absolute bg-white rounded-lg p-6 shadow-lg z-[10000] w-96">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Discard Recording?
          </h3>
          <p className="text-gray-600 mb-6">
            Are you sure you want to discard this recording? This action cannot be undone.
          </p>
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
              Discard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}