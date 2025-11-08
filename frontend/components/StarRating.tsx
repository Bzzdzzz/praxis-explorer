'use client'

import { useState } from 'react'

interface StarRatingProps {
  value: number // 0.5 to 5.0
  onChange: (value: number) => void
  onHoverChange?: (value: number | null) => void
  readonly?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({ value, onChange, onHoverChange, readonly = false, size = 'md' }: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null)

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  }

  const sizeClass = sizeClasses[size]
  const displayValue = hoverValue ?? value

  const handleClick = (starValue: number) => {
    if (!readonly) {
      onChange(starValue)
    }
  }

  const handleMouseEnter = (starValue: number) => {
    if (!readonly) {
      setHoverValue(starValue)
      onHoverChange?.(starValue)
    }
  }

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverValue(null)
      onHoverChange?.(null)
    }
  }

  const renderStar = (position: number) => {
    const starNumber = position + 1
    const fullStars = Math.floor(displayValue)
    const remainder = displayValue - fullStars

    let fillPercentage = 0
    if (starNumber < fullStars) {
      fillPercentage = 100
    } else if (starNumber === fullStars) {
      fillPercentage = 100
    } else if (starNumber === fullStars + 1 && remainder > 0) {
      fillPercentage = 50
    }

    return (
      <div
        key={position}
        className={`relative ${readonly ? '' : 'cursor-pointer'}`}
        onMouseLeave={handleMouseLeave}
      >
        {/* Left half (0.5 star) */}
        <div
          className="absolute inset-0 w-1/2 z-10"
          onMouseEnter={() => handleMouseEnter(starNumber - 0.5)}
          onClick={() => handleClick(starNumber - 0.5)}
        />
        {/* Right half (full star) */}
        <div
          className="absolute inset-0 left-1/2 w-1/2 z-10"
          onMouseEnter={() => handleMouseEnter(starNumber)}
          onClick={() => handleClick(starNumber)}
        />

        {/* Star SVG with gradient fill */}
        <svg
          className={`${sizeClass} transition-colors pointer-events-none`}
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={`star-gradient-${position}`}>
              <stop offset={`${fillPercentage}%`} stopColor="#FBBF24" />
              <stop offset={`${fillPercentage}%`} stopColor="#374151" />
            </linearGradient>
          </defs>
          <path
            d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
            fill={`url(#star-gradient-${position})`}
            stroke={fillPercentage > 0 ? '#FBBF24' : '#4B5563'}
            strokeWidth="1"
          />
        </svg>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map(renderStar)}
    </div>
  )
}
