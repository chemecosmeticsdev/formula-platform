
'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { CheckCircle, Beaker, ArrowLeft, Loader2, AlertCircle } from 'lucide-react'
import { useIntl, FormattedMessage } from 'react-intl'

interface ProductConcept {
  id: string
  productName: string
  description: string
  keyClaims: string[]
  keyIngredients: string[]
  imageBase64?: string
}

function ResultsContent() {
  const [results, setResults] = useState<ProductConcept[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [originalSpec, setOriginalSpec] = useState<string>('')

  const searchParams = useSearchParams()
  const submissionId = searchParams?.get('id')
  const intl = useIntl()

  useEffect(() => {
    if (!submissionId) {
      setError('No submission ID provided')
      setIsLoading(false)
      return
    }

    fetchResults()
  }, [submissionId])

  const fetchResults = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/results?id=${submissionId}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to fetch results')
      }

      setResults(data?.results || [])
      setOriginalSpec(data?.originalSpec || '')
    } catch (error) {
      console.error('Fetch results error:', error)
      setError(error instanceof Error ? error.message : 'Failed to load results')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-8">
            <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <FormattedMessage id="results.loading.title" />
          </h1>
          <p className="text-gray-600">
            <FormattedMessage id="results.loading.subtitle" />
          </p>
          
          {/* Loading skeleton */}
          <div className="mt-12 grid md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-8 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="space-y-2 mb-6">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-8">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <FormattedMessage id="results.error.title" />
          </h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <div className="space-x-4">
            <button
              onClick={fetchResults}
              className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
            >
              <FormattedMessage id="results.error.tryAgain" />
            </button>
            <Link
              href="/generate"
              className="inline-flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <FormattedMessage id="common.backToGenerate" />
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Beaker className="w-12 h-12 text-teal-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <FormattedMessage id="results.title" />
          </h1>
          {originalSpec && (
            <div className="max-w-3xl mx-auto">
              <p className="text-sm text-gray-500 mb-2">
                <FormattedMessage id="results.basedOn" />
              </p>
              <div className="bg-gray-50 rounded-lg p-4 text-left text-gray-700">
                "{originalSpec}"
              </div>
            </div>
          )}
        </div>

        {results?.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {results.map((concept) => (
              <div
                key={concept.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
              >
                {/* Product Image */}
                {concept.imageBase64 && (
                  <div className="relative h-48 bg-gray-100">
                    <Image
                      src={`data:image/png;base64,${concept.imageBase64}`}
                      alt={concept.productName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}

                <div className="p-8">
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {concept.productName}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                      {concept.description}
                    </p>
                  </div>

                {concept.keyClaims?.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      <FormattedMessage id="results.concept.keyClaims" />
                    </h3>
                    <ul className="space-y-2">
                      {concept.keyClaims.map((claim, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-teal-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{claim}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {concept.keyIngredients?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      <FormattedMessage id="results.concept.keyIngredients" />
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {concept.keyIngredients.map((ingredient, index) => (
                        <span 
                          key={index}
                          className="px-3 py-1 bg-teal-100 text-teal-800 text-sm font-medium rounded-full"
                        >
                          {ingredient}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-8">
              <FormattedMessage id="results.empty.message" />
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              <FormattedMessage id="results.empty.tryAgain" />
            </Link>
          </div>
        )}

        <div className="text-center">
          <Link
            href="/generate"
            className="inline-flex items-center px-8 py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-3" />
            <FormattedMessage id="common.newConcepts" />
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-8">
            <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            <FormattedMessage id="common.loading" />
          </h1>
        </div>
      </div>
    }>
      <ResultsContent />
    </Suspense>
  )
}
