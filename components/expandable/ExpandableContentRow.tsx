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
import { resolveContentLink } from '@/lib/content-link'

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

  const resolved = resolveContentLink(item.link ?? '')

  const leafShell = (inner: ReactNode) => (
    <ExpandableRowShell id={item.id} expanded={expanded} rowRef={rowRef}>
      {inner}
    </ExpandableRowShell>
  )

  switch (resolved.kind) {
    case 'static':
      return leafShell(<div className={topClassName}>{header}</div>)
    case 'panel':
      return leafShell(
        <button
          type="button"
          className={`${topClassName} cursor-pointer`}
          onClick={() =>
            openPanel({ id: resolved.slug, title: resolved.title })
          }
        >
          {header}
        </button>,
      )
    case 'internal':
      return leafShell(
        <Link
          href={resolved.href}
          className={`${topClassName} block cursor-pointer`}
        >
          {header}
        </Link>,
      )
    case 'external':
      return leafShell(
        <a
          href={resolved.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`${topClassName} block`}
        >
          {header}
        </a>,
      )
  }
}
