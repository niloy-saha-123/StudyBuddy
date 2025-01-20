'use client'
import { AccountSettingsPage } from '@/components/user-settings'

export default function AccountSettings() {
return (
  <div className="min-h-screen flex items-center justify-center p-4 bg-[#14171F]">
    <div className="w-full max-w-4xl">
      <div className="bg-[#1a1f2e] rounded-lg shadow-lg p-6">
        <AccountSettingsPage />
      </div>
    </div>
  </div>
)
}