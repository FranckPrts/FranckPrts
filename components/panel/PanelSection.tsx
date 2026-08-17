'use client'

import React from 'react'
import { usePanel } from '@/components/panel/PanelContext'
import { PanelMdxCard } from '@/components/panel/PanelMdxCard'

type PanelSectionProps = {
  id: string
  title: string
  onClose: () => void
}

export function PanelSection({ id, title, onClose }: PanelSectionProps) {
  const { items, close } = usePanel()

  return (
    <div className="panel-section my-2 flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <PanelMdxCard
        id={id}
        title={title}
        onClose={onClose}
        onBeforeExpand={() => {
          items.forEach((item) => close(item.id))
        }}
        className="flex-1"
      />
    </div>
  )
}
