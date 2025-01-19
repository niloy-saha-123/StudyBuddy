'use client'

import { useState } from 'react'
import { Rocket, Users, Clock, Shield } from 'lucide-react'

const AboutPage = () => {
  const [feedback, setFeedback] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/send-feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedback }),
      })

      if (response.ok) {
        setFeedback('')
        setSuccessMessage('Thank you for your feedback!')
        setErrorMessage('')
      } else {
        setErrorMessage('Failed to send feedback. Please try again later.')
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const missionItems = [
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Cutting-edge AI technology',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Community',
      description: 'Built for students, by students',
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: 'Efficiency',
      description: 'Save hours on note-taking',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Privacy',
      description: 'Your data stays yours',
    },
  ]

  return (
    <div className="min-h-screen bg-[#14171F] pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h1 className="text-4xl font-bold text-white mb-6">
          Revolutionizing The Way Students Learn
        </h1>
        <p className="text-xl text-gray-400 leading-relaxed">
          StudyBuddy is an AI-powered learning assistant that helps students transform
          their lecture recordings into organized study materials.
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-[#1a1f2e] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                We believe that every student deserves access to powerful learning tools.
                Our mission is to leverage artificial intelligence to make learning more
                efficient, accessible, and enjoyable.
              </p>
              <p className="text-gray-400 leading-relaxed">
                By automating the note-taking and summarization process, we help students
                focus on what matters most - understanding and retaining knowledge.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {missionItems.map((item, index) => (
                <div key={index} className="bg-[#14171F] p-6 rounded-xl">
                  <div className="text-blue-400 mb-4">{item.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="bg-[#14171F] py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-6">Send Feedback</h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Have feedback? Let us know, and we’ll make StudyBuddy better for you!
          </p>
          <form onSubmit={handleSubmit} className="max-w-xl mx-auto">
            <textarea
              className="w-full p-4 rounded-md bg-[#1a1f2e] text-white resize-none"
              rows={4}
              placeholder="Write your feedback here..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              required
            ></textarea>
            <button
              type="submit"
              className={`mt-4 px-8 py-4 bg-blue-500 text-white rounded-xl text-lg font-medium transition-all duration-300 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
          {successMessage && (
            <p className="text-green-500 mt-4">{successMessage}</p>
          )}
          {errorMessage && <p className="text-red-500 mt-4">{errorMessage}</p>}
        </div>
      </section>
    </div>
  )
}

export default AboutPage