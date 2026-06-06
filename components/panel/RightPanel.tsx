'use client'

import React, { useRef } from 'react'
import { usePanel } from './PanelContext'
import { PanelSection } from './PanelSection'
import { usePanelDrag } from './usePanelDrag'

function DragHandle({
  onMouseDown,
  onTouchStart,
}: {
  onMouseDown: (e: React.MouseEvent) => void
  onTouchStart: (e: React.TouchEvent) => void
}) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
      className="group relative flex h-2 mx-8 flex-shrink-0 cursor-row-resize items-center justify-center rounded-full bg-zinc-50 hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 tonal:bg-[var(--tonal-surface-sunken)]"
    >
      <div className="h-[2px] w-8 rounded-full bg-zinc-300 transition-colors group-hover:bg-zinc-400 dark:bg-zinc-700 dark:group-hover:bg-zinc-500 tonal:bg-[var(--tonal-border)]" />
    </div>
  )
}

export function PanelStack() {
  const { items, heights, close } = usePanel()
  const panelRef = useRef<HTMLDivElement>(null)
  const { getDragHandleProps } = usePanelDrag(panelRef)

  return (
    <div ref={panelRef} className="flex h-full flex-col overflow-hidden">
      {items.map((item, i) => (
        <React.Fragment key={item.id}>
          <div
            className="flex min-h-0 flex-col overflow-hidden"
            style={{ height: `${heights[i] ?? 100 / items.length}%` }}
          >
            <PanelSection
              id={item.id}
              title={item.title}
              onClose={() => close(item.id)}
            />
          </div>
          {i < items.length - 1 && <DragHandle {...getDragHandleProps(i)} />}
        </React.Fragment>
      ))}
    </div>
  )
}
