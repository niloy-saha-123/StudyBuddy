'use client'

// Import necessary dependencies
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  // State management for form inputs and UI states
  // These states handle the form data and user interaction feedback
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)  // Tracks when form is being submitted
  const [error, setError] = useState<string | null>(null)  // Stores any error messages

  // Handle form submission
  // This async function manages the entire login process
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()  // Prevent default form submission behavior
    setLoading(true)   // Start loading state
    setError(null)     // Clear any previous errors

    try {
      // Placeholder for future Clerk authentication
      console.log('Login attempted:', { email, password })
      // Ribat will add Clerk authentication here
      
      // After successful authentication, redirect to dashboard
      window.location.href = '/dashboard'
    } catch (error) {
      // Handle any errors that occur during login
      setError((error as Error).message)
    } finally {
      // Always reset loading state, whether login succeeded or failed
      setLoading(false)
    }
  }

  return (
    // Main container - full height with dark theme
    <div className="min-h-screen bg-[#14171F] flex items-center justify-center px-4">
      {/* Content container with maximum width for better readability */}
      <div className="max-w-md w-full space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Welcome back</h2>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>
        
        {/* Form Section */}
        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          {/* Error Message - Only shown when there is an error */}
          {error && (
            <div className="bg-red-500/10 text-red-400 p-4 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {/* Form Fields Container */}
          <div className="space-y-4">
            {/* Email Input Field */}
            <div>
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 
                         rounded-md text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Input Field */}
            <div>
              <label htmlFor="password" className="text-sm font-medium text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 
                         rounded-md text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button - Disabled during form submission */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent 
                     rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 
                     hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                     focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          {/* Sign up Link Section */}
          <div className="text-center text-sm">
            <span className="text-gray-400">Don&apos;t have an account? </span>
            <Link href="/signup" className="text-blue-400 hover:text-blue-300">
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}