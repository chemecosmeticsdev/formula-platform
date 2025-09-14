
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight, Beaker, Sparkles, Target } from 'lucide-react'
import { useIntl, FormattedMessage } from 'react-intl'

export default function HomePage() {
  const intl = useIntl()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="relative w-full h-full bg-gradient-to-br from-teal-50 to-blue-50">
            <Image
              src="https://c8.alamy.com/comp/2R1C64A/macro-white-smooth-rotate-cosmetic-texture-of-face-cream-milk-or-yogurt-abstract-background-3d-rendering-2R1C64A.jpg"
              alt="Cosmetic research laboratory"
              fill
              className="object-cover opacity-20"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/80 to-transparent" />
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <div className="flex items-center justify-center mb-6">
              <Beaker className="w-12 h-12 text-teal-500 mr-4" />
              <Sparkles className="w-8 h-8 text-teal-400" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              <FormattedMessage
                id="home.title"
                values={{
                  formulation: <span className="text-teal-600">
                    <FormattedMessage id="home.formulation" />
                  </span>
                }}
              />
            </h1>

            <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              <FormattedMessage
                id="home.subtitle"
                values={{
                  cosmetics: <strong>
                    <FormattedMessage id="home.cosmetics" />
                  </strong>
                }}
              />
            </p>

            <div className="pt-8">
              <Link
                href="/generate"
                className="inline-flex items-center px-12 py-6 bg-teal-600 hover:bg-teal-700 text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <Target className="w-6 h-6 mr-3" />
                <FormattedMessage id="home.generateButton" />
                <ChevronRight className="w-6 h-6 ml-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Beaker className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                <FormattedMessage id="home.features.aiResearch.title" />
              </h3>
              <p className="text-gray-700">
                <FormattedMessage id="home.features.aiResearch.description" />
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                <FormattedMessage id="home.features.targetedSolutions.title" />
              </h3>
              <p className="text-gray-700">
                <FormattedMessage id="home.features.targetedSolutions.description" />
              </p>
            </div>

            <div className="text-center p-8 bg-gray-50 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                <FormattedMessage id="home.features.innovationReady.title" />
              </h3>
              <p className="text-gray-700">
                <FormattedMessage id="home.features.innovationReady.description" />
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
