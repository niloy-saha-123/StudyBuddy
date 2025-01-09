// Define the type of modal that can be shown
export type ModalType = 'auto' | 'upload' | null

// Define the possible states for the recording process
export type RecordingStatus = 'idle' | 'recording' | 'paused'

// Define the types of dialogs that can appear in the recording modal
export type DialogType = 'none' | 'save' | 'close' | 'discard'