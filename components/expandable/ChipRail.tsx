'use client'

import Link from 'next/link'
import type { ContentLink } from '@/app/data'
import { BiteDialog } from '@/components/panel/BiteDialog'
import { usePanel } from '@/components/panel/PanelContext'
import { resolveContentLink } from '@/lib/content-link'

function ChipButton({ chip }: { chip: ContentLink }) {
  const { open: openPanel } = usePanel()
  const resolved = resolveContentLink(chip.link)
  const className =
    'pointer-events-auto rounded-lg bg-zinc-200 px-4 py-2 text-left text-base text-zinc-800 transition-colors hover:bg-zinc-300 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 tonal:bg-[var(--tonal-surface)] tonal:text-[var(--tonal-fg)] tonal:hover:bg-[var(--tonal-surface-raised)]'

  switch (resolved.kind) {
    case 'bite':
      return (
        <BiteDialog
          id={resolved.id}
          title={resolved.title}
          className={className}
        >
          {chip.label}
        </BiteDialog>
      )
    case 'panel':
      return (
        <button
          type="button"
          className={className}
          onClick={(e) => {
            e.stopPropagation()
            openPanel({ id: resolved.slug, title: resolved.title })
          }}
        >
          {chip.label}
        </button>
      )
    case 'internal':
      return (
        <Link
          href={resolved.href}
          className={className}
          onClick={(e) => e.stopPropagation()}
        >
          {chip.label}
        </Link>
      )
    case 'static':
      return (
        <span className={`${className} cursor-default opacity-60`}>
          {chip.label}
        </span>
      )
    case 'external':
      return (
        <a
          href={resolved.href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
          onClick={(e) => e.stopPropagation()}
        >
          {chip.label}
        </a>
      )
  }
}

export function ChipRail({ chips }: { chips: ContentLink[] }) {
  return (
    <div
      className="pointer-events-none flex flex-wrap gap-2.5"
      onClick={(e) => e.stopPropagation()}
    >
      {chips.map((chip) => (
        <ChipButton key={chip.id} chip={chip} />
      ))}
    </div>
  )
}
