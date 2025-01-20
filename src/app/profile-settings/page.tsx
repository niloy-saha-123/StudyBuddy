'use client'

import { useUser, useClerk } from '@clerk/nextjs'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ProfileSettingsPage = () => {
  const { user } = useUser()
  const clerk = useClerk()
  const router = useRouter()
  const [isResetEmailSent, setIsResetEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleResetPassword = async () => {
    if (!user?.primaryEmailAddress?.emailAddress) return

    setIsLoading(true)
    try {
      // Sign out first
      await clerk.signOut()
      
      // Initiate password reset
      const emailAddress = user.primaryEmailAddress.emailAddress
      const resetPasswordResponse = await clerk.client.signIn.create({
        identifier: emailAddress,
        strategy: "reset_password_email_code",
      })

      setIsResetEmailSent(true)
      
      // Redirect to sign-in page after a short delay
      setTimeout(() => {
        router.push('/sign-in')
      }, 3000)
    } catch (error) {
      console.error('Error initiating password reset:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#14171F] p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-6">Profile Settings</h1>
        
        <div className="bg-[#1E2330] rounded-lg p-6 mb-6">
          <h2 className="text-xl text-white mb-4">Account Security</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium">Password</h3>
                <p className="text-gray-400 text-sm">
                  Note: You will be signed out after requesting a password reset
                </p>
              </div>
              <button
                onClick={handleResetPassword}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
                         transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Reset Password'}
              </button>
            </div>

            {isResetEmailSent && (
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                <p className="text-blue-400">
                  Password reset instructions have been sent to your email. 
                  You will be redirected to the sign-in page in a moment.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Display user info */}
        <div className="bg-[#1E2330] rounded-lg p-6">
          <h2 className="text-xl text-white mb-4">Profile Information</h2>
          <div className="space-y-3">
            <div>
              <label className="text-gray-400 text-sm">Email</label>
              <p className="text-white">{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm">Username</label>
              <p className="text-white">{user?.username}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileSettingsPage