import { v4 as uuidv4 } from 'uuid'

// Types for our session-based storage
export interface StoredConcept {
  id: string
  productName: string
  description: string
  keyClaims: string[]
  keyIngredients: string[]
  imageBase64?: string
  createdAt: string
}

export interface StoredSubmission {
  id: string
  productSpec: string
  language: 'en' | 'th'
  concepts: StoredConcept[]
  createdAt: string
}

// In-memory storage (will be cleared on server restart)
// In production, you might want to use Redis or similar
const sessionStore = new Map<string, StoredSubmission>()

// Auto-cleanup old submissions (older than 24 hours)
const CLEANUP_INTERVAL = 60 * 60 * 1000 // 1 hour
const SUBMISSION_TTL = 24 * 60 * 60 * 1000 // 24 hours

setInterval(() => {
  const now = Date.now()
  for (const [id, submission] of sessionStore.entries()) {
    if (now - new Date(submission.createdAt).getTime() > SUBMISSION_TTL) {
      sessionStore.delete(id)
    }
  }
}, CLEANUP_INTERVAL)

export class SessionStorage {
  /**
   * Store a new submission with concepts
   */
  static storeSubmission(
    productSpec: string,
    concepts: Omit<StoredConcept, 'id' | 'createdAt'>[],
    language: 'en' | 'th' = 'en'
  ): string {
    const submissionId = uuidv4()
    const now = new Date().toISOString()

    const storedConcepts: StoredConcept[] = concepts.map(concept => ({
      ...concept,
      id: uuidv4(),
      createdAt: now
    }))

    const submission: StoredSubmission = {
      id: submissionId,
      productSpec,
      language,
      concepts: storedConcepts,
      createdAt: now
    }

    sessionStore.set(submissionId, submission)
    return submissionId
  }

  /**
   * Retrieve a submission by ID
   */
  static getSubmission(submissionId: string): StoredSubmission | null {
    return sessionStore.get(submissionId) || null
  }

  /**
   * Update a concept with generated image
   */
  static updateConceptImage(submissionId: string, conceptId: string, imageBase64: string): boolean {
    const submission = sessionStore.get(submissionId)
    if (!submission) return false

    const concept = submission.concepts.find(c => c.id === conceptId)
    if (!concept) return false

    concept.imageBase64 = imageBase64
    sessionStore.set(submissionId, submission)
    return true
  }

  /**
   * Add image to all concepts in a submission
   */
  static addImagesToSubmission(submissionId: string, images: { conceptId: string; imageBase64: string }[]): boolean {
    const submission = sessionStore.get(submissionId)
    if (!submission) return false

    for (const { conceptId, imageBase64 } of images) {
      const concept = submission.concepts.find(c => c.id === conceptId)
      if (concept) {
        concept.imageBase64 = imageBase64
      }
    }

    sessionStore.set(submissionId, submission)
    return true
  }

  /**
   * Get storage statistics
   */
  static getStats() {
    const totalSubmissions = sessionStore.size
    const totalConcepts = Array.from(sessionStore.values())
      .reduce((total, submission) => total + submission.concepts.length, 0)

    return {
      totalSubmissions,
      totalConcepts,
      oldestSubmission: Math.min(...Array.from(sessionStore.values())
        .map(s => new Date(s.createdAt).getTime())),
      newestSubmission: Math.max(...Array.from(sessionStore.values())
        .map(s => new Date(s.createdAt).getTime()))
    }
  }

  /**
   * Clear all stored data (for testing/maintenance)
   */
  static clear(): void {
    sessionStore.clear()
  }

  /**
   * Clean up expired submissions manually
   */
  static cleanup(): number {
    const now = Date.now()
    let cleaned = 0

    for (const [id, submission] of sessionStore.entries()) {
      if (now - new Date(submission.createdAt).getTime() > SUBMISSION_TTL) {
        sessionStore.delete(id)
        cleaned++
      }
    }

    return cleaned
  }
}

// Export the storage instance
export default SessionStorage