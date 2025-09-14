'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { ChevronDown, Globe } from 'lucide-react'
import { locales, localeNames, type Locale } from '../lib/i18n/config'

interface LanguageSwitcherProps {
  currentLocale: Locale
  className?: string
}

export default function LanguageSwitcher({ currentLocale, className = '' }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLanguageChange = (locale: Locale) => {
    // Store the selected language in localStorage
    localStorage.setItem('preferred-language', locale)

    // Update the URL with the new locale (if using URL-based routing)
    // For now, we'll just reload the page to trigger re-render
    setIsOpen(false)
    window.location.reload()
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
      >
        <Globe className="w-4 h-4 mr-2 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {localeNames[currentLocale]}
        </span>
        <ChevronDown
          className={`w-4 h-4 ml-2 text-gray-600 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 z-20 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="py-1">
              {locales.map((locale) => (
                <button
                  key={locale}
                  onClick={() => handleLanguageChange(locale)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                    locale === currentLocale
                      ? 'bg-teal-50 text-teal-700 font-medium'
                      : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{localeNames[locale]}</span>
                    {locale === currentLocale && (
                      <div className="w-2 h-2 bg-teal-500 rounded-full" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}