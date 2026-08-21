'use client'

import React, { useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeftIcon } from 'lucide-react'
import { Header } from './header'
import { Footer } from './footer'
import { PanelStack } from '@/components/panel/RightPanel'
import { SplitHandle } from '@/components/panel/SplitHandle'
import { SplitPreviewOverlay } from '@/components/panel/SplitPreviewOverlay'
import { useSplitDrag } from '@/components/panel/useSplitDrag'
import { usePanel } from '@/components/panel/PanelContext'
import { cn } from '@/lib/utils'

const SPRING = { type: 'spring', bounce: 0, duration: 0.4 } as const

export function AppShell({ children }: { children: React.ReactNode }) {
  const { items, close, indexWidth } = usePanel()
  const panelOpen = items.length > 0
  const layoutRef = useRef<HTMLDivElement>(null)
  const leftPaneRef = useRef<HTMLDivElement>(null)
  const handlePillRef = useRef<HTMLDivElement>(null)
  const { isSplitPreviewing, previewPointerY, onMouseDown, onTouchStart } =
    useSplitDrag(layoutRef, { leftPaneRef, handlePillRef })

  return (
    <>
      {/* ── Main layout row ── */}
      <div className="flex w-full justify-center">
        <div
          ref={layoutRef}
          className={cn(
            'app-layout relative flex min-w-0 w-full pl-12',
            panelOpen && 'app-layout--with-panel',
            isSplitPreviewing && 'select-none [&_.app-index]:pointer-events-none [&_.panel-column]:pointer-events-none',
          )}
          style={
            panelOpen
              ? ({ '--index-width': `${indexWidth}px` } as React.CSSProperties)
              : undefined
          }
        >
          {/* Left column — fixed width only at lg+ via --index-width */}
          <motion.div
            layout={!isSplitPreviewing}
            transition={SPRING}
            className={cn(
              'app-index flex min-h-screen w-full flex-col pt-20 pb-8 lg:px-4',
              panelOpen
                ? 'lg:w-[var(--index-width,var(--width-index))] lg:max-w-none lg:flex-shrink-0'
                : 'flex-shrink-0 lg:max-w-[var(--width-index)]',
            )}
          >
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </motion.div>

          {/* Desktop split handle + panel zone */}
          <AnimatePresence>
            {panelOpen && (
              <SplitHandle
                key="split-handle"
                onMouseDown={onMouseDown}
                onTouchStart={onTouchStart}
                indexWidth={indexWidth}
              />
            )}
            {panelOpen && (
              <motion.div
                key="desktop-panel"
                layout={!isSplitPreviewing}
                initial={{ opacity: 0, flexBasis: 0, minWidth: 0 }}
                animate={{ opacity: 1, flexBasis: 'auto', minWidth: 0 }}
                exit={{ opacity: 0, flexBasis: 0, minWidth: 0 }}
                transition={SPRING}
                className="sticky top-0 hidden h-screen min-w-0 flex-1 lg:flex"
              >
                <div className="panel-column panel-column--flush h-full min-w-0 flex-1 overflow-hidden">
                  <PanelStack />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {panelOpen && (
            <SplitPreviewOverlay
              visible={isSplitPreviewing}
              layoutRef={layoutRef}
              leftPaneRef={leftPaneRef}
              handlePillRef={handlePillRef}
              initialIndexWidth={indexWidth}
              initialHandleY={previewPointerY}
            />
          )}
        </div>
      </div>

      {/* ── Mobile overlay (fixed, always mounted so exit animation works) ── */}
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            key="mobile-overlay"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', bounce: 0, duration: 0.35 }}
            className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-zinc-950 tonal:bg-[var(--tonal-surface)] lg:hidden"
          >
            {/* Back button */}
            <div className="flex flex-shrink-0 items-center border-b border-zinc-200 px-4 py-3 dark:border-zinc-800 tonal:border-[var(--tonal-border)]">
              <button
                type="button"
                onClick={() => items.forEach((item) => close(item.id))}
                className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 tonal:text-[var(--tonal-fg-muted)]"
              >
                <ArrowLeftIcon size={15} />
                Back
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <PanelStack />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
