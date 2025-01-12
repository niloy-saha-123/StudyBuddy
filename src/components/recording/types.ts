// Navigation Types
export type NavigationItem = 'home' | 'recordings' | 'favourites' | 'trash'

// Recording and Modal Types
export type ModalType = 'record' | 'upload' | 'auto' | null
export type RecordingStatus = 'idle' | 'recording' | 'paused'
export type DialogType = 'none' | 'create' | 'rename' | 'delete' | 'save' | 'close' | 'discard'
export type UploadStatus = 'idle' | 'transcribing' | 'success' | 'error'

// Recording Type
export type Recording = {
  id: string;
  audioBlob: Blob | File;
  audioUrl: string;
  transcription: string | null;
  isTranscribing?: boolean;
  error?: string;
  createdAt: Date;
  title?: string;
};

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
}

// Classroom Actions Interface
export interface ClassroomActions {
  updateClassroomName: (id: string, newName: string) => void
  addToFavourites: (classroom: Classroom) => void
  removeFromFavourites: (id: string) => void
  moveToTrash: (classroom: Classroom) => void
}

// App State Context Type
export interface AppStateContextType extends ClassroomActions {
  classrooms: Classroom[]
  favourites: Classroom[]
  trashedItems: Classroom[]
  restoreFromTrash: (id: string) => void
  deletePermanently: (id: string) => void
  setClassrooms: (classrooms: Classroom[]) => void
}