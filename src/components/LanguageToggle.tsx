import React from 'react'
import { useLanguage } from '../hooks/useLanguage'
import { translations } from '../utils/translations'

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useLanguage()
  
  const toggleLanguage = () => {
    const newLang = language === 'en' ? 'zh' : 'en'
    setLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg"
    >
      {translations[language].nav.language}
    </button>
  )
}

export default LanguageToggle