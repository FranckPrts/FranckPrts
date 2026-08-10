'use client'

import { EDUCATION } from '@/app/data'
import { ExpandableContentList } from '@/components/expandable/ExpandableContentList'
import type { ExpandableContentItem } from '@/components/expandable/ExpandableContentRow'

const proseClassName =
  'text-sm text-zinc-600 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]'

const items: ExpandableContentItem[] = EDUCATION.map((edu) => {
  const detail = edu.detail?.trim()
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
        <p>{detail || 'Details coming soon.'}</p>
      </div>
    ),
  }
})

export function EducationList() {
  return <ExpandableContentList items={items} />
}
