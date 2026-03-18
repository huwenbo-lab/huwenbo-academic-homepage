import React from 'react'
import { useLanguage } from '../hooks/useLanguage.tsx'
import { translations } from '../utils/translations'

const Contact: React.FC = () => {
  const { language } = useLanguage()
  const content = translations[language]

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">
          {content.contact.title}
        </h2>
        <div className="max-w-2xl mx-auto text-center space-y-6">
          {content.contact.phone && (
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h3a1 1 0 011 .78l1 4a1 1 0 01-.52 1.14l-2 1a11.06 11.06 0 004.58 4.58l1-2a1 1 0 011.14-.52l4 1a1 1 0 01.78 1V17a1 1 0 01-1 1h-3a1 1 0 01-1-.78l-1-4a1 1 0 01.52-1.14l2-1A13.06 13.06 0 016.3 6.3l-1 2A1 1 0 014.14 9L0 8a1 1 0 01-1-.78V4a1 1 0 011-1h2z" />
              </svg>
              <span>{content.contact.phone}</span>
            </div>
          )}
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <a 
              href={`mailto:${content.contact.email}`}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-200"
            >
              {content.contact.email}
            </a>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{content.contact.office}</span>
          </div>
          
          <div className="flex items-center justify-center space-x-3">
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
            </svg>
            <span>{content.contact.university}</span>
          </div>
          {content.contact.address && (
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span>{content.contact.address}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Contact