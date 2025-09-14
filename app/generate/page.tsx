
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Send, Lightbulb } from 'lucide-react'
import { useIntl, FormattedMessage } from 'react-intl'
import { useCurrentLocale } from '../../components/intl-provider'

export default function GeneratePage() {
  const [productSpec, setProductSpec] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const intl = useIntl()
  const currentLocale = useCurrentLocale()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!productSpec?.trim()) {
      alert(intl.formatMessage({ id: 'generate.form.validation.required' }) || 'Please describe your product concept')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productSpec: productSpec.trim(),
          language: currentLocale
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data?.error || 'Failed to generate concepts')
      }

      if (data?.submissionId) {
        router.push(`/results?id=${data.submissionId}`)
      } else {
        throw new Error('No submission ID received')
      }
    } catch (error) {
      console.error('Generation error:', error)
      alert(error instanceof Error ? error.message : 'Failed to generate concepts. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Lightbulb className="w-12 h-12 text-teal-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <FormattedMessage id="generate.title" />
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            <FormattedMessage id="generate.subtitle" />
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
              <label
                htmlFor="productSpec"
                className="block text-lg font-semibold text-gray-900"
              >
                <FormattedMessage id="generate.form.label" />
              </label>
              <textarea
                id="productSpec"
                value={productSpec}
                onChange={(e) => setProductSpec(e.target.value)}
                placeholder={intl.formatMessage({ id: 'generate.form.placeholder' })}
                className="w-full h-48 px-6 py-4 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:ring-0 text-gray-900 text-lg resize-none transition-colors"
                disabled={isLoading}
                required
              />
              <div className="text-sm text-gray-600">
                <FormattedMessage id="generate.form.helpText" />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isLoading || !productSpec?.trim()}
                className="inline-flex items-center px-10 py-4 bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-xl font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    <FormattedMessage id="generate.form.generating" />
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6 mr-3" />
                    <FormattedMessage id="generate.form.generateButton" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-12 bg-teal-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-teal-900 mb-4">
            <FormattedMessage id="generate.tips.title" />
          </h3>
          <ul className="space-y-2 text-teal-800">
            {(intl.formatMessage({ id: 'generate.tips.items' }, { returnObjects: true }) as unknown as string[]).map((tip: string, index: number) => (
              <li key={index}>• {tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
