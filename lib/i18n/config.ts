export const defaultLocale = 'en'
export const locales = ['en', 'th'] as const
export type Locale = (typeof locales)[number]

export const localeNames: Record<Locale, string> = {
  en: 'English',
  th: 'ไทย'
}

// Get locale from request or default
export function getLocale(acceptLanguage?: string): Locale {
  if (!acceptLanguage) return defaultLocale

  // Parse Accept-Language header
  const preferredLocales = acceptLanguage
    .split(',')
    .map(lang => lang.split(';')[0].trim().toLowerCase())

  for (const preferred of preferredLocales) {
    if (locales.includes(preferred as Locale)) {
      return preferred as Locale
    }
    // Check for language without region (e.g., 'th' from 'th-TH')
    const langOnly = preferred.split('-')[0]
    if (locales.includes(langOnly as Locale)) {
      return langOnly as Locale
    }
  }

  return defaultLocale
}