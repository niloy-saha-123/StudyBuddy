import { useState, useRef, useCallback } from 'react';

type Recording = {
  id: string;
  audioBlob: Blob;
  audioUrl: string;
  transcription: string | null;
  isTranscribing?: boolean;
  error?: string;
};

export default function RecordingsPanel() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

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
            transcription: null
          },
        ]);

        // Clean up stream tracks
        streamRef.current?.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start recording');
      console.error('Recording error:', err);
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, []);

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

  const deleteRecording = useCallback((id: string) => {
    setRecordings(prev => {
      const recording = prev.find(rec => rec.id === id);
      if (recording) {
        URL.revokeObjectURL(recording.audioUrl);
      }
      return prev.filter(rec => rec.id !== id);
    });
  }, []);

  return (
    <div className="absolute">
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed top-5 left-6 z-50 p-2.5 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200"
        aria-label="Toggle Recordings Menu"
      >
        <svg
          className="w-5 h-5 text-blue-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 transition-opacity"
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 left-0 w-72 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: 40 }}
      >
        <div className="p-4 pt-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Recordings</h2>
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`p-2 rounded-full transition-colors ${
                isRecording 
                  ? 'bg-red-100 text-red-500 hover:bg-red-200' 
                  : 'bg-blue-100 text-blue-500 hover:bg-blue-200'
              }`}
              aria-label={isRecording ? 'Stop Recording' : 'Start Recording'}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isRecording ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                )}
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}