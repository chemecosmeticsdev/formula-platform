'use client'

import { ReactNode, useEffect, useState } from 'react'
import { IntlProvider } from 'react-intl'
import { defaultLocale, type Locale } from '../lib/i18n/config'
import { getMessages } from '../lib/i18n/messages'

interface CustomIntlProviderProps {
  children: ReactNode
}

export default function CustomIntlProvider({ children }: CustomIntlProviderProps) {
  const [locale, setLocale] = useState<Locale>(defaultLocale)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
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

  // During SSR, use default locale to avoid hydration mismatch
  const currentLocale = mounted ? locale : defaultLocale
  const messages = getMessages(currentLocale)

  return (
    <IntlProvider
      locale={currentLocale}
      messages={messages}
      defaultLocale={defaultLocale}
      onError={(error) => {
        // Log errors but don't throw to avoid breaking the app
        console.warn('IntlProvider error:', error)
      }}
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