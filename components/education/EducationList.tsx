'use client'

import type { ReactNode } from 'react'
import { EDUCATION } from '@/app/data'
import { ExpandableContentList } from '@/components/expandable/ExpandableContentList'
import type { ExpandableContentItem } from '@/components/expandable/ExpandableContentRow'

const proseClassName =
  'text-sm text-zinc-600 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]'

const EDUCATION_DETAILS: Record<string, ReactNode> = {
  edu1: (
    <div className={proseClassName}>
      <p>
        Thesis: Potential avenues, challenges, and opportunities offered by
        combining modeling frameworks of decision-making and hyperscanning for
        the study of social cognition.
      </p>
    </div>
  ),
  edu3: (
    <div className={proseClassName}>
      <p>Details coming soon.</p>
    </div>
  ),
  edu2: (
    <div className={proseClassName}>
      <p>Details coming soon.</p>
    </div>
  ),
}

const items: ExpandableContentItem[] = EDUCATION.map((edu) => ({
  id: edu.id,
  title: edu.title,
  company: edu.company,
  start: edu.start,
  end: edu.end,
  logo: edu.logo,
  logoAlt: edu.logoAlt,
  content: EDUCATION_DETAILS[edu.id] ?? (
    <div className={proseClassName}>
      <p>Details coming soon.</p>
    </div>
  ),
}))

export function EducationList() {
  return <ExpandableContentList items={items} />
}
