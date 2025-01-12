// Navigation item types for sidebar
export type NavigationItem = 'home' | 'recordings' | 'favourites' | 'trash'

// Recording related types
export type ModalType = 'auto' | 'upload' | null
export type RecordingStatus = 'idle' | 'recording' | 'paused'
export type DialogType = 'none' | 'create' | 'rename' | 'delete' | 'save' | 'close' | 'discard'

// Main classroom data structure
export interface Classroom {
  id: string
  name: string
  lectureCount: number
  lastActive: string
  color: 'blue' | 'purple' | 'green' | 'pink'
  isFavourite?: boolean
  deletedAt?: string  // Timestamp for when item was moved to trash
  originalIndex?: number
  itemsBefore?: string[]
}

// Required actions for classroom management
export interface ClassroomActions {
  updateClassroomName: (id: string, newName: string) => void
  addToFavourites: (classroom: Classroom) => void
  removeFromFavourites: (id: string) => void
  moveToTrash: (classroom: Classroom) => void
}

// Context state type definition
export interface AppStateContextType extends ClassroomActions {
  classrooms: Classroom[]
  favourites: Classroom[]
  trashedItems: Classroom[]
  restoreFromTrash: (id: string) => void
  deletePermanently: (id: string) => void
  setClassrooms: (classrooms: Classroom[]) => void
}