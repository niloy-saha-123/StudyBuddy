// Navigation Types
export type NavigationItem = 'home' | 'recordings' | 'favourites' | 'trash'

// Recording and Modal Types
export type ModalType = 'record' | 'upload' | 'auto' | null
export type RecordingStatus = 'idle' | 'recording' | 'paused'
export type DialogType = 'none' | 'create' | 'rename' | 'delete' | 'save' | 'close' | 'discard'
export type UploadStatus = 'idle' | 'transcribing' | 'success' | 'error'

// Base Recording Type
export interface Recording {
  id: string
  audioBlob: Blob | File
  audioUrl: string
  transcription: string | null
  createdAt: Date
  title?: string
  isTranscribing?: boolean
  error?: string
}

// Extended Recording Type with metadata
export interface RecordingWithMeta extends Omit<Recording, 'audioBlob'> {
  audioBlob: string | Blob | File
  type: 'recording'
  isFavourite?: boolean
  deletedAt?: string
  originalIndex?: number
  itemsBefore?: string[]
  classroomId?: string;
}

// Classroom Types
export interface Classroom {
  id: string
  name: string
  lectureCount: number
  lastActive: string
  color: 'blue' | 'purple' | 'green' | 'pink'
  isFavourite?: boolean
  deletedAt?: string
  originalIndex?: number
  itemsBefore?: string[]
  type: 'classroom'
  recordings?: string[]
}

// Combined type for items that can be in favourites/trash
export type TrashableItem = Classroom | RecordingWithMeta

// Classroom Actions Interface
export interface ClassroomActions {
  updateClassroomName: (id: string, newName: string) => void
  addToFavourites: (classroom: Classroom) => void
  removeFromFavourites: (id: string) => void
  moveToTrash: (classroom: Classroom) => void
}

// Recording Actions Interface
export interface RecordingActions {
  updateRecordingTitle: (id: string, newTitle: string) => void
  addRecordingToFavourites: (recording: RecordingWithMeta) => void
  removeRecordingFromFavourites: (id: string) => void
  moveRecordingToTrash: (recording: RecordingWithMeta) => void
}

// App State Context Type
// App State Context Type
export interface AppStateContextType extends ClassroomActions, RecordingActions {
  classrooms: Classroom[]
  recordings: RecordingWithMeta[]
  favourites: TrashableItem[]
  trashedItems: TrashableItem[]
  restoreFromTrash: (id: string) => void
  deletePermanently: (id: string) => void
  setClassrooms: (classrooms: Classroom[]) => void
  setRecordings: (recordings: RecordingWithMeta[]) => void
  addRecording: (recording: RecordingWithMeta) => void
  addRecordingToClassroom: (recordingId: string, classroomId: string) => void
  removeRecordingFromClassroom: (recordingId: string, classroomId: string) => void
  isDarkMode: boolean
  toggleDarkMode: () => void
}