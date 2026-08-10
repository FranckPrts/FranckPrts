'use client'

import { useExpandableAccordion } from '@/components/expandable/ExpandableAccordionContext'
import {
  ExpandableContentRow,
  type ExpandableContentItem,
} from '@/components/expandable/ExpandableContentRow'

type ExpandableContentListProps = {
  items: ExpandableContentItem[]
}

export function ExpandableContentList({ items }: ExpandableContentListProps) {
  const { expandedId, contentId, toggle, registerRow } =
    useExpandableAccordion()

  return (
    <div className="flex flex-col space-y-0">
      {items.map((item) => (
        <ExpandableContentRow
          key={item.id}
          item={item}
          expanded={expandedId === item.id}
          contentOpen={contentId === item.id}
          onToggleExpand={() => toggle(item.id)}
          rowRef={(el) => registerRow(item.id, el)}
        />
      ))}
    </div>
  )
}
