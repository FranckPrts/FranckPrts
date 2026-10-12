'use client'

import React from 'react'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import { DialogCloseButton } from '@/components/ui/dialog-close-button'
import { BiteDialog } from '@/components/panel/BiteDialog'
import { cn } from '@/lib/utils'

const ZOOM_TRANSITION = { type: 'spring', bounce: 0, duration: 0.3 } as const

export type ProjectMediaProps = {
  video?: string
  image?: string
  imageAlt?: string
  title?: string
  /** When set, the media opens this bite instead of the zoom view. */
  bite?: { id: string; title: string }
}

function ProjectMediaPlaceholder({ title }: { title?: string }) {
  const initials = title?.trim().slice(0, 2).toUpperCase() || '?'

  return (
    <div
      className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-200/80 bg-zinc-100/50 dark:border-zinc-700/80 dark:bg-zinc-900/40 tonal:border-[var(--tonal-border)] tonal:bg-[var(--tonal-surface)]/50"
      role="img"
      aria-label={title ? `No video preview for ${title}` : 'No video preview'}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200/80 text-sm font-semibold text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400 tonal:bg-[var(--tonal-surface-raised)] tonal:text-[var(--tonal-fg-muted)]">
        {initials}
      </span>
      <span className="text-xs text-zinc-400 dark:text-zinc-500 tonal:text-[var(--tonal-fg-muted)]">
        No preview
      </span>
    </div>
  )
}

/** Click-to-enlarge pop-up for a project's video or still image. */
function MediaZoomDialog({
  trigger,
  contentClassName,
  children,
}: {
  trigger: React.ReactNode
  /** Sizing for the enlarged frame. */
  contentClassName: string
  children: React.ReactNode
}) {
  return (
    <MorphingDialog transition={ZOOM_TRANSITION}>
      <MorphingDialogTrigger>{trigger}</MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          className={cn(
            'relative rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50 tonal:bg-[var(--tonal-surface-raised)] tonal:ring-[var(--tonal-border)]',
            contentClassName,
          )}
        >
          {children}
        </MorphingDialogContent>
        <DialogCloseButton />
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

/** Video, else still image, else placeholder. Opens the bite when given one. */
export function ProjectMedia({
  video,
  image,
  imageAlt,
  title,
  bite,
}: ProjectMediaProps) {
  const videoSrc = video?.trim()
  const imageSrc = image?.trim()
  if (!videoSrc && !imageSrc) {
    return <ProjectMediaPlaceholder title={title} />
  }

  const label = imageAlt?.trim() || title?.trim() || 'Project preview'
  const cursor = bite ? 'cursor-pointer' : 'cursor-zoom-in'
  const preview = videoSrc ? (
    <video
      src={videoSrc}
      autoPlay
      loop
      muted
      className={cn('aspect-video w-full rounded-xl', cursor)}
    />
  ) : (
    <img
      src={imageSrc}
      alt={label}
      className={cn('aspect-video w-full rounded-xl object-cover', cursor)}
    />
  )

  if (bite) {
    return (
      <BiteDialog
        id={bite.id}
        title={bite.title}
        className="block w-full"
        media={{ video, image, imageAlt }}
      >
        {preview}
      </BiteDialog>
    )
  }

  if (videoSrc) {
    return (
      <MediaZoomDialog trigger={preview} contentClassName="aspect-video">
        <video
          src={videoSrc}
          autoPlay
          loop
          muted
          className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
        />
      </MediaZoomDialog>
    )
  }

  return (
    <MediaZoomDialog
      trigger={preview}
      contentClassName="max-h-[85vh] max-w-[min(100vw-2rem,56rem)]"
    >
      <img
        src={imageSrc}
        alt={label}
        className="max-h-[80vh] w-full rounded-xl object-contain"
      />
    </MediaZoomDialog>
  )
}
