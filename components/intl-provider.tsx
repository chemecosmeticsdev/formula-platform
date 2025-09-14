'use client'

import { ReactNode, useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { defaultLocale, type Locale } from '../lib/i18n/config'

// Import locale data
import enMessages from '../lib/i18n/locales/en.json'
import thMessages from '../lib/i18n/locales/th.json'

const messages = {
  en: enMessages,
  th: thMessages,
} as const

interface CustomIntlProviderProps {
  children: ReactNode
}

export default function CustomIntlProvider({ children }: CustomIntlProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Get locale from localStorage or browser language
    const savedLocale = localStorage.getItem('preferred-language')
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'th')) {
      setLocale(savedLocale as Locale)
    } else {
      // Detect browser language
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'th') {
        setLocale('th')
      }
    }
  }, [])

  return (
    <IntlProvider
      locale={locale}
      messages={messages[locale] as any}
      defaultLocale={defaultLocale}
    >
      {children}
    </IntlProvider>
  )
}

// Custom hook to get current locale
export function useCurrentLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(defaultLocale)

  useEffect(() => {
    const savedLocale = localStorage.getItem('preferred-language')
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'th')) {
      setLocale(savedLocale as Locale)
    } else {
      const browserLang = navigator.language.split('-')[0]
      if (browserLang === 'th') {
        setLocale('th')
      }
    }
  }, [])

  return locale
}