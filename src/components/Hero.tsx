import React from 'react'
import { useLanguage } from '../hooks/useLanguage.tsx'
import { translations } from '../utils/translations'

const Hero: React.FC = () => {
  const { language } = useLanguage()
  const content = translations[language]

  const scrollToContact = () => {
    const element = document.getElementById('contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 pt-16">
      <div className="max-w-4xl mx-auto text-center">
        <div className="mb-8">
          <img
            src={import.meta.env.BASE_URL + 'profile.jpg'}
            alt="Profile"
            className="w-24 h-24 md:w-32 md:h-32 rounded-full mx-auto mb-6 object-cover shadow-lg"
          />
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
          {content.hero.title}
        </h1>
        <h2 className="text-xl md:text-2xl lg:text-3xl text-blue-600 mb-6">
          {content.hero.subtitle}
        </h2>
        <p className="text-base md:text-lg text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
          {content.hero.description}
        </p>
        <button 
          onClick={scrollToContact}
          className="bg-blue-600 text-white px-6 md:px-8 py-3 rounded-lg text-base md:text-lg font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-lg transform hover:scale-105"
        >
          {content.hero.contactButton}
        </button>
      </div>
    </section>
  )
}

export default Hero