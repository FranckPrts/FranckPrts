'use client'

import { useEffect, useState } from 'react'
import { TextEffect } from '@/components/ui/text-effect'
import { TextMorph } from '@/components/ui/text-morph'
import { cn } from '@/lib/utils'
import Link from 'next/link'

/** Enter compact above this; leave compact only below EXIT (hysteresis). */
const COMPACT_ENTER = 48
const COMPACT_EXIT = 8
/** Ignore scroll briefly after a toggle so header resize doesn't bounce the state. */
const SUPPRESS_MS = 180

const LABEL_CLASS =
  'text-black dark:text-white tonal:text-[var(--tonal-fg)]'

const MORPH_TRANSITION = {
  duration: 0.05,
  type: 'spring' as const,
  stiffness: 260,
  damping: 28,
  mass: 0.35,
}

const MORPH_VARIANTS = {
  initial: { opacity: 0, filter: 'blur(2px)' },
  animate: { opacity: 1, filter: 'blur(0px)' },
  exit: { opacity: 0, filter: 'blur(2px)' },
}

export function Header() {
  const [compact, setCompact] = useState(false)
  const [hasCompactedOnce, setHasCompactedOnce] = useState(false)

  useEffect(() => {
    let wasCompact = false
    let suppressUntil = 0

    const onScroll = () => {
      const now = performance.now()
      if (now < suppressUntil) return

      const y = window.scrollY
      const next = wasCompact ? y > COMPACT_EXIT : y > COMPACT_ENTER
      if (next === wasCompact) return

      wasCompact = next
      suppressUntil = now + SUPPRESS_MS
      setCompact(next)
      if (next) setHasCompactedOnce(true)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const showIntro = !compact && !hasCompactedOnce
  const label = compact ? 'FranckPrts' : 'Franck Porteous'

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center justify-between transition-[padding,margin,background-color,border-color] duration-200',
        compact
          ? 'mb-4 border-b border-zinc-200/80 bg-white/80 py-2 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/80 tonal:border-[var(--tonal-border)] tonal:bg-[var(--tonal-surface)]/80'
          : 'mb-8 border-b border-transparent py-0',
      )}
    >
      <div>
        <Link
          href="/"
          aria-label="Franck Porteous"
          className={cn(
            'relative block font-medium leading-none transition-[font-size] duration-200',
            compact ? 'text-lg' : 'text-4xl',
            LABEL_CLASS,
          )}
        >
          {showIntro ? (
            <TextEffect
              as="h1"
              preset="fade-in-blur"
              per="word"
              className={LABEL_CLASS}
              delay={0}
              speedReveal={1}
            >
              Franck Porteous
            </TextEffect>
          ) : (
            <TextMorph
              as="h1"
              className={LABEL_CLASS}
              variants={MORPH_VARIANTS}
              transition={MORPH_TRANSITION}
            >
              {label}
            </TextMorph>
          )}
        </Link>
      </div>
    </header>
  )
}
