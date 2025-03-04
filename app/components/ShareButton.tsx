'use client'

import { Share2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Language } from '../utils/translations'

interface ShareButtonProps {
  language: Language
}

export default function ShareButton({ language }: ShareButtonProps) {
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setCanNativeShare(!!navigator.share)
  }, [])

  const handleShareClick = async () => {
    if (canNativeShare) {
      try {
        await navigator.share({
          title: 'InnoCard',
          url: window.location.href
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href)
      } catch (err) {
        console.error('Error copying to clipboard:', err)
      }
    }
  }

  return (
    <button
      onClick={handleShareClick}
      className="fixed bottom-8 right-8 z-50 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-500 dark:to-cyan-400 text-white p-3.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
      aria-label="Share"
    >
      <Share2 className="w-5 h-5" />
    </button>
  )
} 