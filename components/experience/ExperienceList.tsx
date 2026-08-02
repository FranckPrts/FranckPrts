'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { WORK_EXPERIENCE, type WorkExperience } from '@/app/data'
import { ExperienceRow } from './ExperienceRow'

type ExperienceListProps = {
  items?: WorkExperience[]
}

export function ExperienceList({ items = WORK_EXPERIENCE }: ExperienceListProps) {
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
      {items.map((job) => (
        <ExperienceRow
          key={job.id}
          job={job}
          expanded={expandedId === job.id}
          onToggleExpand={() =>
            setExpandedId((prev) => (prev === job.id ? null : job.id))
          }
          rowRef={(el) => setRowRef(job.id, el)}
        />
      ))}
    </div>
  )
}
