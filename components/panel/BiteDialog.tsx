'use client'

import React from 'react'
import { XIcon } from 'lucide-react'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
  useMorphingDialog,
} from '@/components/ui/morphing-dialog'
import { PanelMdxCard } from '@/components/panel/PanelMdxCard'
import { cn } from '@/lib/utils'

type BiteDialogProps = {
  id: string
  title: string
  children: React.ReactNode
  /** Classes applied to the morph trigger wrapper. */
  className?: string
}

/**
 * Bite MDX as a centered MorphingDialog card (same blur backdrop as project media zoom).
 * Registry / MDX `panelMode: 'bite'` should open this instead of the right rail.
 */
export function BiteDialog({ id, title, children, className }: BiteDialogProps) {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger className={cn(className)}>
        {children}
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative flex max-h-[min(70vh,32rem)] w-[min(100vw-2rem,32rem)] flex-col overflow-hidden rounded-3xl shadow-lg ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 tonal:ring-[var(--tonal-border)]">
          <BiteDialogCard id={id} title={title} />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1 tonal:bg-[var(--tonal-surface-raised)]"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

function BiteDialogCard({ id, title }: { id: string; title: string }) {
  const { setIsOpen } = useMorphingDialog()

  return (
    <PanelMdxCard
      id={id}
      title={title}
      compact
      className="h-full max-h-[min(70vh,32rem)] border-0"
      onClose={() => setIsOpen(false)}
    />
  )
}
