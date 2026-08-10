'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { WorkExperience, WorkExperienceChild } from '@/app/data'
import {
  ExpandableRowHeader,
  ExpandableRowShell,
  EXPANDABLE_TOP_CLASS,
} from '@/components/expandable/ExpandableRowShell'
import { usePanel } from '@/components/panel/PanelContext'
import { BLOG_REGISTRY } from '@/lib/blog-registry'
import { blogSlugFromPath } from '@/lib/blog-path'

type ExperienceRowProps = {
  job: WorkExperience
  expanded: boolean
  onToggleExpand: () => void
  rowRef?: (el: HTMLDivElement | null) => void
}

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

export function ExperienceRow({
  job,
  expanded,
  onToggleExpand,
  rowRef,
}: ExperienceRowProps) {
  const { open: openPanel } = usePanel()
  const children = job.children ?? []
  const isParent = children.length > 0
  const topClassName = EXPANDABLE_TOP_CLASS

  const header = <ExpandableRowHeader item={job} />

  const chipRail = isParent ? (
    <AnimatePresence initial={false}>
      {expanded ? (
        <motion.div
          key="rail"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 overflow-hidden"
        >
          <div
            className="pointer-events-none flex flex-wrap gap-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            {children.map((child) => (
              <ChipButton key={child.id} child={child} />
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  ) : null

  if (isParent) {
    return (
      <ExpandableRowShell
        id={job.id}
        expanded={expanded}
        rowRef={rowRef}
        stacked
      >
        <button
          type="button"
          className={`${topClassName} cursor-pointer`}
          aria-expanded={expanded}
          onClick={(e) => {
            e.stopPropagation()
            onToggleExpand()
          }}
        >
          {header}
        </button>
        {chipRail}
      </ExpandableRowShell>
    )
  }

  const href = job.link.trim()
  const slug = blogSlugFromPath(href)

  const leafShell = (inner: ReactNode) => (
    <ExpandableRowShell id={job.id} expanded={expanded} rowRef={rowRef}>
      {inner}
    </ExpandableRowShell>
  )

  if (!href) {
    return leafShell(
      <div className={topClassName}>{header}</div>,
    )
  }

  if (slug !== null && slug in BLOG_REGISTRY) {
    const entry = BLOG_REGISTRY[slug]
    return leafShell(
      <button
        type="button"
        className={`${topClassName} cursor-pointer`}
        onClick={() => openPanel({ id: slug, title: entry.title })}
      >
        {header}
      </button>,
    )
  }

  if (slug !== null) {
    return leafShell(
      <Link href={href} className={`${topClassName} block cursor-pointer`}>
        {header}
      </Link>,
    )
  }

  return leafShell(
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${topClassName} block`}
    >
      {header}
    </a>,
  )
}
