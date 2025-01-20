'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { 
  TrashIcon, 
  PlayCircleIcon, 
  PauseCircleIcon, 
  FileTextIcon, 
  ClipboardListIcon, 
  LoaderIcon 
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

export default function RecordingsPage() {
  const [recordings, setRecordings] = useState<Recording[]>([])
  const [selectedRecording, setSelectedRecording] = useState<Recording | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioPlayer, setAudioPlayer] = useState<HTMLAudioElement | null>(null)
  const [expandedTranscription, setExpandedTranscription] = useState<string | null>(null)
  const [expandedSummary, setExpandedSummary] = useState<string | null>(null)

  // Load recordings from local storage on component mount
  useEffect(() => {
    const storedRecordings = localStorage.getItem('voiceRecordings')
    if (storedRecordings) {
      const parsedRecordings: Recording[] = JSON.parse(storedRecordings).map((rec: Recording) => ({
        ...rec,
        createdAt: new Date(rec.createdAt),
        audioBlob: typeof rec.audioBlob === 'string' ? rec.audioBlob : ''
      }))
      setRecordings(parsedRecordings)
    }
  }, [])

  // Transcribe audio functionality
  const transcribeAudio = async (recording: Recording) => {
    try {
      // Update the recording state to show transcription in progress
      setRecordings(prev =>
        prev.map(rec =>
          rec.id === recording.id
            ? { ...rec, isTranscribing: true, error: undefined }
            : rec
        )
      );

      // Fetch blob from URL
      const response = await fetch(recording.audioUrl);
      const audioBlob = await response.blob();

      // Prepare form data
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.wav');

      // Send transcription request
      const transcribeResponse = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      if (!transcribeResponse.ok) {
        throw new Error(`Transcription failed: ${transcribeResponse.statusText}`);
      }

      const data = await transcribeResponse.json();

      // Update recordings with transcription
      const updatedRecordings = recordings.map(rec => 
        rec.id === recording.id 
          ? { 
              ...rec, 
              transcription: data.transcription,
              isTranscribing: false,
              audioUrl: data.fileUrl
            }
          : rec
      );

      // Update state and local storage
      setRecordings(updatedRecordings);
      localStorage.setItem('voiceRecordings', JSON.stringify(updatedRecordings));
    } catch (err) {
      // Handle transcription error
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
      alert(err instanceof Error ? err.message : 'Transcription failed');
    }
  }

  // Summarization functionality
  const summarizeTranscription = async (recording: Recording) => {
    if (!recording.transcription) {
      alert('Please transcribe the recording first');
      return;
    }
  
    try {
      // Update the recording state to show summarization in progress
      setRecordings(prev =>
        prev.map(rec =>
          rec.id === recording.id
            ? { ...rec, isSummarizing: true, error: undefined }
            : rec
        )
      );
  
      // Send summarization request
      // Inside summarizeTranscription function
// Inside summarizeTranscription function
const response = await fetch('/api/summarise', {  // Note: no /route at the end
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    transcription: recording.transcription
  }),
});

      // Check content type and parse response
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error('Server returned non-JSON response');
      }
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Summarization failed');
      }
  
      // Update recordings with summary
      const updatedRecordings = recordings.map(rec => 
        rec.id === recording.id 
          ? { 
              ...rec, 
              summary: data.summary,
              isSummarizing: false,
              error: undefined
            }
          : rec
      );
  
      // Update state and local storage
      setRecordings(updatedRecordings);
      localStorage.setItem('voiceRecordings', JSON.stringify(updatedRecordings));
      
    } catch (err) {
      // Handle summarization error
      const errorMessage = err instanceof Error ? err.message : 'Summarization failed';
      
      setRecordings(prev =>
        prev.map(rec =>
          rec.id === recording.id
            ? {
                ...rec,
                isSummarizing: false,
                error: errorMessage,
                summary: undefined
              }
            : rec
        )
      );
      
      // Update localStorage to reflect the error state
      localStorage.setItem('voiceRecordings', JSON.stringify(recordings));
      
      // Display error to user
      alert(errorMessage);
    }
}
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
                className="bg-white border border-gray-200 rounded-lg p-4 flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-4">
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

                  {/* Action Buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Transcribe Button */}
                    <button
                      onClick={() => transcribeAudio(recording)}
                      disabled={recording.isTranscribing}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        recording.isTranscribing
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      {recording.isTranscribing ? 'Transcribing...' : 'Transcribe'}
                    </button>

                    {/* Summarize Button */}
                    {recording.transcription && (
                      <button
                        onClick={() => summarizeTranscription(recording)}
                        disabled={recording.isSummarizing}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                          recording.isSummarizing
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                        }`}
                      >
                        {recording.isSummarizing ? 'Summarizing...' : 'Summarize'}
                      </button>
                    )}

                    {/* Delete Button */}
                    <button 
                      onClick={() => deleteRecording(recording.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Transcription Display */}
                {recording.transcription && (
                  <div className="mt-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-800">Transcription</h4>
                      <FileTextIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-gray-700 text-sm">
                      {recording.transcription.length > 200 ? (
                        <>
                          {expandedTranscription === recording.id 
                            ? recording.transcription
                            : `${recording.transcription.slice(0, 200)}...`}
                          <button 
                            onClick={() => setExpandedTranscription(
                              expandedTranscription === recording.id ? null : recording.id
                            )}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            {expandedTranscription === recording.id ? 'Show less' : 'Show more'}
                          </button>
                        </>
                      ) : (
                        recording.transcription
                      )}
                    </p>
                  </div>
                )}

                {/* Summary Display */}
                {recording.summary && (
                  <div className="mt-2 bg-green-50 p-3 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-green-800">Summary</h4>
                      <ClipboardListIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-gray-700 text-sm">
                      {recording.summary.length > 200 ? (
                        <>
                          {expandedSummary === recording.id 
                            ? recording.summary
                            : `${recording.summary.slice(0, 200)}...`}
                          <button 
                            onClick={() => setExpandedSummary(
                              expandedSummary === recording.id ? null : recording.id
                            )}
                            className="ml-2 text-green-500 hover:text-green-700"
                          >
                            {expandedSummary === recording.id ? 'Show less' : 'Show more'}
                          </button>
                        </>
                      ) : (
                        recording.summary
                      )}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}