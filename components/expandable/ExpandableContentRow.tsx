'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import {
  ExpandableRowHeader,
  ExpandableRowShell,
  EXPANDABLE_TOP_CLASS,
  type ExpandableRowMeta,
} from '@/components/expandable/ExpandableRowShell'
import { usePanel } from '@/components/panel/PanelContext'
import { BLOG_REGISTRY } from '@/lib/blog-registry'
import { blogSlugFromPath } from '@/lib/blog-path'

export type ExpandableContentItem = ExpandableRowMeta & {
  /** Present → expandable row; chips or prose live here. */
  content?: ReactNode
  /** Used when there is no content — leaf panel / Link / external / static. */
  link?: string
}

type ExpandableContentRowProps = {
  item: ExpandableContentItem
  expanded: boolean
  onToggleExpand: () => void
  rowRef?: (el: HTMLDivElement | null) => void
}

export function ExpandableContentRow({
  item,
  expanded,
  onToggleExpand,
  rowRef,
}: ExpandableContentRowProps) {
  const { open: openPanel } = usePanel()
  const header = <ExpandableRowHeader item={item} />
  const topClassName = EXPANDABLE_TOP_CLASS
  const hasContent = item.content != null

  if (hasContent) {
    return (
      <ExpandableRowShell
        id={item.id}
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
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative z-10 overflow-hidden"
            >
              <div
                className="pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                {item.content}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </ExpandableRowShell>
    )
  }

  const href = (item.link ?? '').trim()
  const slug = blogSlugFromPath(href)

  const leafShell = (inner: ReactNode) => (
    <ExpandableRowShell id={item.id} expanded={expanded} rowRef={rowRef}>
      {inner}
    </ExpandableRowShell>
  )

  if (!href) {
    return leafShell(<div className={topClassName}>{header}</div>)
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
