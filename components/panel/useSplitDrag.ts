'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { clampIndexWidth } from '@/lib/panel-split'
import { usePanel } from './PanelContext'

export const SPLIT_HANDLE_WIDTH = 20

/** Approximate half-height of the active (hover-sized) grip for Y clamping. */
const HANDLE_HALF_HEIGHT_PX = 52

type UseSplitDragOptions = {
  leftPaneRef: React.RefObject<HTMLElement | null>
  handlePillRef: React.RefObject<HTMLElement | null>
}

export function useSplitDrag(
  layoutRef: React.RefObject<HTMLElement | null>,
  { leftPaneRef, handlePillRef }: UseSplitDragOptions,
) {
  const { indexWidth, setIndexWidth } = usePanel()
  const [isSplitPreviewing, setIsSplitPreviewing] = useState(false)
  const [previewPointerY, setPreviewPointerY] = useState(0)

  const dragging = useRef<{ startX: number; startWidth: number } | null>(null)
  const previewWidth = useRef(indexWidth)
  const rafId = useRef<number | null>(null)
  const pending = useRef<{ width: number; clientY: number } | null>(null)
  const indexWidthRef = useRef(indexWidth)
  const previewingRef = useRef(false)

  useEffect(() => {
    indexWidthRef.current = indexWidth
  }, [indexWidth])

  const layoutWidth = useCallback(() => {
    return layoutRef.current?.getBoundingClientRect().width ?? window.innerWidth
  }, [layoutRef])

  const clampHandleY = useCallback((clientY: number) => {
    const min = HANDLE_HALF_HEIGHT_PX + 16
    const max = window.innerHeight - HANDLE_HALF_HEIGHT_PX - 16
    return Math.min(Math.max(clientY, min), Math.max(min, max))
  }, [])

  const applyPreview = useCallback(
    (width: number, clientY: number) => {
      previewWidth.current = width
      const pane = leftPaneRef.current
      if (pane) pane.style.width = `${width}px`

      const pill = handlePillRef.current
      if (pill) {
        pill.style.top = `${clampHandleY(clientY)}px`
      }
    },
    [clampHandleY, handlePillRef, leftPaneRef],
  )

  const schedulePreview = useCallback(
    (width: number, clientY: number) => {
      pending.current = { width, clientY }
      if (rafId.current != null) return
      rafId.current = requestAnimationFrame(() => {
        rafId.current = null
        const next = pending.current
        if (next == null) return
        pending.current = null
        applyPreview(next.width, next.clientY)
      })
    },
    [applyPreview],
  )

  const clearBodyDragStyles = useCallback(() => {
    document.body.style.userSelect = ''
    document.body.style.cursor = ''
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
  }, [])

  const endPreview = useCallback(
    (commit: boolean) => {
      if (!dragging.current && !previewingRef.current) return

      if (rafId.current != null) {
        cancelAnimationFrame(rafId.current)
        rafId.current = null
      }
      pending.current = null

      const width = previewWidth.current
      dragging.current = null
      clearBodyDragStyles()

      if (commit) {
        setIndexWidth(width)
        // Keep the veil up until the committed width has painted with layout off.
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            previewingRef.current = false
            setIsSplitPreviewing(false)
          })
        })
      } else {
        previewingRef.current = false
        setIsSplitPreviewing(false)
      }
    },
    [clearBodyDragStyles, setIndexWidth],
  )

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragging.current) return
      const { startX, startWidth } = dragging.current
      const next = clampIndexWidth(
        startWidth + (e.clientX - startX),
        layoutWidth(),
      )
      schedulePreview(next, e.clientY)
    },
    [layoutWidth, schedulePreview],
  )

  const onMouseUp = useCallback(() => {
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    endPreview(true)
  }, [endPreview, onMouseMove])

  const onTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!dragging.current) return
      e.preventDefault()
      const touch = e.touches[0]
      const { startX, startWidth } = dragging.current
      const next = clampIndexWidth(
        startWidth + (touch.clientX - startX),
        layoutWidth(),
      )
      schedulePreview(next, touch.clientY)
    },
    [layoutWidth, schedulePreview],
  )

  const onTouchEnd = useCallback(() => {
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
    endPreview(true)
  }, [endPreview, onTouchMove])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      e.preventDefault()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      endPreview(false)
    },
    [endPreview, onMouseMove, onMouseUp, onTouchEnd, onTouchMove],
  )

  const startPreview = useCallback(
    (startX: number, startY: number) => {
      const startWidth = indexWidthRef.current
      dragging.current = { startX, startWidth }
      previewWidth.current = startWidth
      previewingRef.current = true
      setPreviewPointerY(startY)
      applyPreview(startWidth, startY)
      setIsSplitPreviewing(true)

      document.body.style.userSelect = 'none'
      document.body.style.cursor = 'col-resize'
      document.body.style.overflow = 'hidden'
      document.documentElement.style.overflow = 'hidden'
    },
    [applyPreview],
  )

  const startDrag = useCallback(
    (startX: number, startY: number) => {
      startPreview(startX, startY)
      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', onMouseUp)
    },
    [onMouseMove, onMouseUp, startPreview],
  )

  const startTouchDrag = useCallback(
    (startX: number, startY: number) => {
      startPreview(startX, startY)
      window.addEventListener('touchmove', onTouchMove, { passive: false })
      window.addEventListener('touchend', onTouchEnd)
    },
    [onTouchEnd, onTouchMove, startPreview],
  )

  useEffect(() => {
    if (!isSplitPreviewing) {
      window.removeEventListener('keydown', onKeyDown)
      return
    }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isSplitPreviewing, onKeyDown])

  useEffect(() => {
    return () => {
      if (rafId.current != null) cancelAnimationFrame(rafId.current)
      clearBodyDragStyles()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [clearBodyDragStyles, onKeyDown, onMouseMove, onMouseUp, onTouchEnd, onTouchMove])

  return {
    isSplitPreviewing,
    previewPointerY,
    onMouseDown: (e: React.MouseEvent) => {
      e.preventDefault()
      startDrag(e.clientX, e.clientY)
    },
    onTouchStart: (e: React.TouchEvent) => {
      const touch = e.touches[0]
      startTouchDrag(touch.clientX, touch.clientY)
    },
  }
}
