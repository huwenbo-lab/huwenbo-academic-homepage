import { create } from 'zustand'

export type Language = 'en' | 'zh'

interface LanguageState {
  language: Language
  setLanguage: (lang: Language) => void
}

export const useLanguage = create<LanguageState>((set) => ({
  language: 'en',
  setLanguage: (lang) => set({ language: lang }),
}))