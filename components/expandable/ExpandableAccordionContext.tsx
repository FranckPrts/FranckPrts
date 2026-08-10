'use client'

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { EXPAND_CONTENT_MS } from '@/components/expandable/ExpandableRowShell'

type ExpandableAccordionState = {
  expandedId: string | null
  contentId: string | null
  toggle: (id: string) => void
  registerRow: (id: string, el: HTMLDivElement | null) => void
}

const ExpandableAccordionContext =
  createContext<ExpandableAccordionState | null>(null)

export function useExpandableAccordion(): ExpandableAccordionState {
  const ctx = useContext(ExpandableAccordionContext)
  if (!ctx) {
    throw new Error(
      'useExpandableAccordion must be used within an ExpandableAccordionProvider',
    )
  }
  return ctx
}

export function ExpandableAccordionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [contentId, setContentId] = useState<string | null>(null)
  const rowEls = useRef(new Map<string, HTMLDivElement>())
  const contentIdRef = useRef<string | null>(null)
  const exitUntilRef = useRef(0)

  const registerRow = useCallback((id: string, el: HTMLDivElement | null) => {
    if (el) rowEls.current.set(id, el)
    else rowEls.current.delete(id)
  }, [])

  const toggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id))
  }, [])

  useEffect(() => {
    if (!expandedId) return

    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) {
        setExpandedId(null)
        return
      }
      for (const node of rowEls.current.values()) {
        if (node.contains(event.target)) return
      }
      setExpandedId(null)
    }

    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [expandedId])

  useEffect(() => {
    if (expandedId === contentIdRef.current) return

    let timer: ReturnType<typeof setTimeout> | undefined
    const from = contentIdRef.current
    const to = expandedId
    const now = performance.now()

    if (from !== null) {
      contentIdRef.current = null
      setContentId(null)
      exitUntilRef.current = now + EXPAND_CONTENT_MS
    }

    if (to === null) return

    const wait = Math.max(0, exitUntilRef.current - now)
    timer = setTimeout(() => {
      contentIdRef.current = to
      setContentId(to)
    }, wait)

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [expandedId])

  const value = useMemo<ExpandableAccordionState>(
    () => ({ expandedId, contentId, toggle, registerRow }),
    [expandedId, contentId, toggle, registerRow],
  )

  return (
    <ExpandableAccordionContext.Provider value={value}>
      {children}
    </ExpandableAccordionContext.Provider>
  )
}
