'use client';

import { useState, useRef } from 'react';

// Define the structure of each recording
type Recording = {
  audioBlob: Blob;
  audioUrl: string; // Local URL or URL from the backend
  transcription: string | null; // Transcribed text
};

export default function RecordingsPanel() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Start recording audio
  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.ondataavailable = (event) => {
      audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
      audioChunks.current = []; // Clear chunks after saving

      const audioUrl = URL.createObjectURL(audioBlob);
      setRecordings((prev) => [
        ...prev,
        { audioBlob, audioUrl, transcription: null },
      ]);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  // Stop recording audio
  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Upload the audio and transcribe it
  const transcribeAudio = async (index: number) => {
    const audioBlob = recordings[index].audioBlob;

    const formData = new FormData();
    formData.append('file', audioBlob, 'recording.wav');

    const response = await fetch('/api/transcribe', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.fileUrl) {
      setRecordings((prev) =>
        prev.map((rec, i) =>
          i === index
            ? { ...rec, transcription: data.transcription, audioUrl: data.fileUrl }
            : rec
        )
      );
    }
  };

  return (
    <div className="absolute">
      {/* Toggle Button */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="fixed top-[20px] left-6 z-50 p-2.5 rounded-lg bg-white hover:bg-gray-50 transition-colors border border-gray-200"
        aria-label="Toggle Recordings Menu"
      >
        <svg
          className="w-5 h-5 text-blue-400"
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

      {/* Blocking overlay */}
      {isPanelOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 transition-opacity pointer-events-auto"
          style={{ zIndex: 9999 }}
          onClick={() => setIsPanelOpen(false)}
        />
      )}

      {/* Panel with smooth sliding animation */}
      <div
        className={`fixed top-0 left-0 w-72 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ zIndex: 10000 }}
      >
        <div className="p-4 pt-6 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recordings</h2>
            {isRecording ? (
              <button
                onClick={stopRecording}
                className="text-red-500"
              >
                Stop
              </button>
            ) : (
              <button
                onClick={startRecording}
                className="text-blue-500"
              >
                Record
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            <div className="space-y-3">
              {recordings.map((rec, index) => (
                <div key={index} className="p-2 border border-gray-200 rounded">
                  <audio controls src={rec.audioUrl}></audio>
                  <button
                    onClick={() => transcribeAudio(index)}
                    className="mt-2 text-blue-500"
                  >
                    Transcribe
                  </button>
                  {rec.transcription && (
                    <p className="mt-2 text-gray-700">
                      Transcription: {rec.transcription}
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
