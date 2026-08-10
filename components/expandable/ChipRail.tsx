'use client'

import Link from 'next/link'
import type { WorkExperienceChild } from '@/app/data'
import { usePanel } from '@/components/panel/PanelContext'
import { BLOG_REGISTRY } from '@/lib/blog-registry'
import { blogSlugFromPath } from '@/lib/blog-path'

function ChipButton({ child }: { child: WorkExperienceChild }) {
  const { open: openPanel } = usePanel()
  const href = child.link.trim()
  const slug = blogSlugFromPath(href)
  const className =
    'pointer-events-auto rounded-lg bg-zinc-200 px-4 py-2 text-left text-base text-zinc-800 transition-colors hover:bg-zinc-300 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 tonal:bg-[var(--tonal-surface)] tonal:text-[var(--tonal-fg)] tonal:hover:bg-[var(--tonal-surface-raised)]'

  if (slug !== null && slug in BLOG_REGISTRY) {
    const entry = BLOG_REGISTRY[slug]
    return (
      <button
        type="button"
        className={className}
        onClick={(e) => {
          e.stopPropagation()
          openPanel({ id: slug, title: entry.title })
        }}
      >
        {child.label}
      </button>
    )
  }

  if (slug !== null) {
    return (
      <Link
        href={href}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {child.label}
      </Link>
    )
  }

  if (!href) {
    return (
      <span className={`${className} cursor-default opacity-60`}>
        {child.label}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      {child.label}
    </a>
  )
}

export function ChipRail({ chips }: { chips: WorkExperienceChild[] }) {
  return (
    <div
      className="pointer-events-none flex flex-wrap gap-2.5"
      onClick={(e) => e.stopPropagation()}
    >
      {chips.map((child) => (
        <ChipButton key={child.id} child={child} />
      ))}
    </div>
  )
}
