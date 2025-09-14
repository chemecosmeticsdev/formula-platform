'use client'

import { useState, useEffect } from 'react'
import LanguageSwitcher from './language-switcher'

export default function ClientLanguageSwitcher() {
  const [mounted, setMounted] = useState(false)
  const [currentLocale, setCurrentLocale] = useState<'en' | 'th'>('en')

  useEffect(() => {
    setMounted(true)
    const savedLocale = localStorage.getItem('preferred-language')
    if (savedLocale && (savedLocale === 'en' || savedLocale === 'th')) {
      setCurrentLocale(savedLocale as 'en' | 'th')
    }
  }, [])

  if (!mounted) {
    return <div className="w-24 h-10 bg-gray-100 rounded-lg animate-pulse" />
  }

  return <LanguageSwitcher currentLocale={currentLocale} />
}