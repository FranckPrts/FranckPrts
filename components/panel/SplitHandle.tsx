'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { SPLIT_HANDLE_WIDTH } from './useSplitDrag'

const SPRING = { type: 'spring', bounce: 0, duration: 0.4 } as const

type SplitHandleProps = {
  onMouseDown: (e: React.MouseEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
  indexWidth: number
}

export function SplitHandle({ onMouseDown, onTouchStart, indexWidth }: SplitHandleProps) {
  return (
    <motion.div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize homepage and panel columns"
      aria-valuenow={indexWidth}
      initial={{ opacity: 0, width: 0 }}
      animate={{ opacity: 1, width: SPLIT_HANDLE_WIDTH }}
      exit={{ opacity: 0, width: 0 }}
      transition={SPRING}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="group sticky top-0 z-10 hidden h-screen shrink-0 cursor-col-resize items-center justify-center overflow-hidden self-start lg:flex"
    >
      <div className="absolute inset-y-0 left-1/2 w-5 -translate-x-1/2" aria-hidden />
      <div
        className={cn(
          'relative h-[min(5.5rem,22vh)] w-1.5 shrink-0 rounded-full',
          'bg-zinc-200/90 transition-all duration-200 ease-out',
          'group-hover:h-[min(6.5rem,26vh)] group-hover:w-2 group-hover:bg-zinc-300/95',
          'dark:bg-zinc-700/90 dark:group-hover:bg-zinc-600',
          'tonal:bg-[var(--tonal-border)] tonal:group-hover:bg-[var(--tonal-fg-muted)]',
        )}
      />
    </motion.div>
  )
}
