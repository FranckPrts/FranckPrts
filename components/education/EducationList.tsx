'use client'

import {
  EDUCATION,
  type EducationDetailBlock,
  type EducationEntry,
} from '@/app/data'
import { ExpandableContentList } from '@/components/expandable/ExpandableContentList'
import type { ExpandableContentItem } from '@/components/expandable/ExpandableContentRow'

const proseClassName =
  'flex flex-col gap-2 text-sm text-zinc-600 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]'

const sectionTitleClassName =
  'text-sm font-medium text-zinc-700 dark:text-zinc-300 tonal:text-[var(--tonal-fg)]'

function normalizeDetail(
  detail: EducationEntry['detail'],
): EducationDetailBlock[] {
  if (detail == null) return []
  if (typeof detail === 'string') {
    const trimmed = detail.trim()
    return trimmed ? [{ type: 'text', text: trimmed }] : []
  }
  if (detail.length === 0) return []
  if (typeof detail[0] === 'string') {
    return (detail as string[])
      .map((p) => p.trim())
      .filter(Boolean)
      .map((text) => ({ type: 'text' as const, text }))
  }
  return detail as EducationDetailBlock[]
}

function DetailBlocks({ blocks }: { blocks: EducationDetailBlock[] }) {
  if (blocks.length === 0) {
    return <p>Details coming soon.</p>
  }

  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === 'text') {
          return <p key={`text-${index}`}>{block.text}</p>
        }

        const items = block.items.map((item) => item.trim()).filter(Boolean)
        if (items.length === 0) return null

        return (
          <div key={`bullets-${index}`} className="flex flex-col gap-2">
            {block.title ? (
              <p className={sectionTitleClassName}>{block.title}</p>
            ) : null}
            <ul className="list-disc pl-5">
              {items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )
      })}
    </>
  )
}

const items: ExpandableContentItem[] = EDUCATION.map((edu) => {
  const blocks = normalizeDetail(edu.detail)
  return {
    id: edu.id,
    title: edu.school,
    company: edu.program,
    start: edu.start,
    end: edu.end,
    logo: edu.logo,
    logoAlt: edu.logoAlt,
    content: (
      <div className={proseClassName}>
        <DetailBlocks blocks={blocks} />
      </div>
    ),
  }
})

export function EducationList() {
  return <ExpandableContentList items={items} />
}
