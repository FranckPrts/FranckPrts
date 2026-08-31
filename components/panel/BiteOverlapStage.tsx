'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { BiteCard } from '@/components/panel/BiteCard'
import { cn } from '@/lib/utils'

export type BiteOverlapMedia = {
  image?: string
  imageAlt?: string
  video?: string
}

type FocusLayer = 'bite' | 'media'

type BiteOverlapStageProps = {
  id: string
  title: string
  media: BiteOverlapMedia
  onClose: () => void
}

/** Soft ease for bite layer z/opacity — media size uses CSS width/height. */
const LAYER_TRANSITION = {
  type: 'spring' as const,
  stiffness: 220,
  damping: 28,
  mass: 0.8,
}

/**
 * Overlapping photo + bite with focus swap.
 * Default: bite on top, media peeks. Click peek → media covers more of the bite
 * (remaining strip is the return tab). Click tab → bite again.
 */
export function BiteOverlapStage({
  id,
  title,
  media,
  onClose,
}: BiteOverlapStageProps) {
  const [focus, setFocus] = useState<FocusLayer>('bite')
  const biteFocused = focus === 'bite'
  const imageSrc = media.image?.trim()
  const videoSrc = media.video?.trim()
  const label = media.imageAlt?.trim() || title || 'Project preview'

  return (
    <div className="relative h-[min(85vh,40rem)] w-[min(100vw-1.5rem,56rem)] sm:h-[min(80vh,34rem)]">
      <button
        type="button"
        aria-label={
          biteFocused ? 'Bring photo to front' : 'Project photo (focused)'
        }
        disabled={!biteFocused}
        onClick={() => setFocus('media')}
        className={cn(
          'absolute left-0 top-0 overflow-hidden rounded-2xl bg-zinc-200 p-0 text-left shadow-lg ring-1 ring-black/10 dark:bg-zinc-800 dark:ring-white/10 tonal:bg-[var(--tonal-surface-raised)] tonal:ring-[var(--tonal-border)]',
          // Animate the crop frame only — image stays object-cover, never scaled
          'transition-[width,height,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          biteFocused
            ? 'z-10 h-[48%] w-[86%] opacity-80 sm:h-full sm:w-[58%]'
            : 'z-30 h-[62%] w-full opacity-100 sm:h-full sm:w-[78%]',
          biteFocused && 'cursor-pointer hover:opacity-100',
        )}
      >
        {videoSrc ? (
          <video
            src={videoSrc}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none h-full w-full object-cover"
          />
        ) : imageSrc ? (
          <img
            src={imageSrc}
            alt={label}
            className="pointer-events-none h-full w-full object-cover"
            draggable={false}
          />
        ) : null}
      </button>

      <motion.div
        role={biteFocused ? undefined : 'button'}
        tabIndex={biteFocused ? undefined : 0}
        aria-label={biteFocused ? undefined : 'Bring bite back to front'}
        onClick={
          biteFocused
            ? undefined
            : (e) => {
                e.stopPropagation()
                setFocus('bite')
              }
        }
        onKeyDown={
          biteFocused
            ? undefined
            : (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  setFocus('bite')
                }
              }
        }
        className={cn(
          'absolute overflow-hidden rounded-3xl shadow-xl ring-1 ring-zinc-200/70 transition-transform duration-300 ease-out dark:ring-zinc-700/70 tonal:ring-[var(--tonal-border)]',
          // Original bite reading width (32rem)
          'bottom-0 left-1/2 w-[min(100%,32rem)] -translate-x-1/2',
          'sm:bottom-auto sm:left-auto sm:right-0 sm:top-1/2 sm:translate-x-0 sm:-translate-y-1/2',
          // Slight nudge when tabbed so the peek strip is obvious past the photo
          !biteFocused && 'translate-y-3 sm:translate-x-3 sm:translate-y-[-50%]',
          !biteFocused && 'cursor-pointer',
        )}
        initial={false}
        animate={{
          zIndex: biteFocused ? 30 : 20,
          scale: biteFocused ? 1 : 0.97,
          opacity: biteFocused ? 1 : 0.92,
        }}
        transition={LAYER_TRANSITION}
      >
        <div
          className={cn(
            'max-h-[min(70vh,32rem)] overflow-y-auto overscroll-contain',
            !biteFocused && 'pointer-events-none select-none',
          )}
          aria-hidden={!biteFocused}
        >
          <BiteCard id={id} title={title} onClose={onClose} />
        </div>
      </motion.div>
    </div>
  )
}
