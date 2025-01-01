'use client'

// Importing necessary dependencies
import { useState } from 'react'
//import { supabase } from '@/utils/supabase'  // Import Supabase client (Removed supabse since using clerk)
import Link from 'next/link'

export default function LoginPage() {
 // State management for form inputs and UI states
 const [email, setEmail] = useState('')
 const [password, setPassword] = useState('')
 const [loading, setLoading] = useState(false)  // Track form submission state
 const [error, setError] = useState<string | null>(null)  // Track error messages

 const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
  
    try {
      // Placeholder for Clerk integration
      console.log('Login attempted:', { email, password })
      // Ribat will add Clerk authentication here
      
      // Redirect to dashboard on success
      // window.location.href = '/dashboard'
    } catch (error) {
      setError((error as Error).message)
    } finally {
      setLoading(false)
    }
  }
  
  
  

     // If there's an error, throw it
     if (error) throw error

     // On successful login, redirect to dashboard
     window.location.href = '/dashboard'
   } catch (error) {
     // Handle any errors by displaying them
     setError((error as Error).message)
   } finally {
     // Always stop loading state
     setLoading(false)
   }
 }

 return (
   // Main container with dark theme and centered content
   <div className="min-h-screen bg-[#14171F] flex items-center justify-center px-4">
     {/* Content container with max width for readability */}
     <div className="max-w-md w-full space-y-8">
       {/* Header Section */}
       <div className="text-center">
         <h2 className="text-3xl font-bold text-white">Welcome back</h2>
         <p className="mt-2 text-gray-400">Sign in to your account</p>
       </div>
       
       {/* Form Section */}
       <form onSubmit={handleLogin} className="mt-8 space-y-6">
         {/* Conditional error message display */}
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

         {/* Submit Button - Disabled when loading */}
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