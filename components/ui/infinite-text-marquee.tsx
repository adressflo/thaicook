'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface InfiniteTextMarqueeProps {
  text?: string
  link?: string
  speed?: number
  fontSize?: string
  textColor?: string
  hoverColor?: string
}

export const InfiniteTextMarquee: React.FC<InfiniteTextMarqueeProps> = ({
  text = "Let's Get Started",
  link = '#',
  speed = 30,
  fontSize = '2rem',
  textColor = '',
  hoverColor = '',
}) => {
  // Répéter le texte 10 fois pour un effet infini fluide
  const repeatedText = Array(10).fill(text).join(' • ') + ' •'

  return (
    <div className="relative w-full overflow-hidden">
      <motion.div
        className="whitespace-nowrap"
        animate={{
          x: [0, -1000],
          transition: {
            repeat: Infinity,
            duration: speed,
            ease: 'linear',
          },
        }}
      >
        <Link href={link as any} className="inline-block">
          <span
            className={`cursor-pointer font-bold tracking-tight py-4 m-0 transition-colors ${
              textColor ? '' : 'text-thai-green dark:text-thai-orange'
            } hover:text-thai-orange`}
            style={{
              fontSize,
              color: textColor || undefined,
            }}
          >
            {repeatedText}
          </span>
        </Link>
      </motion.div>
    </div>
  )
}
