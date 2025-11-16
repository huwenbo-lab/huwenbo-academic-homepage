import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type Language = 'en' | 'zh'

interface LanguageContextValue {
  language: Language
  setLanguage: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getInitial = (): Language => {
    const saved = typeof window !== 'undefined' ? (localStorage.getItem('language') as Language | null) : null
    if (saved === 'en' || saved === 'zh') return saved
    const nav = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en'
    return nav.startsWith('zh') ? 'zh' : 'en'
  }

  const [language, setLanguage] = useState<Language>(getInitial)

  useEffect(() => {
    try {
      localStorage.setItem('language', language)
    } catch {}
  }, [language])

  const value = useMemo(() => ({ language, setLanguage }), [language])
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextValue => {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider')
  return ctx
}