'use client'

import { useCallback, useRef } from 'react'
import { clampIndexWidth } from '@/lib/panel-split'
import { usePanel } from './PanelContext'

export function useSplitDrag(
  layoutRef: React.RefObject<HTMLElement | null>,
) {
  const { indexWidth, setIndexWidth } = usePanel()
  const dragging = useRef<{ startX: number; startWidth: number } | null>(null)

  const layoutWidth = useCallback(() => {
    return layoutRef.current?.getBoundingClientRect().width ?? window.innerWidth
  }, [layoutRef])

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current) return
      const { startX, startWidth } = dragging.current
      const next = clampIndexWidth(
        startWidth + (e.clientX - startX),
        layoutWidth(),
      )
      setIndexWidth(next)
    },
    [layoutWidth, setIndexWidth],
  )

  const onMouseUp = useCallback(() => {
    dragging.current = null
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
  }, [onMouseMove])

  const startDrag = useCallback(
    (startX: number) => {
      dragging.current = { startX, startWidth: indexWidth }
      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [indexWidth, onMouseMove, onMouseUp],
  )

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging.current) return
      const touch = e.touches[0]
      const { startX, startWidth } = dragging.current
      const next = clampIndexWidth(
        startWidth + (touch.clientX - startX),
        layoutWidth(),
      )
      setIndexWidth(next)
    },
    [layoutWidth, setIndexWidth],
  )

  const onTouchEnd = useCallback(() => {
    dragging.current = null
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
  }, [onTouchMove])

  const startTouchDrag = useCallback(
    (startX: number) => {
      dragging.current = { startX, startWidth: indexWidth }
      window.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('touchend', onTouchEnd)
    },
    [indexWidth, onTouchMove, onTouchEnd],
  )

  return {
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault()
      startDrag(e.clientX)
    },
    onTouchStart: (e: React.TouchEvent) => {
      startTouchDrag(e.touches[0].clientX)
    },
  }
}
