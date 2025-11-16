import React from 'react'
import { useLanguage } from '../hooks/useLanguage.tsx'
import { translations } from '../utils/translations'

const Conference: React.FC = () => {
  const { language } = useLanguage()
  const content = translations[language]

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          {content.conference.title}
        </h2>
        <div className="space-y-6">
          {content.conference.papers.map((paper, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 border-l-4 border-indigo-600"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {paper.title}
              </h3>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">{language === 'en' ? 'Authors:' : '作者：'}</span> {paper.authors}
              </p>
              <p className="text-gray-600 mb-2">
                <span className="font-medium">{language === 'en' ? 'Conference:' : '会议：'}</span> {paper.venue}
              </p>
              <p className="text-indigo-600 font-semibold">
                {paper.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Conference