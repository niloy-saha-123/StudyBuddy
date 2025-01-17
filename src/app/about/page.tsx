'use client'

import { Rocket, Users, Clock, Shield } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#14171F] pt-20">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-6">
            Revolutionizing The Way Students Learn
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            StudyBuddy is an AI-powered learning assistant that helps students transform
            their lecture recordings into organized study materials.
          </p>
        </div>
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
              {[
                {
                  icon: <Rocket className="w-8 h-8" />,
                  title: "Innovation",
                  description: "Cutting-edge AI technology"
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Community",
                  description: "Built for students, by students"
                },
                {
                  icon: <Clock className="w-8 h-8" />,
                  title: "Efficiency",
                  description: "Save hours on note-taking"
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Privacy",
                  description: "Your data stays yours"
                }
              ].map((item, index) => (
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

      {/* Team Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">
              Meet Our Team
            </h2>
            <p className="text-gray-400">
              A dedicated group of innovators passionate about education and technology.
            </p>
          </div>
          {/* Add team members here if needed */}
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-[#1a1f2e] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Get In Touch
          </h2>
          <p className="text-gray-400 mb-8 max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. Reach out to our team
            and we'll get back to you as soon as possible.
          </p>
          <button className="px-8 py-4 bg-blue-500 text-white rounded-xl text-lg 
                           font-medium hover:bg-blue-600 transition-all duration-300">
            Contact Us
          </button>
        </div>
      </section>
    </div>
  )
}