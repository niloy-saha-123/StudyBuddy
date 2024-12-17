'use client'

import { useEffect, useState } from 'react'

const LandingPage = () => {
  const [typedText, setTypedText] = useState('')
  const fullText = 'Your AI powered studybuddy is here'

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setTypedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [])

  return (
    <div className="min-h-screen animated-bg">
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-transparent to-transparent pointer-events-none" />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side */}
          <div className="space-y-8 relative">
            {/* Typing Animation */}
            <div className="typing-container">
              <h2 className="text-xl md:text-2xl font-light text-blue-300 tracking-wide">
                {typedText}
                <span className="cursor">|</span>
              </h2>
            </div>

            {/* Main Headline */}
            <div className="space-y-2">
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                Make Learning
              </h1>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 text-transparent bg-clip-text">
                Easier
              </h1>
            </div>

            {/* Description */}
            <p className="text-lg text-gray-300 max-w-2xl font-light leading-relaxed">
              <strong>
                Transform your lectures into organized study materials instantly
                with AI-powered note-taking and flashcard generation.
              </strong>
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="px-8 py-4 glass-button text-white rounded-xl text-lg font-medium hover:shadow-blue-400/25 transition-all duration-300">
                Get Started
              </button>
              <button className="px-8 py-4 border-2 border-blue-500/30 text-blue-400 rounded-xl hover:bg-blue-500/10 transition-all duration-300 text-lg font-medium group">
                See How It Works
                <span className="inline-block transition-transform group-hover:translate-x-1 ml-2">
                  →
                </span>
              </button>
            </div>
          </div>

          {/* Right Side - Dashboard Preview */}
          <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-white flex items-center justify-center">
            <div className="text-gray-600 font-medium">Dashboard Preview</div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage
