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
import { BiteCard } from '@/components/panel/BiteCard'
import {
  BiteOverlapStage,
  type BiteOverlapMedia,
} from '@/components/panel/BiteOverlapStage'
import { cn } from '@/lib/utils'

export type BiteDialogMedia = BiteOverlapMedia

type BiteDialogProps = {
  id: string
  title: string
  children: React.ReactNode
  /** Classes applied to the morph trigger wrapper. */
  className?: string
  /** When set, dialog opens as overlapping photo + bite with focus swap. */
  media?: BiteDialogMedia
}

function hasUsableMedia(media?: BiteDialogMedia): media is BiteDialogMedia {
  if (!media) return false
  return Boolean(media.image?.trim() || media.video?.trim())
}

/**
 * Bite MDX as a centered MorphingDialog card (same blur backdrop as project media zoom).
 * With `media`, uses the overlapping photo + bite stage instead of a lone card.
 */
export function BiteDialog({
  id,
  title,
  children,
  className,
  media,
}: BiteDialogProps) {
  const withMedia = hasUsableMedia(media)

  return (
    <MorphingDialog
      layout={false}
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
        <MorphingDialogContent
          className={cn(
            'relative',
            withMedia
              ? 'h-fit w-fit overflow-visible bg-transparent p-0 shadow-none ring-0'
              : 'h-fit w-[min(100vw-2rem,32rem)] rounded-3xl shadow-lg ring-1 ring-zinc-200/50 dark:ring-zinc-800/50 tonal:ring-[var(--tonal-border)]',
          )}
        >
          <BiteDialogBody id={id} title={title} media={media} />
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

function BiteDialogBody({
  id,
  title,
  media,
}: {
  id: string
  title: string
  media?: BiteDialogMedia
}) {
  const { setIsOpen } = useMorphingDialog()
  const onClose = () => setIsOpen(false)

  if (hasUsableMedia(media)) {
    return (
      <BiteOverlapStage
        id={id}
        title={title}
        media={media}
        onClose={onClose}
      />
    )
  }

  return <BiteCard id={id} title={title} onClose={onClose} />
}
