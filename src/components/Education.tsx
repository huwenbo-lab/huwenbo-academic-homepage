import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { translations } from '../utils/translations'

const Education: React.FC = () => {
  const { language } = useLanguage()
  const content = translations[language]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          {content.education.title}
        </h2>
        <div className="space-y-8">
          {content.education.degrees.map((edu, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">
                  {edu.degree}
                </h3>
                <span className="text-blue-600 font-semibold bg-white px-3 py-1 rounded-full text-sm">
                  {edu.year}
                </span>
              </div>
              <p className="text-gray-700 font-medium mb-2">
                {edu.institution}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {edu.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Education