import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
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
            src="https://trae-api-sg.mchost.guru/api/ide/v1/text_to_image?prompt=Professional%20academic%20portrait%2C%20clean%20background%2C%20formal%20attire%2C%20friendly%20smile%2C%20high%20quality%2C%20professional%20lighting&image_size=square"
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