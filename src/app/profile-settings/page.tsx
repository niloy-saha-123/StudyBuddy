'use client'
import { ProfileSettingsPage } from '@/components/user-settings'

export default function ProfileSettings() {
 return (
   <div className="min-h-screen flex items-center justify-center p-4">
     <div className="w-full max-w-4xl">
       <ProfileSettingsPage />
     </div>
   </div>
 )
}