'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
 // State management for form data and UI states
 const [formData, setFormData] = useState({
   fullName: '',
   email: '',
   password: '',
   confirmPassword: ''
 })
 const [loading, setLoading] = useState(false)  // Track form submission loading state
 const [error, setError] = useState<string | null>(null)  // Track error messages

 // Handle form submission
 const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault()
   setLoading(true)
   setError(null)

   // Basic validation
   if (formData.password !== formData.confirmPassword) {
     setError("Passwords don't match")
     setLoading(false)
     return
   }

   try {
     // Placeholder for Clerk integration
     console.log('Form submitted:', formData)
     // Ribat Clerk authentication here
     
     // Redirect to dashboard on success
     // window.location.href = '/dashboard'
   } catch (error) {
     setError((error as Error).message)
   } finally {
     setLoading(false)
   }
 }

 // Generic handler for all input changes
 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = e.target
   setFormData(prev => ({
     ...prev,
     [name]: value  // Update the specific field while keeping other fields unchanged
   }))
 }

 return (
   // Main container with full height and dark background
   <div className="min-h-screen bg-[#14171F] flex items-center justify-center px-4">
     {/* Form container with max width for better readability */}
     <div className="max-w-md w-full space-y-8">
       {/* Header Section */}
       <div className="text-center">
         <h2 className="text-3xl font-bold text-white">Create your account</h2>
         <p className="mt-2 text-gray-400">Start your learning journey today</p>
       </div>
       
       {/* Form Element */}
       <form onSubmit={handleSubmit} className="mt-8 space-y-6">
         {/* Error display */}
         {error && (
           <div className="bg-red-500/10 text-red-400 p-4 rounded-md text-sm">
             {error}
           </div>
         )}

         {/* Input Fields Container */}
         <div className="space-y-4">
           {/* Full Name Input */}
           <div>
             <label htmlFor="fullName" className="text-sm font-medium text-gray-300">
               Full Name
             </label>
             <input
               id="fullName"
               name="fullName"
               type="text"
               required
               value={formData.fullName}
               onChange={handleChange}
               className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 
                        rounded-md text-white placeholder-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder="John Doe"
             />
           </div>

           {/* Email Input */}
           <div>
             <label htmlFor="email" className="text-sm font-medium text-gray-300">
               Email address
             </label>
             <input
               id="email"
               name="email"
               type="email"
               required
               value={formData.email}
               onChange={handleChange}
               className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 
                        rounded-md text-white placeholder-gray-500 
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder="you@example.com"
             />
           </div>

           {/* Password Input */}
           <div>
             <label htmlFor="password" className="text-sm font-medium text-gray-300">
               Password
             </label>
             <input
               id="password"
               name="password"
               type="password"
               required
               value={formData.password}
               onChange={handleChange}
               className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 
                         rounded-md text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder="••••••••"
             />
           </div>

           {/* Confirm Password Input */}
           <div>
             <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300">
               Confirm Password
             </label>
             <input
               id="confirmPassword"
               name="confirmPassword"
               type="password"
               required
               value={formData.confirmPassword}
               onChange={handleChange}
               className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 
                         rounded-md text-white placeholder-gray-500 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
               placeholder="••••••••"
             />
           </div>
         </div>

         {/* Submit Button */}
         <button
           type="submit"
           disabled={loading}
           className="w-full flex justify-center py-3 px-4 border border-transparent 
                    rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 
                    hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                    focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
         >
           {loading ? 'Creating account...' : 'Create account'}
         </button>

         {/* Sign in Link */}
         <div className="text-center text-sm">
           <span className="text-gray-400">Already have an account? </span>
           <Link href="/login" className="text-blue-400 hover:text-blue-300">
             Sign in
           </Link>
         </div>
       </form>
     </div>
   </div>
 )
}