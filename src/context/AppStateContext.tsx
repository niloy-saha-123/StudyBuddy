'use client'

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react'
import type { 
  Classroom, 
  RecordingWithMeta,
  TrashableItem, 
  AppStateContextType 
} from '@/components/recording/types'

const AppStateContext = createContext<AppStateContextType | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  // Main states
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [recordings, setRecordings] = useState<RecordingWithMeta[]>([])
  const [favourites, setFavourites] = useState<TrashableItem[]>([])
  const [trashedItems, setTrashedItems] = useState<TrashableItem[]>([])

  // Initialize recordings from localStorage
  useEffect(() => {
    const storedRecordings = localStorage.getItem('voiceRecordings')
    if (storedRecordings) {
      try {
        const parsedRecordings: RecordingWithMeta[] = JSON.parse(storedRecordings)
          .map((rec: RecordingWithMeta) => ({
            ...rec,
            createdAt: new Date(rec.createdAt),
            type: 'recording'
          }))
          .sort((a: RecordingWithMeta, b: RecordingWithMeta) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
        setRecordings(parsedRecordings)
      } catch (error) {
        console.error('Error loading recordings:', error)
      }
    }
  }, [])

  // Add new recording
  const addRecording = useCallback((recording: RecordingWithMeta) => {
    setRecordings(current => [recording, ...current])
  }, [])

  // Classroom functions
  const updateClassroomName = useCallback((id: string, newName: string) => {
    setClassrooms(current =>
      current.map(classroom =>
        classroom.id === id
          ? { ...classroom, name: newName }
          : classroom
      )
    )
    
    setFavourites(current =>
      current.map(item =>
        item.type === 'classroom' && item.id === id
          ? { ...item, name: newName }
          : item
      )
    )
  }, [])

  const addToFavourites = useCallback((classroom: Classroom) => {
    const updatedClassroom: Classroom = {
      ...classroom,
      isFavourite: true,
      type: 'classroom'
    }
    
    setFavourites(current => [updatedClassroom, ...current])
    setClassrooms(current => 
      current.map(c => c.id === classroom.id ? updatedClassroom : c)
    )
  }, [])

  const removeFromFavourites = useCallback((id: string) => {
    setFavourites(current => current.filter(item => item.id !== id))
    
    setClassrooms(current => 
      current.map(c => c.id === id ? { ...c, isFavourite: false } : c)
    )
  }, [])

  // Recording functions
  const updateRecordingTitle = useCallback((id: string, newTitle: string) => {
    setRecordings(current =>
      current.map(recording =>
        recording.id === id
          ? { ...recording, title: newTitle }
          : recording
      )
    )
    
    setFavourites(current =>
      current.map(item =>
        item.type === 'recording' && item.id === id
          ? { ...item, title: newTitle }
          : item
      )
    )

    // Update in localStorage
    const storedRecordings = JSON.parse(localStorage.getItem('voiceRecordings') || '[]')
    const updatedStoredRecordings = storedRecordings.map((rec: RecordingWithMeta) =>
      rec.id === id ? { ...rec, title: newTitle } : rec
    )
    localStorage.setItem('voiceRecordings', JSON.stringify(updatedStoredRecordings))
  }, [])

  const addRecordingToFavourites = useCallback((recording: RecordingWithMeta) => {
    const updatedRecording: RecordingWithMeta = {
      ...recording,
      isFavourite: true,
      type: 'recording'
    }
    
    setFavourites(current => [updatedRecording, ...current])
    setRecordings(current => 
      current.map(r => r.id === recording.id ? updatedRecording : r)
    )
  }, [])

  const removeRecordingFromFavourites = useCallback((id: string) => {
    setFavourites(current => current.filter(item => item.id !== id))
    
    setRecordings(current => 
      current.map(r => r.id === id ? { ...r, isFavourite: false } : r)
    )
  }, [])

  const addRecordingToClassroom = useCallback((recordingId: string, classroomId: string) => {
    setClassrooms(current =>
      current.map(classroom =>
        classroom.id === classroomId
          ? {
              ...classroom,
              recordings: [...(classroom.recordings || []), recordingId],
              lectureCount: classroom.lectureCount + 1,
              lastActive: new Date().toISOString()
            }
          : classroom
      )
    )
    
    setRecordings(current =>
      current.map(recording =>
        recording.id === recordingId
          ? { ...recording, classroomId }
          : recording
      )
    )
  }, [])

  const removeRecordingFromClassroom = useCallback((recordingId: string, classroomId: string) => {
    setClassrooms(current =>
      current.map(classroom =>
        classroom.id === classroomId
          ? {
              ...classroom,
              recordings: (classroom.recordings || []).filter(id => id !== recordingId),
              lectureCount: classroom.lectureCount - 1,
              lastActive: new Date().toISOString()
            }
          : classroom
      )
    )
    
    setRecordings(current =>
      current.map(recording =>
        recording.id === recordingId
          ? { ...recording, classroomId: undefined }
          : recording
      )
    )
  }, [])

  // Trash functions
  const moveToTrash = useCallback((item: Classroom) => {
    const currentIndex = classrooms.findIndex(c => c.id === item.id)
    const itemsBefore = classrooms.slice(0, currentIndex).map(item => item.id)
    
    setClassrooms(current => current.filter(c => c.id !== item.id))
    setTrashedItems(current => [
      { 
        ...item,
        deletedAt: new Date().toISOString(),
        originalIndex: currentIndex,
        itemsBefore,
        type: 'classroom'
      },
      ...current
    ])

    if (item.isFavourite) {
      setFavourites(current => current.filter(i => i.id !== item.id))
    }
  }, [classrooms])

  const moveRecordingToTrash = useCallback((recording: RecordingWithMeta) => {
    const currentIndex = recordings.findIndex(r => r.id === recording.id)
    const itemsBefore = recordings.slice(0, currentIndex).map(item => item.id)
    
    setRecordings(current => current.filter(r => r.id !== recording.id))
    
    // Remove from localStorage
    const storedRecordings = JSON.parse(localStorage.getItem('voiceRecordings') || '[]')
    const updatedStoredRecordings = storedRecordings.filter((rec: RecordingWithMeta) => rec.id !== recording.id)
    localStorage.setItem('voiceRecordings', JSON.stringify(updatedStoredRecordings))

    setTrashedItems(current => [
      { 
        ...recording,
        deletedAt: new Date().toISOString(),
        originalIndex: currentIndex,
        itemsBefore,
        type: 'recording'
      },
      ...current
    ])

    if (recording.isFavourite) {
      setFavourites(current => current.filter(i => i.id !== recording.id))
    }

    if (recording.classroomId) {
      removeRecordingFromClassroom(recording.id, recording.classroomId)
    }
  }, [recordings, removeRecordingFromClassroom])

  const restoreFromTrash = useCallback((id: string) => {
    const itemToRestore = trashedItems.find(item => item.id === id)
    if (!itemToRestore) return

    const { deletedAt, originalIndex, itemsBefore, ...restoredItem } = itemToRestore

    setTrashedItems(current => current.filter(item => item.id !== id))

    if (restoredItem.type === 'classroom') {
      setClassrooms(current => {
        const newClassrooms = [...current]
        const remainingBeforeItems = itemsBefore!.filter(id => 
          current.some(classroom => classroom.id === id)
        ).length
        const newPosition = Math.min(remainingBeforeItems, current.length)
        newClassrooms.splice(newPosition, 0, restoredItem as Classroom)
        return newClassrooms
      })
    } else {
      setRecordings(current => {
        const newRecordings = [...current]
        const remainingBeforeItems = itemsBefore!.filter(id => 
          current.some(recording => recording.id === id)
        ).length
        const newPosition = Math.min(remainingBeforeItems, current.length)
        newRecordings.splice(newPosition, 0, restoredItem as RecordingWithMeta)
        
        // Update localStorage
        const storedRecordings = JSON.parse(localStorage.getItem('voiceRecordings') || '[]')
        const newStoredRecordings = [...storedRecordings]
        newStoredRecordings.splice(newPosition, 0, restoredItem)
        localStorage.setItem('voiceRecordings', JSON.stringify(newStoredRecordings))
        
        return newRecordings
      })
    }

    if (restoredItem.isFavourite) {
      setFavourites(current => [...current, restoredItem])
    }
  }, [trashedItems])

  const deletePermanently = useCallback((id: string) => {
    const itemToDelete = trashedItems.find(item => item.id === id)
    if (itemToDelete?.type === 'recording') {
      const storedRecordings = JSON.parse(localStorage.getItem('voiceRecordings') || '[]')
      const updatedStoredRecordings = storedRecordings.filter((rec: RecordingWithMeta) => rec.id !== id)
      localStorage.setItem('voiceRecordings', JSON.stringify(updatedStoredRecordings))
    }
    setTrashedItems(current => current.filter(item => item.id !== id))
  }, [trashedItems])

  // Auto-delete trash items after 30 days
  useEffect(() => {
    const checkTrashItems = () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      setTrashedItems(prevItems => 
        prevItems.filter(item => {
          if (!item.deletedAt) return true
          const deleteDate = new Date(item.deletedAt)
          if (deleteDate <= thirtyDaysAgo) {
            if (item.type === 'recording') {
              const storedRecordings = JSON.parse(localStorage.getItem('voiceRecordings') || '[]')
              const updatedStoredRecordings = storedRecordings.filter((rec: RecordingWithMeta) => rec.id !== item.id)
              localStorage.setItem('voiceRecordings', JSON.stringify(updatedStoredRecordings))
            }
            return false
          }
          return true
        })
      )
    }

    checkTrashItems()
    const interval = setInterval(checkTrashItems, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    classrooms,
    recordings,
    favourites,
    trashedItems,
    addToFavourites,
    removeFromFavourites,
    moveToTrash,
    updateClassroomName,
    setClassrooms,
    addRecordingToFavourites,
    removeRecordingFromFavourites,
    moveRecordingToTrash,
    updateRecordingTitle,
    addRecordingToClassroom,
    removeRecordingFromClassroom,
    restoreFromTrash,
    deletePermanently,
    setRecordings,
    addRecording
  }), [
    classrooms,
    recordings,
    favourites,
    trashedItems,
    addToFavourites,
    removeFromFavourites,
    moveToTrash,
    updateClassroomName,
    addRecordingToFavourites,
    removeRecordingFromFavourites,
    moveRecordingToTrash,
    updateRecordingTitle,
    addRecordingToClassroom,
    removeRecordingFromClassroom,
    restoreFromTrash,
    deletePermanently,
    addRecording
  ])

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState(): AppStateContextType {
  const context = useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider')
  }
  return context
}