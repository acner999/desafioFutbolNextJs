"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { Language, Translations } from '@/lib/types'
import esTranslations from './es.json'
import ptTranslations from './pt.json'

const translations: Record<Language, Translations> = {
  es: esTranslations as Translations,
  pt: ptTranslations as Translations,
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

function getNestedValue(obj: Translations, path: string): string {
  const keys = path.split('.')
  let current: string | Translations = obj
  
  for (const key of keys) {
    if (typeof current === 'object' && current !== null && key in current) {
      current = current[key]
    } else {
      return path
    }
  }
  
  return typeof current === 'string' ? current : path
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('es')
  
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('torneo-language', lang)
      document.documentElement.lang = lang
    }
  }, [])
  
  const t = useCallback((key: string): string => {
    return getNestedValue(translations[language], key)
  }, [language])
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export function useTranslation() {
  const { t } = useLanguage()
  return { t }
}
