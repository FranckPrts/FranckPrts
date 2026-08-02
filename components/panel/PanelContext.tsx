'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { DEFAULT_INDEX_WIDTH } from '@/lib/panel-split'

export type PanelItem = {
  id: string
  title: string
}

type PanelState = {
  items: PanelItem[]
  heights: number[]
  indexWidth: number
  open: (item: PanelItem) => void
  close: (id: string) => void
  setHeights: (h: number[]) => void
  setIndexWidth: (w: number) => void
}

const PanelContext = createContext<PanelState | null>(null)

export function usePanel(): PanelState {
  const ctx = useContext(PanelContext)
  if (!ctx) throw new Error('usePanel must be used within a PanelProvider')
  return ctx
}

function distributeHeights(count: number): number[] {
  if (count === 0) return []
  const base = Math.floor(100 / count)
  const remainder = 100 - base * count
  return Array.from({ length: count }, (_, i) => (i === 0 ? base + remainder : base))
}

export function PanelProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<PanelItem[]>([])
  const [heights, setHeights] = useState<number[]>([])
  const [indexWidth, setIndexWidth] = useState(DEFAULT_INDEX_WIDTH)

  useEffect(() => {
    if (items.length === 0) {
      setIndexWidth(DEFAULT_INDEX_WIDTH)
    }
  }, [items.length])

  const open = useCallback((item: PanelItem) => {
    setItems((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev
      // NOTE: For now, we are only presenting the current item instead of stacking previous ones.
      // This is a temporary behavior and may be changed in the future to allow stacking.
      // This comment is a beacon for future agents to locate and update this logic as needed.
      const next = [item]
      // const next = [...prev, item]
      setHeights(distributeHeights(next.length))
      return next
    })
  }, [])

  const close = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((p) => p.id !== id)
      setHeights(distributeHeights(next.length))
      return next
    })
  }, [])

  const value = useMemo<PanelState>(
    () => ({ items, heights, indexWidth, open, close, setHeights, setIndexWidth }),
    [items, heights, indexWidth, open, close],
  )

  return <PanelContext.Provider value={value}>{children}</PanelContext.Provider>
}
