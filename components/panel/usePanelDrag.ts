'use client'

import { useCallback, useRef } from 'react'
import { usePanel } from './PanelContext'

const MIN_HEIGHT_PCT = 10

export function usePanelDrag(panelRef: React.RefObject<HTMLDivElement | null>) {
  const { heights, setHeights } = usePanel()
  const dragging = useRef<{
    dividerIndex: number
    startY: number
    startHeights: number[]
  } | null>(null)

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current || !panelRef.current) return
      const { dividerIndex, startY, startHeights } = dragging.current
      const panelH = panelRef.current.getBoundingClientRect().height
      const deltaPct = ((e.clientY - startY) / panelH) * 100
      const next = [...startHeights]
      const a = next[dividerIndex] + deltaPct
      const b = next[dividerIndex + 1] - deltaPct
      if (a < MIN_HEIGHT_PCT || b < MIN_HEIGHT_PCT) return
      next[dividerIndex] = a
      next[dividerIndex + 1] = b
      setHeights(next)
    },
    [panelRef, setHeights],
  )

  const onMouseUp = useCallback(() => {
    dragging.current = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [onMouseMove])

  const startDrag = useCallback(
    (dividerIndex: number, startY: number) => {
      dragging.current = { dividerIndex, startY, startHeights: [...heights] }
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'row-resize'
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [heights, onMouseMove, onMouseUp],
  )

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging.current || !panelRef.current) return
      const touch = e.touches[0]
      const { dividerIndex, startY, startHeights } = dragging.current
      const panelH = panelRef.current.getBoundingClientRect().height
      const deltaPct = ((touch.clientY - startY) / panelH) * 100
      const next = [...startHeights]
      const a = next[dividerIndex] + deltaPct
      const b = next[dividerIndex + 1] - deltaPct
      if (a < MIN_HEIGHT_PCT || b < MIN_HEIGHT_PCT) return
      next[dividerIndex] = a
      next[dividerIndex + 1] = b
      setHeights(next)
    },
    [panelRef, setHeights],
  )

  const onTouchEnd = useCallback(() => {
    dragging.current = null
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
  }, [onTouchMove])

  const startTouchDrag = useCallback(
    (dividerIndex: number, startY: number) => {
      dragging.current = { dividerIndex, startY, startHeights: [...heights] }
      window.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('touchend', onTouchEnd)
    },
    [heights, onTouchMove, onTouchEnd],
  )

  const getDragHandleProps = useCallback(
    (dividerIndex: number) => ({
      onMouseDown: (e: React.MouseEvent) => {
        e.preventDefault()
        startDrag(dividerIndex, e.clientY)
      },
      onTouchStart: (e: React.TouchEvent) => {
        startTouchDrag(dividerIndex, e.touches[0].clientY)
      },
    }),
    [startDrag, startTouchDrag],
  )

  return { getDragHandleProps }
}
