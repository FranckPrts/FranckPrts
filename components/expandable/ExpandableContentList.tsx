'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ExpandableContentRow,
  type ExpandableContentItem,
} from '@/components/expandable/ExpandableContentRow'

type ExpandableContentListProps = {
  items: ExpandableContentItem[]
}

export function ExpandableContentList({ items }: ExpandableContentListProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const rowEls = useRef(new Map<string, HTMLDivElement>())

  const setRowRef = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) rowEls.current.set(id, el)
    else rowEls.current.delete(id)
  }, [])

  useEffect(() => {
    if (!expandedId) return

    const onPointerDown = (event: PointerEvent) => {
      const node = rowEls.current.get(expandedId)
      if (!node) {
        setExpandedId(null)
        return
      }
      if (event.target instanceof Node && node.contains(event.target)) return
      setExpandedId(null)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [expandedId])

  return (
    <div className="flex flex-col space-y-0">
      {items.map((item) => (
        <ExpandableContentRow
          key={item.id}
          item={item}
          expanded={expandedId === item.id}
          onToggleExpand={() =>
            setExpandedId((prev) => (prev === item.id ? null : item.id))
          }
          rowRef={(el) => setRowRef(item.id, el)}
        />
      ))}
    </div>
  )
}
