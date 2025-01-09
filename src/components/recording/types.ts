// types.ts
export type ModalType = 'auto' | 'upload' | null

export type RecordingStatus = 'idle' | 'recording' | 'paused'

export type DialogType = 'none' | 'save' | 'close' | 'discard'

export interface Classroom {
  id: string
  name: string
  lectureCount: number
  lastActive: string
  color: 'blue' | 'purple' | 'green' | 'pink'
  isArchived?: boolean
  archiveDate?: string // ISO string for archive date
}