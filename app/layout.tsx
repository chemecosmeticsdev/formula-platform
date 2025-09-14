
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import CustomIntlProvider from '@/components/intl-provider'
import ClientLanguageSwitcher from '@/components/client-language-switcher'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'X Formula Platform',
  description: 'AI-powered cosmetics ingredient research platform for B2B customers',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <CustomIntlProvider>
            <div className="min-h-screen bg-gray-50">
              <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
                <div className="max-w-6xl mx-auto px-6 py-4">
                  <div className="flex items-center justify-between">
                    <a
                      href="/"
                      className="text-xl font-bold text-gray-900 hover:text-teal-600 transition-colors"
                    >
                      X FORMULA PLATFORM
                    </a>
                    <ClientLanguageSwitcher />
                  </div>
                </div>
              </header>
              <main>
                {children}
              </main>
              <footer className="bg-white border-t border-gray-200 mt-20">
                <div className="max-w-6xl mx-auto px-6 py-8">
                  <div className="text-center text-gray-600">
                    © 2025 X Formula Platform. All rights reserved.
                  </div>
                </div>
              </footer>
            </div>
          </CustomIntlProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
