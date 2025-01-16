'use client'

import { useEffect, useState } from 'react'
import { 
  Mic, 
  Brain, 
  BookOpen,
  Zap as Lightning,
  ChevronRight 
} from 'lucide-react'

const LandingPage = () => {
  const [typedText, setTypedText] = useState('')
  const fullText = 'Your AI powered studybuddy is here'
  const [isVisible, setIsVisible] = useState(false)

  // Initialize visibility on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Typing animation effect
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

  // Features data
  const features = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Smart Recording",
      description: "Crystal clear audio capture with automatic noise reduction"
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "AI Transcription",
      description: "Real-time transcription with 99% accuracy in multiple languages"
    },
    {
      icon: <Lightning className="w-6 h-6" />,
      title: "Instant Summaries",
      description: "Get key points and summaries instantly after recording"
    }
  ]

  return (
    <div className="min-h-screen bg-[#14171F]">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Content */}
          <div className="space-y-8">
            {/* Animated Subtitle */}
            <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
              <h2 className="text-xl md:text-2xl font-light tracking-wide animate-float
                           bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 
                           text-transparent bg-clip-text bg-300% animate-shimmer">
                {typedText}
                <span className="cursor">|</span>
              </h2>
            </div>

            {/* Main Headline */}
            <div className={`space-y-2 transform transition-all duration-1000 delay-300 
                           ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
                Make Learning
              </h1>
              <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r 
                           from-blue-400 to-blue-600 text-transparent bg-clip-text">
                Easier
              </h1>
            </div>

            {/* Description */}
            <p className={`text-lg text-gray-300 max-w-2xl font-light leading-relaxed
                          transform transition-all duration-1000 delay-500 
                          ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              Stop struggling with manual note-taking. Let AI transform your lectures into 
              organized study materials, transcriptions, and summaries - all in real-time.
            </p>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-4 pt-4
                           transform transition-all duration-1000 delay-700 
                           ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <button className="px-8 py-4 bg-blue-500 text-white rounded-xl text-lg font-medium 
                               hover:bg-blue-600 transition-all duration-300 
                               shadow-lg shadow-blue-500/25 hover:scale-105
                               animate-buttonPulse">
                Start Learning Smarter
              </button>
              <button className="px-8 py-4 border-2 border-blue-500/30 text-blue-400 rounded-xl 
                               hover:bg-blue-500/10 transition-all duration-300 text-lg font-medium 
                               group flex items-center justify-center hover:border-blue-500">
                Watch Demo
                <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Side - Dashboard Preview */}
          <div className={`relative h-[600px] bg-[#1a1f2e] rounded-2xl overflow-hidden 
                          shadow-2xl border border-gray-800 transform transition-all 
                          duration-1000 delay-1000 animate-float 
                          ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent animate-gradient" />
            {/* Add your app preview/demo here */}
            <div className="relative z-10 flex items-center justify-center h-full">
              <p className="text-gray-400">Dashboard Preview</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-[#1a1f2e] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Everything You Need To Excel
            </h2>
            <p className="text-gray-400">
              Powerful features designed to transform your learning experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card p-6 rounded-xl">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-500/10 to-blue-600/10 p-12 rounded-2xl 
                         border border-blue-500/20 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-gray-400 mb-8">
              Join today and experience the future of study assistance.
            </p>
            <button className="px-8 py-4 bg-blue-500 text-white rounded-xl text-lg font-medium 
                             hover:bg-blue-600 transition-all duration-300 
                             shadow-lg shadow-blue-500/25">
              Get Started For Free
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LandingPage