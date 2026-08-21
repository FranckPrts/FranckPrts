'use client'

import { useLayoutEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { SPLIT_HANDLE_WIDTH } from './useSplitDrag'

const FADE_IN = { duration: 0.15, ease: 'easeOut' } as const
const FADE_OUT = { duration: 0.22, ease: 'easeOut' } as const

type LayoutBox = {
  left: number
  width: number
}

type SplitPreviewOverlayProps = {
  visible: boolean
  layoutRef: React.RefObject<HTMLElement | null>
  leftPaneRef: React.RefObject<HTMLDivElement | null>
  handlePillRef: React.RefObject<HTMLDivElement | null>
  initialIndexWidth: number
  /** Viewport Y where the grip should start (pointer down). */
  initialHandleY: number
}

function measureLayout(layoutRef: React.RefObject<HTMLElement | null>): LayoutBox {
  const rect = layoutRef.current?.getBoundingClientRect()
  if (!rect) {
    return { left: 0, width: typeof window !== 'undefined' ? window.innerWidth : 0 }
  }
  return { left: rect.left, width: rect.width }
}

export function SplitPreviewOverlay({
  visible,
  layoutRef,
  leftPaneRef,
  handlePillRef,
  initialIndexWidth,
  initialHandleY,
}: SplitPreviewOverlayProps) {
  const [box, setBox] = useState<LayoutBox>(() => measureLayout(layoutRef))
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  useLayoutEffect(() => {
    if (!visible) return

    const sync = () => setBox(measureLayout(layoutRef))
    sync()

    window.addEventListener('resize', sync)
    const ro =
      typeof ResizeObserver !== 'undefined' && layoutRef.current
        ? new ResizeObserver(sync)
        : null
    if (layoutRef.current && ro) ro.observe(layoutRef.current)

    return () => {
      window.removeEventListener('resize', sync)
      ro?.disconnect()
    }
  }, [visible, layoutRef])

  if (!mounted) return null

  return createPortal(
    <AnimatePresence>
      {visible && (
        <motion.div
          key="split-preview"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: FADE_IN }}
          exit={{ opacity: 0, transition: FADE_OUT }}
          className="pointer-events-none fixed inset-0 z-[60] hidden lg:block"
          aria-hidden
        >
          <div
            className={cn(
              'absolute inset-0 backdrop-blur-md',
              'bg-white/92',
              'dark:bg-zinc-950/92',
              'tonal:bg-[color-mix(in_oklab,var(--tonal-surface)_92%,transparent)]',
            )}
          />

          <div
            className="absolute top-0 flex h-full pl-12"
            style={{ left: box.left, width: box.width }}
          >
            <div
              ref={leftPaneRef}
              className={cn(
                'my-4 shrink-0 rounded-2xl border shadow-sm',
                'border-zinc-300 bg-zinc-50',
                'dark:border-zinc-700 dark:bg-zinc-900',
                'tonal:border-[var(--tonal-border)] tonal:bg-[var(--tonal-surface-sunken)]',
              )}
              style={{ width: initialIndexWidth }}
            />

            {/* Same pill as SplitHandle — follows pointer Y via ref */}
            <div
              className="relative flex shrink-0 items-center justify-center"
              style={{ width: SPLIT_HANDLE_WIDTH }}
            >
              <div
                ref={handlePillRef}
                className={cn(
                  'absolute left-1/2 h-[min(6.5rem,26vh)] w-2 -translate-x-1/2 -translate-y-1/2 rounded-full',
                  'bg-zinc-300/95 dark:bg-zinc-600 tonal:bg-[var(--tonal-fg-muted)]',
                )}
                style={{ top: initialHandleY }}
              />
            </div>

            <div
              className={cn(
                'my-4 min-w-0 flex-1 rounded-2xl border shadow-sm',
                'border-zinc-300 bg-zinc-50',
                'dark:border-zinc-700 dark:bg-zinc-900',
                'tonal:border-[var(--tonal-border)] tonal:bg-[var(--tonal-surface-sunken)]',
              )}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
