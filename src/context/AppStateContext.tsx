'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { 
  Classroom, 
  RecordingWithMeta,
  TrashableItem, 
  AppStateContextType 
} from '@/components/recording/types'

// Storage keys
const STORAGE_KEYS = {
  RECORDINGS: 'voiceRecordings',
  CLASSROOMS: 'classrooms',
  FAVOURITES: 'favourites'
} as const

const AppStateContext = createContext<AppStateContextType | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [recordings, setRecordings] = useState<RecordingWithMeta[]>([])
  const [favourites, setFavourites] = useState<TrashableItem[]>([])
  const [trashedItems, setTrashedItems] = useState<TrashableItem[]>([])

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
        
        // Remove duplicates and sort
        const uniqueRecordings = [...new Map(parsedRecordings.map(rec => [rec.id, rec])).values()]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

        setRecordings(uniqueRecordings)

        // Initialize favorites from recordings
        const favoriteRecordings = uniqueRecordings.filter(rec => rec.isFavourite)
        setFavourites(current => [...current, ...favoriteRecordings])
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
            type: 'classroom'
          }))
        setClassrooms(parsedClassrooms)

        // Initialize favorites from classrooms
        const favoriteClassrooms = parsedClassrooms.filter(classroom => classroom.isFavourite)
        setFavourites(current => [...current, ...favoriteClassrooms])
      } catch (error) {
        console.error('Error loading classrooms:', error)
      }
    }
  }, [])

  // Helper function to save classrooms to localStorage
  const saveClassroomsToStorage = (updatedClassrooms: Classroom[]) => {
    try {
      console.log('Saving classrooms:', updatedClassrooms) // Add this line
      localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(updatedClassrooms))
    } catch (error) {
      console.error('Error saving classrooms:', error)
    }
  }

  // Add new recording
  const addRecording = (recording: RecordingWithMeta) => {
    setRecordings(current => {
      const newRecordings = [recording, ...current]
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(newRecordings))
      return newRecordings
    })
  }

  // Classroom functions
  const updateClassroomName = (id: string, newName: string) => {
    setClassrooms(current => {
      const updatedClassrooms = current.map(classroom =>
        classroom.id === id ? { ...classroom, name: newName } : classroom
      )
      saveClassroomsToStorage(updatedClassrooms)
      return updatedClassrooms
    })
    
    setFavourites(current =>
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
    
    setFavourites(current => {
      const exists = current.some(item => item.id === classroom.id)
      if (!exists) {
        return [updatedClassroom, ...current]
      }
      return current
    })
    
    setClassrooms(current => {
      const updatedClassrooms = current.map(c => 
        c.id === classroom.id ? updatedClassroom : c
      )
      saveClassroomsToStorage(updatedClassrooms)
      return updatedClassrooms
    })
  }

  const removeFromFavourites = (id: string) => {
    setFavourites(current => current.filter(item => item.id !== id))
    
    setClassrooms(current => {
      const updatedClassrooms = current.map(c => 
        c.id === id ? { ...c, isFavourite: false } : c
      )
      saveClassroomsToStorage(updatedClassrooms)
      return updatedClassrooms
    })

    setRecordings(current => {
      const updatedRecordings = current.map(r => 
        r.id === id ? { ...r, isFavourite: false } : r
      )
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedRecordings))
      return updatedRecordings
    })
  }

  const addRecordingToFavourites = (recording: RecordingWithMeta) => {
    const updatedRecording: RecordingWithMeta = {
      ...recording,
      isFavourite: true,
      type: 'recording'
    }
    
    setFavourites(current => {
      const exists = current.some(item => item.id === recording.id)
      if (!exists) {
        return [updatedRecording, ...current]
      }
      return current
    })
    
    setRecordings(current => {
      const updatedRecordings = current.map(r => 
        r.id === recording.id ? updatedRecording : r
      )
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedRecordings))
      return updatedRecordings
    })
  }

  const removeRecordingFromFavourites = (id: string) => {
    setFavourites(current => current.filter(item => item.id !== id))
    
    setRecordings(current => {
      const updatedRecordings = current.map(r => 
        r.id === id ? { ...r, isFavourite: false } : r
      )
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedRecordings))
      return updatedRecordings
    })
  }
  const addRecordingToClassroom = (recordingId: string, classroomId: string | Classroom) => {
    const targetClassroomId = typeof classroomId === 'string' 
      ? classroomId 
      : classroomId.id
  
    const colors = ['blue', 'purple', 'green', 'pink'] as const
  
    setClassrooms(current => {
      // Create a deep copy of current classrooms to avoid mutation
      let updatedClassrooms = JSON.parse(JSON.stringify(current))
      
      // Find if the classroom already exists
      const existingClassroomIndex = updatedClassrooms.findIndex(
        (classroom: Classroom) => classroom.id === targetClassroomId
      )
  
      const now = new Date().toISOString()
  
      if (existingClassroomIndex !== -1) {
        // Existing classroom: update recordings
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
        // New classroom creation logic
        const newClassroom: Classroom = typeof classroomId === 'string' 
          ? {
              id: targetClassroomId,
              name: 'New Classroom',
              recordings: [recordingId],
              lectureCount: 1,
              lastActive: now,
              color: colors[current.length % colors.length],
              isFavourite: false,
              type: 'classroom' as const
            }
          : {
              ...classroomId,
              recordings: [recordingId],
              lectureCount: 1,
              lastActive: now,
              color: classroomId.color || colors[current.length % colors.length],
              type: 'classroom' as const
            }
  
        updatedClassrooms.push(newClassroom)
      }
  
      // Ensure immediate and persistent storage
      try {
        // Get existing classrooms from localStorage
        const existingClassrooms = JSON.parse(
          localStorage.getItem(STORAGE_KEYS.CLASSROOMS) || '[]'
        )
  
        // Merge new classrooms with existing ones
        const finalClassrooms = [...existingClassrooms]
        updatedClassrooms.forEach((newClassroom: Classroom) => {
          const existingIndex = finalClassrooms.findIndex(c => c.id === newClassroom.id)
          if (existingIndex !== -1) {
            // Update existing classroom
            finalClassrooms[existingIndex] = newClassroom
          } else {
            // Add new classroom
            finalClassrooms.push(newClassroom)
          }
        })
  
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(finalClassrooms))
      } catch (error) {
        console.error('Failed to save classrooms to localStorage:', error)
      }
      
      return updatedClassrooms
    })
    
    // Update recordings
    setRecordings(current => {
      const updatedRecordings = current.map(recording =>
        recording.id === recordingId
          ? { ...recording, classroomId: targetClassroomId }
          : recording
      )
  
      try {
        localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedRecordings))
      } catch (error) {
        console.error('Failed to save recordings to localStorage:', error)
      }
      
      return updatedRecordings
    })
  }
  const removeRecordingFromClassroom = (recordingId: string, classroomId: string) => {
    setClassrooms(current => {
      const updatedClassrooms = current.map(classroom =>
        classroom.id === classroomId
          ? {
              ...classroom,
              recordings: (classroom.recordings || []).filter(id => id !== recordingId),
              lectureCount: Math.max(0, classroom.lectureCount - 1),
              lastActive: new Date().toISOString()
            }
          : classroom
      )
      saveClassroomsToStorage(updatedClassrooms)
      return updatedClassrooms
    })
    
    setRecordings(current => {
      const updatedRecordings = current.map(recording =>
        recording.id === recordingId
          ? { ...recording, classroomId: undefined }
          : recording
      )
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedRecordings))
      return updatedRecordings
    })
  }
  // Trash management
  const moveToTrash = (classroom: Classroom) => {
    const currentIndex = classrooms.findIndex(c => c.id === classroom.id)
    const itemsBefore = classrooms.slice(0, currentIndex).map(item => item.id)
    
    setClassrooms(current => {
      const updatedClassrooms = current.filter(c => c.id !== classroom.id)
      saveClassroomsToStorage(updatedClassrooms)
      return updatedClassrooms
    })
    
    setTrashedItems(current => [
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
      setFavourites(current => current.filter(i => i.id !== classroom.id))
    }
  }

  const moveRecordingToTrash = (recording: RecordingWithMeta) => {
    const currentIndex = recordings.findIndex(r => r.id === recording.id)
    const itemsBefore = recordings.slice(0, currentIndex).map(item => item.id)
    
    setRecordings(current => {
      const updatedRecordings = current.filter(r => r.id !== recording.id)
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedRecordings))
      return updatedRecordings
    })
    
    const trashedRecording = {
      ...recording,
      deletedAt: new Date().toISOString(),
      originalIndex: currentIndex,
      itemsBefore,
      type: 'recording' as const
    }

    setTrashedItems(current => [trashedRecording, ...current])

    if (recording.isFavourite) {
      setFavourites(current => current.filter(i => i.id !== recording.id))
    }

    if (recording.classroomId) {
      removeRecordingFromClassroom(recording.id, recording.classroomId)
    }
  }

  const restoreFromTrash = (id: string) => {
    const itemToRestore = trashedItems.find(item => item.id === id)
    if (!itemToRestore) return

    const { deletedAt, originalIndex, itemsBefore, ...restoredItem } = itemToRestore

    setTrashedItems(current => current.filter(item => item.id !== id))

    if (restoredItem.type === 'recording') {
      setRecordings(current => {
        const newRecordings = [...current]
        const remainingBeforeItems = itemsBefore!.filter(id => 
          current.some(recording => recording.id === id)
        ).length
        const newPosition = Math.min(remainingBeforeItems, current.length)
        newRecordings.splice(newPosition, 0, restoredItem as RecordingWithMeta)
        localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(newRecordings))
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
        saveClassroomsToStorage(newClassrooms)
        return newClassrooms
      })
    }

    if (restoredItem.isFavourite) {
      setFavourites(current => [...current, restoredItem])
    }
  }

  const deletePermanently = (id: string) => {
    const itemToDelete = trashedItems.find(item => item.id === id)
    if (!itemToDelete) return

    if (itemToDelete.type === 'recording') {
      const storedRecordings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDINGS) || '[]')
      const updatedStoredRecordings = storedRecordings.filter(
        (rec: RecordingWithMeta) => rec.id !== id
      )
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedStoredRecordings))
    } else {
      const storedClassrooms = JSON.parse(localStorage.getItem(STORAGE_KEYS.CLASSROOMS) || '[]')
      const updatedStoredClassrooms = storedClassrooms.filter(
        (classroom: Classroom) => classroom.id !== id
      )
      localStorage.setItem(STORAGE_KEYS.CLASSROOMS, JSON.stringify(updatedStoredClassrooms))
    }
    
    setTrashedItems(current => current.filter(item => item.id !== id))
  }

  // Auto-delete trash items after 30 days
  useEffect(() => {

    const storedRecordings = localStorage.getItem(STORAGE_KEYS.RECORDINGS)
    if (storedRecordings) {
      try {
        const parsedRecordings: RecordingWithMeta[] = JSON.parse(storedRecordings)
          .map((rec: RecordingWithMeta) => ({
            ...rec,
            createdAt: new Date(rec.createdAt),
            type: 'recording'
          }))
        
        // Remove duplicates and sort
        const uniqueRecordings = [...new Map(parsedRecordings.map(rec => [rec.id, rec])).values()]
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  
        setRecordings(uniqueRecordings)
  
        // Initialize favorites from recordings
        const favoriteRecordings = uniqueRecordings.filter(rec => rec.isFavourite)
        setFavourites(current => [...current, ...favoriteRecordings])
      } catch (error) {
        console.error('Error loading recordings:', error)
      }
    }
  
    // Load classrooms
    const storedClassrooms = localStorage.getItem(STORAGE_KEYS.CLASSROOMS)
  console.log('Stored Classrooms:', storedClassrooms)
  
  if (storedClassrooms) {
    try {
      const parsedClassrooms: Classroom[] = JSON.parse(storedClassrooms)
        .map((classroom: Classroom) => ({
          ...classroom,
          type: 'classroom',
          // Ensure all required properties exist
          recordings: classroom.recordings || [],
          lectureCount: classroom.lectureCount || 0,
          lastActive: classroom.lastActive || new Date().toISOString(),
          color: classroom.color || 'blue'
        }))
      
      console.log('Parsed Classrooms:', parsedClassrooms)
      
      // Validate classrooms before setting
      const validClassrooms = parsedClassrooms.filter(classroom => 
        classroom.id && classroom.name
      )
      
      setClassrooms(validClassrooms)

      // Initialize favorites from classrooms
      const favoriteClassrooms = validClassrooms.filter(classroom => classroom.isFavourite)
      setFavourites(current => [...current, ...favoriteClassrooms])
    } catch (error) {
      console.error('Error loading classrooms:', error)
    }
  }
  }, [])

  const updateRecordingTitle = (id: string, newTitle: string) => {
    setRecordings(current => {
      const updatedRecordings = current.map(recording =>
        recording.id === id ? { ...recording, title: newTitle } : recording
      );
      localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedRecordings));
      return updatedRecordings;
    });
   
    setFavourites(current =>
      current.map(item =>
        item.type === 'recording' && item.id === id
          ? { ...item, title: newTitle }
          : item
      )
    );
  };
  const updateRecordingTranscription = (id: string, transcription: string) => {
    setRecordings(prevRecordings => 
      prevRecordings.map(recording => 
        recording.id === id 
          ? { ...recording, transcription } 
          : recording
      )
    );
    
    // Optional: Update localStorage to persist transcription
    const storedRecordings = JSON.parse(localStorage.getItem(STORAGE_KEYS.RECORDINGS) || '[]');
    const updatedStoredRecordings = storedRecordings.map((recording: RecordingWithMeta) => 
      recording.id === id 
        ? { ...recording, transcription } 
        : recording
    );
    localStorage.setItem(STORAGE_KEYS.RECORDINGS, JSON.stringify(updatedStoredRecordings));
  };
  return (
    <AppStateContext.Provider 
      value={{
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
        updateRecordingTranscription,
        addRecordingToClassroom,
        removeRecordingFromClassroom,
        restoreFromTrash,
        deletePermanently,
        setRecordings,
        addRecording
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