'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { 
  Classroom, 
  RecordingWithMeta,
  TrashableItem, 
  AppStateContextType 
} from '@/components/recording/types'

const STORAGE_KEYS = {
  RECORDINGS: 'voiceRecordings',
  CLASSROOMS: 'classrooms',
  FAVOURITES: 'favourites'
} as const

const AppStateContext = createContext<AppStateContextType | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [classroomsState, setClassroomsState] = useState<Classroom[]>([])
  const [recordingsState, setRecordingsState] = useState<RecordingWithMeta[]>([])
  const [favouritesState, setFavouritesState] = useState<TrashableItem[]>([])
  const [trashedItemsState, setTrashedItemsState] = useState<TrashableItem[]>([])

  // Enhanced state setters with localStorage sync
  const setClassrooms = (newClassrooms: Classroom[] | ((current: Classroom[]) => Classroom[])) => {
    try {
      const updatedClassrooms = typeof newClassrooms === 'function' 
        ? newClassrooms(classroomsState)
        : newClassrooms
        
      localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(updatedClassrooms))
      setClassroomsState(updatedClassrooms)
    } catch (error) {
      console.error('Error saving classrooms to localStorage:', error)
    }
  }

  const setRecordings = (newRecordings: RecordingWithMeta[] | ((current: RecordingWithMeta[]) => RecordingWithMeta[])) => {
    try {
      const updatedRecordings = typeof newRecordings === 'function'
        ? newRecordings(recordingsState)
        : newRecordings
        
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedRecordings))
      setRecordingsState(updatedRecordings)
    } catch (error) {
      console.error('Error saving recordings to localStorage:', error)
    }
  }

  // Initialize state from localStorage
  useEffect(() => {
    // Load recordings
    const storedRecordings = localStorage.getItem(STORAGE_KEYS.RECORDINGS)
    if (storedRecordings) {
      try {
        const parsedRecordings: RecordingWithMeta[] = JSON.parse(storedRecordings)
          .map((rec: RecordingWithMeta) => ({
            ...rec,
            createdAt: new Date(rec.createdAt),
            type: 'recording'
          }))
        
        const uniqueRecordings = [...new Map(parsedRecordings.map(rec => [rec.id, rec])).values()]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        setRecordingsState(uniqueRecordings)

        const favoriteRecordings = uniqueRecordings.filter(rec => rec.isFavourite)
        setFavouritesState(prevState => [...prevState, ...favoriteRecordings])
      } catch (error) {
        console.error('Error loading recordings:', error)
      }
    }

    // Load classrooms
    const storedClassrooms = localStorage.getItem(STORAGE_KEYS.CLASSROOMS)
    if (storedClassrooms) {
      try {
        const parsedClassrooms: Classroom[] = JSON.parse(storedClassrooms)
          .map((classroom: Classroom) => ({
            ...classroom,
            type: 'classroom',
            recordings: classroom.recordings || [],
            lectureCount: classroom.lectureCount || 0,
            lastActive: classroom.lastActive || new Date().toISOString(),
            color: classroom.color || 'blue'
          }))
        
        const validClassrooms = parsedClassrooms.filter(classroom => 
          classroom.id && classroom.name
        )
        
        setClassroomsState(validClassrooms)

        const favoriteClassrooms = validClassrooms.filter(classroom => classroom.isFavourite)
        setFavouritesState(prevState => [...prevState, ...favoriteClassrooms])
      } catch (error) {
        console.error('Error loading classrooms:', error)
      }
    }
  }, [])

  // Auto-delete trash items
  useEffect(() => {
    const checkTrashItems = () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const itemsToDelete = trashedItemsState.filter(
        item => new Date(item.deletedAt || 0) < thirtyDaysAgo
      )

      if (itemsToDelete.length > 0) {
        setTrashedItemsState(current => 
          current.filter(item => 
            !itemsToDelete.some(deleteItem => deleteItem.id === item.id)
          )
        )

        itemsToDelete.forEach(item => {
          if (item.type === 'recording') {
            const storedRecordings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDINGS) || '[]')
            const updatedStoredRecordings = storedRecordings.filter(
              (rec: RecordingWithMeta) => rec.id !== item.id
            )
            localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedStoredRecordings))
          } else {
            const storedClassrooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSROOMS) || '[]')
            const updatedStoredClassrooms = storedClassrooms.filter(
              (classroom: Classroom) => classroom.id !== item.id
            )
            localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(updatedStoredClassrooms))
          }
        })
      }
    }

    checkTrashItems()
    const interval = setInterval(checkTrashItems, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [trashedItemsState])

  const addRecording = (recording: RecordingWithMeta) => {
    setRecordings(current => [recording, ...current])
  }

  const updateClassroomName = (id: string, newName: string) => {
    setClassrooms(current =>
      current.map(classroom =>
        classroom.id === id ? { ...classroom, name: newName } : classroom
      )
    )

    setFavouritesState(current =>
      current.map(item =>
        item.type === 'classroom' && item.id === id
          ? { ...item, name: newName }
          : item
      )
    )
  }

  const addToFavourites = (classroom: Classroom) => {
    const updatedClassroom: Classroom = {
      ...classroom,
      isFavourite: true,
      type: 'classroom'
    }
    
    setFavouritesState(current => {
      const exists = current.some(item => item.id === classroom.id)
      return exists ? current : [updatedClassroom, ...current]
    })
    
    setClassrooms(current =>
      current.map(c => c.id === classroom.id ? updatedClassroom : c)
    )
  }

  const removeFromFavourites = (id: string) => {
    setFavouritesState(current => current.filter(item => item.id !== id))
    
    setClassrooms(current =>
      current.map(c => c.id === id ? { ...c, isFavourite: false } : c)
    )

    setRecordings(current =>
      current.map(r => r.id === id ? { ...r, isFavourite: false } : r)
    )
  }

  const addRecordingToClassroom = (recordingId: string, classroomId: string | Classroom) => {
    const colors = ['blue', 'purple', 'green', 'pink'] as const
    const targetClassroomId = typeof classroomId === 'string' ? classroomId : classroomId.id
    const now = new Date().toISOString()

    setClassrooms(current => {
      let updatedClassrooms = [...current]
      const existingClassroomIndex = updatedClassrooms.findIndex(
        classroom => classroom.id === targetClassroomId
      )

      if (existingClassroomIndex !== -1) {
        const existingClassroom = updatedClassrooms[existingClassroomIndex]
        const currentRecordings = existingClassroom.recordings || []
        
        if (!currentRecordings.includes(recordingId)) {
          updatedClassrooms[existingClassroomIndex] = {
            ...existingClassroom,
            recordings: [...currentRecordings, recordingId],
            lectureCount: (existingClassroom.lectureCount || 0) + 1,
            lastActive: now,
            color: existingClassroom.color || colors[updatedClassrooms.length % colors.length]
          }
        }
      } else {
        const newClassroom: Classroom = typeof classroomId === 'string' 
          ? {
              id: targetClassroomId,
              name: 'New Classroom',
              recordings: [recordingId],
              lectureCount: 1,
              lastActive: now,
              color: colors[current.length % colors.length],
              isFavourite: false,
              type: 'classroom',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          : {
              ...classroomId,
              recordings: [recordingId],
              lectureCount: 1,
              lastActive: now,
              color: classroomId.color || colors[current.length % colors.length],
              type: 'classroom',
              createdAt: classroomId.createdAt || new Date(),
              updatedAt: new Date()
            }

        updatedClassrooms.push(newClassroom)
      }

      return [...new Map(updatedClassrooms.map(c => [c.id, c])).values()]
    })
    
    setRecordings(current =>
      current.map(recording =>
        recording.id === recordingId
          ? { ...recording, classroomId: targetClassroomId }
          : recording
      )
    )

    return targetClassroomId
  }

  const removeRecordingFromClassroom = (recordingId: string, classroomId: string) => {
    setClassrooms(current =>
      current.map(classroom =>
        classroom.id === classroomId
          ? {
              ...classroom,
              recordings: (classroom.recordings || []).filter(id => id !== recordingId),
              lectureCount: Math.max(0, classroom.lectureCount - 1),
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
  }

  const moveToTrash = (classroom: Classroom) => {
    const currentIndex = classroomsState.findIndex(c => c.id === classroom.id)
    const itemsBefore = classroomsState.slice(0, currentIndex).map(item => item.id)
    
    setClassrooms(current => current.filter(c => c.id !== classroom.id))
    
    setTrashedItemsState(current => [
      { 
        ...classroom,
        deletedAt: new Date().toISOString(),
        originalIndex: currentIndex,
        itemsBefore,
        type: 'classroom'
      },
      ...current
    ])

    if (classroom.isFavourite) {
      setFavouritesState(current => current.filter(i => i.id !== classroom.id))
    }
  }

  const moveRecordingToTrash = (recording: RecordingWithMeta) => {
    const currentIndex = recordingsState.findIndex(r => r.id === recording.id)
    const itemsBefore = recordingsState.slice(0, currentIndex).map(item => item.id)
    
    setRecordings(current => current.filter(r => r.id !== recording.id))
    
    setTrashedItemsState(current => [
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
      setFavouritesState(current => current.filter(i => i.id !== recording.id))
    }

    if (recording.classroomId) {
      removeRecordingFromClassroom(recording.id, recording.classroomId)
    }
  }

  const restoreFromTrash = (id: string) => {
    const itemToRestore = trashedItemsState.find(item => item.id === id)
    if (!itemToRestore) return

    const { deletedAt, originalIndex, itemsBefore, ...restoredItem } = itemToRestore
    setTrashedItemsState(current => current.filter(item => item.id !== id))

    if (restoredItem.type === 'recording') {
      setRecordings(current => {
        const newRecordings = [...current]
        const remainingBeforeItems = itemsBefore!.filter(id => 
          current.some(recording => recording.id === id)
        ).length
        const newPosition = Math.min(remainingBeforeItems, current.length)
        newRecordings.splice(newPosition, 0, restoredItem as RecordingWithMeta)
        return newRecordings
      })
    } else {
      setClassrooms(current => {
        const newClassrooms = [...current]
        const remainingBeforeItems = itemsBefore!.filter(id => 
          current.some(classroom => classroom.id === id)
        ).length
        const newPosition = Math.min(remainingBeforeItems, current.length)
        newClassrooms.splice(newPosition, 0, restoredItem as Classroom)
        return newClassrooms
      })
    }

    if (restoredItem.isFavourite) {
      setFavouritesState(current => [...current, restoredItem])
    }
  }

  const deletePermanently = (id: string) => {
    setTrashedItemsState(current => current.filter(item => item.id !== id))
  }

  const updateRecordingTitle = (id: string, newTitle: string) => {
    setRecordings(current =>
      current.map(recording =>
        recording.id === id ? { ...recording, title: newTitle } : recording
      )
    )

    setFavouritesState(current =>
      current.map(item =>
        item.type === 'recording' && item.id === id
          ? { ...item, title: newTitle }
          : item
      )
    )
  }

  const updateRecordingTranscription = (id: string, transcription: string) => {
    setRecordings(current =>
      current.map(recording =>
        recording.id === id ? { ...recording, transcription } : recording
      )
    )
  }

  const addRecordingToFavourites = (recording: RecordingWithMeta) => {
    const updatedRecording: RecordingWithMeta = {
      ...recording,
      isFavourite: true,
      type: 'recording'
    }
    
    setFavouritesState(current => {
        const exists = current.some(item => item.id === recording.id)
        return exists ? current : [updatedRecording, ...current]
      })
      
      setRecordings(current =>
        current.map(r => r.id === recording.id ? updatedRecording : r)
      )
    }
  
    const removeRecordingFromFavourites = (id: string) => {
      setFavouritesState(current => current.filter(item => item.id !== id))
      
      setRecordings(current =>
        current.map(r => r.id === id ? { ...r, isFavourite: false } : r)
      )
    }
  
    return (
      <AppStateContext.Provider 
        value={{
          classrooms: classroomsState,
          recordings: recordingsState,
          favourites: favouritesState,
          trashedItems: trashedItemsState,
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
          addRecording,
          updateRecordingTranscription
        }}
      >
        {children}
      </AppStateContext.Provider>
    )
  }
  
  export function useAppState() {
    const context = useContext(AppStateContext)
    if (!context) {
      throw new Error('useAppState must be used within AppStateProvider')
    }
    return context
  }