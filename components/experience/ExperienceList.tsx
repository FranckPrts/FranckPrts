'use client'

import { WORK_EXPERIENCE } from '@/app/data'
import { ChipRail } from '@/components/expandable/ChipRail'
import { ExpandableContentList } from '@/components/expandable/ExpandableContentList'
import type { ExpandableContentItem } from '@/components/expandable/ExpandableContentRow'

const proseClassName =
  'flex flex-col gap-2 text-base text-zinc-600 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]'

function detailItems(detail: string | string[] | undefined): string[] {
  if (detail == null) return []
  if (Array.isArray(detail)) {
    return detail.map((p) => p.trim()).filter(Boolean)
  }
  const trimmed = detail.trim()
  return trimmed ? [trimmed] : []
}

const items: ExpandableContentItem[] = WORK_EXPERIENCE.map((job) => {
  const children = job.children ?? []
  const details = detailItems(job.detail)
  const hasChips = children.length > 0
  const hasDetail = details.length > 0

  const content =
    hasChips || hasDetail ? (
      <div className="flex flex-col gap-3">
        {hasDetail ? (
          <ul className={`${proseClassName} list-disc pl-5`}>
            {details.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : null}
        {hasChips ? <ChipRail chips={children} /> : null}
      </div>
    ) : undefined

  return {
    id: job.id,
    title: job.title,
    company: job.company,
    start: job.start,
    end: job.end,
    logo: job.logo,
    logoAlt: job.logoAlt,
    link: job.link,
    content,
  }
})

export function ExperienceList() {
  return <ExpandableContentList items={items} />
}
