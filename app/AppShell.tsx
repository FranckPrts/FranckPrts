'use client'

import React from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowLeftIcon } from 'lucide-react'
import { Header } from './header'
import { Footer } from './footer'
import { PanelStack } from '@/components/panel/RightPanel'
import { usePanel } from '@/components/panel/PanelContext'

const SPRING = { type: 'spring', bounce: 0, duration: 0.4 } as const

export function AppShell({ children }: { children: React.ReactNode }) {
  const { items, close } = usePanel()
  const panelOpen = items.length > 0

  return (
    <>
      {/* ── Main layout row ── */}
      <div className="flex w-full">
        {/* Left column: narrows and left-aligns when panel opens */}
        <motion.div
          layout
          transition={SPRING}
          className="flex min-h-screen flex-shrink-0 flex-col px-4 pt-20 pb-8"
          style={{
            width: panelOpen ? 'min(50vw, 640px)' : '100%',
            maxWidth: panelOpen ? 'min(50vw, 640px)' : '640px',
            marginLeft: panelOpen ? '16px' : 'auto',
            marginRight: panelOpen ? '16px' : 'auto',
          }}
        >
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </motion.div>

        {/* Desktop separator + right panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.div
              key="desktop-panel"
              initial={{ opacity: 0, flexBasis: 0, minWidth: 0 }}
              animate={{ opacity: 1, flexBasis: 'auto', minWidth: 0 }}
              exit={{ opacity: 0, flexBasis: 0, minWidth: 0 }}
              transition={SPRING}
              className="sticky top-0 hidden h-screen min-w-0 flex-1 lg:flex"
            >
              {/* Separator line */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-3px flex-shrink-0 self-stretch bg-zinc-100 dark:bg-zinc-800 tonal:bg-[var(--tonal-border)]"
              />
              {/* Panel stack */}
              <div className="h-full min-w-0 flex-1 overflow-hidden">
                <PanelStack />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
