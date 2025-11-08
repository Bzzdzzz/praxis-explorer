'use client'

import { useState, useEffect } from 'react'
import StarRating from './StarRating'
import { useRating } from '@/hooks/useRating'
import { useAccount } from 'wagmi'

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  agentId: number
  agentName: string
}

export default function RatingModal({ isOpen, onClose, agentId, agentName }: RatingModalProps) {
  const [rating, setRating] = useState(3.5)
  const [displayRating, setDisplayRating] = useState(3.5)
  const [isCancelled, setIsCancelled] = useState(false)
  const { submitRating, isPending, isConfirming, isConfirmed, error } = useRating()
  const { isConnected } = useAccount()

  useEffect(() => {
    if (isConfirmed) {
      // Close modal after successful confirmation
      setTimeout(() => {
        onClose()
        setRating(3.5) // Reset rating
        setDisplayRating(3.5)
        setIsCancelled(false)
      }, 2000)
    }
  }, [isConfirmed, onClose])

  useEffect(() => {
    // Reset cancelled state when modal opens
    if (isOpen) {
      setIsCancelled(false)
    }
  }, [isOpen])

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
    setDisplayRating(newRating)
  }

  const handleHoverChange = (hoverValue: number | null) => {
    setDisplayRating(hoverValue ?? rating)
  }

  const handleSubmit = async () => {
    try {
      setIsCancelled(false)
      await submitRating(agentId, rating)
    } catch (err: any) {
      console.error('Failed to submit rating:', err)
      
      // Check if user cancelled the transaction
      const errorMessage = err?.message?.toLowerCase() || ''
      if (
        errorMessage.includes('user rejected') ||
        errorMessage.includes('user denied') ||
        errorMessage.includes('user cancelled') ||
        errorMessage.includes('transaction was rejected') ||
        err?.code === 4001 || // MetaMask user rejection code
        err?.code === 'ACTION_REJECTED'
      ) {
        setIsCancelled(true)
      }
    }
  }

  const getScoreFromStars = (stars: number) => Math.round(stars * 20)

  // Check if error is a cancellation
  const isUserCancellation = error && (
    error.message?.toLowerCase().includes('user rejected') ||
    error.message?.toLowerCase().includes('user denied') ||
    error.message?.toLowerCase().includes('user cancelled') ||
    error.message?.toLowerCase().includes('transaction was rejected') ||
    (error as any)?.code === 4001 ||
    (error as any)?.code === 'ACTION_REJECTED'
  )
  
  const isActualError = error && !isUserCancellation && !isCancelled

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-gradient-to-br from-prxs-black-secondary to-prxs-black border border-prxs-charcoal rounded-2xl p-6 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Rate Agent</h2>
            <p className="text-prxs-gray text-sm">{agentName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-prxs-gray hover:text-white transition-colors"
            disabled={isPending || isConfirming}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!isConnected ? (
          <div className="text-center py-8">
            <p className="text-prxs-gray mb-4">Please connect your wallet to rate this agent</p>
          </div>
        ) : isConfirmed ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white font-semibold mb-2">Rating Submitted!</p>
            <p className="text-prxs-gray text-sm">Your feedback has been recorded on-chain</p>
          </div>
        ) : (
          <>
            <div className="bg-prxs-charcoal/30 rounded-xl p-6 mb-6">
              <p className="text-prxs-gray text-sm text-center mb-4">Select your rating</p>
              <div className="flex justify-center mb-4">
                <StarRating 
                  value={rating} 
                  onChange={handleRatingChange}
                  onHoverChange={handleHoverChange}
                  size="lg" 
                />
              </div>
              <div className="text-center">
                <span className="text-3xl font-bold text-white">{displayRating.toFixed(1)}</span>
                <span className="text-prxs-gray ml-2">/ 5.0</span>
              </div>
            </div>

            {isCancelled && (
              <div className="bg-prxs-charcoal/50 border border-prxs-gray/20 rounded-lg p-4 mb-4">
                <p className="text-prxs-gray-light text-sm text-center">
                  Transaction cancelled. You can adjust your rating and try again.
                </p>
              </div>
            )}

            {isActualError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                <p className="text-red-400 text-sm">
                  {error.message || 'Failed to submit rating. Please try again.'}
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 bg-prxs-charcoal text-white rounded-lg hover:bg-prxs-charcoal/80 transition-colors disabled:opacity-50"
                disabled={isPending || isConfirming}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isPending || isConfirming}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-prxs-orange to-prxs-cyan text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 font-semibold"
              >
                {isPending || isConfirming ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {isConfirming ? 'Confirming...' : 'Submitting...'}
                  </span>
                ) : (
                  'Submit Rating'
                )}
              </button>
            </div>

            <p className="text-xs text-prxs-gray text-center mt-4">
              Your rating will be stored on-chain
            </p>
          </>
        )}
      </div>
    </div>
  )
}
