'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import type { Classroom, AppStateContextType } from '@/components/recording/types'

const AppStateContext = createContext<AppStateContextType | null>(null)

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [classrooms, setClassrooms] = useState<Classroom[]>([])
  const [favourites, setFavourites] = useState<Classroom[]>([])
  const [trashedItems, setTrashedItems] = useState<Classroom[]>([])

  const updateClassroomName = (id: string, newName: string) => {
    setClassrooms(current =>
      current.map(classroom =>
        classroom.id === id
          ? { ...classroom, name: newName }
          : classroom
      )
    )
    
    setFavourites(current =>
      current.map(classroom =>
        classroom.id === id
          ? { ...classroom, name: newName }
          : classroom
      )
    )
  }

  const addToFavourites = (classroom: Classroom) => {
    const updatedClassroom = { ...classroom, isFavourite: true }
    
    setFavourites(current => [...current, updatedClassroom])
    
    setClassrooms(current => 
      current.map(c => c.id === classroom.id ? updatedClassroom : c)
    )
  }

  const removeFromFavourites = (id: string) => {
    setFavourites(current => current.filter(item => item.id !== id))
    
    setClassrooms(current => 
      current.map(c => c.id === id ? { ...c, isFavourite: false } : c)
    )
  }

  const moveToTrash = (classroom: Classroom) => {
    const currentIndex = classrooms.findIndex(item => item.id === classroom.id)
    const itemsBefore = classrooms.slice(0, currentIndex).map(item => item.id)
    
    setClassrooms(current => current.filter(item => item.id !== classroom.id))
    
    setTrashedItems(current => [
      ...current, 
      { 
        ...classroom, 
        deletedAt: new Date().toISOString(),
        originalIndex: currentIndex,
        itemsBefore: itemsBefore // Fixed: Actually assign the itemsBefore array
      }
    ])

    if (classroom.isFavourite) {
      setFavourites(current => current.filter(item => item.id !== classroom.id))
    }
  }

  const restoreFromTrash = (id: string) => {
    const itemToRestore = trashedItems.find(item => item.id === id)
    if (itemToRestore) {
      const { deletedAt, originalIndex, itemsBefore, ...restoredItem } = itemToRestore
      
      setTrashedItems(current => current.filter(item => item.id !== id))
      
      setClassrooms(current => {
        const newClassrooms = [...current]
        
        // Calculate how many items that were before this item are still present
        const remainingBeforeItems = itemsBefore!.filter(id => 
          current.some(classroom => classroom.id === id)
        ).length
        
        // Use the count of remaining items to determine new position
        const newPosition = Math.min(remainingBeforeItems, current.length)
        
        // Insert at adjusted position
        newClassrooms.splice(newPosition, 0, restoredItem)
        return newClassrooms
      })
      
      if (restoredItem.isFavourite) {
        setFavourites(current => [...current, restoredItem])
      }
    }
  }

  const deletePermanently = (id: string) => {
    setTrashedItems(current => current.filter(item => item.id !== id))
  }

  useEffect(() => {
    const checkTrashItems = () => {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      setTrashedItems(prevItems => 
        prevItems.filter(item => {
          if (!item.deletedAt) return true
          const deleteDate = new Date(item.deletedAt)
          return deleteDate > thirtyDaysAgo
        })
      )
    }

    checkTrashItems()
    const interval = setInterval(checkTrashItems, 1000 * 60 * 60)
    return () => clearInterval(interval)
  }, [])

  return (
    <AppStateContext.Provider 
      value={{
        classrooms,
        favourites,
        trashedItems,
        addToFavourites,
        removeFromFavourites,
        moveToTrash,
        restoreFromTrash,
        deletePermanently,
        setClassrooms,
        updateClassroomName
      }}
    >
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