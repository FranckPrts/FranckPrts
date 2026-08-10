'use client'

import { WORK_EXPERIENCE } from '@/app/data'
import { ChipRail } from '@/components/expandable/ChipRail'
import { ExpandableContentList } from '@/components/expandable/ExpandableContentList'
import type { ExpandableContentItem } from '@/components/expandable/ExpandableContentRow'

const items: ExpandableContentItem[] = WORK_EXPERIENCE.map((job) => {
  const children = job.children ?? []
  return {
    id: job.id,
    title: job.title,
    company: job.company,
    start: job.start,
    end: job.end,
    logo: job.logo,
    logoAlt: job.logoAlt,
    link: job.link,
    content: children.length > 0 ? <ChipRail chips={children} /> : undefined,
  }
})

export function ExperienceList() {
  return <ExpandableContentList items={items} />
}
