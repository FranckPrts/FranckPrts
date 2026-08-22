'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'

/** Content enter/exit and list exit-then-enter wait. */
export const EXPAND_CONTENT_MS = 250
export const FILL_EXPAND_MS = 250
export const FILL_COLLAPSE_MS = 250
/** Hover-only fill reveal (slower than expand). */
export const FILL_HOVER_MS = 600
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

export type ExpandableRowMeta = {
  id: string
  title: string
  company?: string
  start: string
  end: string
  logo?: string
  logoAlt?: string
}

function coverRadius(width: number, height: number, x: number, y: number) {
  const corners: [number, number][] = [
    [0, 0],
    [width, 0],
    [0, height],
    [width, height],
  ]
  return Math.max(
    ...corners.map(([cx, cy]) => Math.hypot(cx - x, cy - y)),
    1,
  )
}

function useFinePointer() {
  const [fine, setFine] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(FINE_POINTER_QUERY)
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return fine
}

export function OrgLogo({
  logo,
  alt,
}: {
  logo?: string
  alt: string
}) {
  const src = logo?.trim()

  return (
    <div className="size-8 shrink-0">
      {src ? (
        <div className="flex size-full items-center justify-center overflow-hidden rounded-[8px] bg-zinc-100 p-1.5 dark:bg-zinc-800 tonal:bg-[var(--tonal-surface-raised)]">
          <span
            role="img"
            aria-label={alt}
            className="block size-full bg-zinc-700 dark:bg-zinc-200 tonal:bg-[var(--tonal-fg)]"
            style={{
              maskImage: `url(${src})`,
              WebkitMaskImage: `url(${src})`,
              maskSize: 'contain',
              WebkitMaskSize: 'contain',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskPosition: 'center',
              WebkitMaskPosition: 'center',
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

export function ExpandableRowHeader({ item }: { item: ExpandableRowMeta }) {
  const company = (item.company ?? '').trim()
  const logoAlt =
    item.logoAlt?.trim() || company || item.title.trim() || 'Organization'
  return (
    <div
      className={`relative flex w-full flex-row justify-between gap-4 ${
        company ? 'items-start' : 'items-center'
      }`}
    >
      <div className="flex min-w-0 flex-row items-center gap-2.5">
        <OrgLogo logo={item.logo} alt={logoAlt} />
        <div className="min-w-0">
          <h4 className="text-base font-medium leading-6 dark:text-zinc-100 tonal:text-[var(--tonal-fg)]">
            {item.title}
          </h4>
          {company ? (
            <p className="text-sm leading-5 text-zinc-500 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
              {company}
            </p>
          ) : null}
        </div>
      </div>
      <p className="shrink-0 whitespace-nowrap text-sm leading-6 text-zinc-600 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
        {item.start} - {item.end}
      </p>
    </div>
  )
}

type ExpandableRowShellProps = {
  id: string
  expanded: boolean
  rowRef?: (el: HTMLDivElement | null) => void
  /** When true, body uses flex column + gap when expanded (parent / content rows). */
  stacked?: boolean
  children: ReactNode
}

export function ExpandableRowShell({
  id,
  expanded,
  rowRef,
  stacked = false,
  children,
}: ExpandableRowShellProps) {
  const finePointer = useFinePointer()
  const localRef = useRef<HTMLDivElement | null>(null)
  const [origin, setOrigin] = useState({ x: 0, y: 0 })
  const [radius, setRadius] = useState(0)
  const [hovered, setHovered] = useState(false)

  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      localRef.current = el
      rowRef?.(el)
    },
    [rowRef],
  )

  const updateOrigin = useCallback((clientX: number, clientY: number) => {
    const el = localRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    setOrigin({ x, y })
    setRadius(coverRadius(rect.width, rect.height, x, y))
  }, [])

  const refreshCoverRadius = useCallback(() => {
    const el = localRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = origin.x || rect.width / 2
    const y = origin.y || rect.height / 2
    if (!origin.x && !origin.y) setOrigin({ x, y })
    setRadius(coverRadius(rect.width, rect.height, x, y))
  }, [origin.x, origin.y])

  const handlePointerEnter = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (!finePointer) return
    updateOrigin(e.clientX, e.clientY)
    setHovered(true)
  }

  const handlePointerLeave = () => {
    if (!finePointer) return
    setHovered(false)
  }

  useEffect(() => {
    if (!expanded) return
    refreshCoverRadius()
    const el = localRef.current
    if (!el || typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(() => refreshCoverRadius())
    ro.observe(el)
    return () => ro.disconnect()
  }, [expanded, refreshCoverRadius])

  const showFill = expanded || (finePointer && hovered)
  const fillDurationMs = expanded
    ? FILL_EXPAND_MS
    : finePointer && hovered
      ? FILL_HOVER_MS
      : FILL_COLLAPSE_MS

  return (
    <div
      ref={setRefs}
      data-id={id}
      className="relative -mx-3 overflow-hidden rounded-lg"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 bg-zinc-100 dark:bg-zinc-900/80 tonal:bg-[var(--tonal-surface-sunken)]"
        style={{
          clipPath: showFill
            ? `circle(${radius}px at ${origin.x}px ${origin.y}px)`
            : `circle(0px at ${origin.x}px ${origin.y}px)`,
          transition: `clip-path ${fillDurationMs}ms ease-out`,
        }}
      />
      <div
        className={
          stacked
            ? `relative z-10 flex flex-col px-4 py-3.5${expanded ? ' gap-3' : ''}`
            : 'relative z-10 px-4 py-3.5'
        }
      >
        {children}
      </div>
    </div>
  )
}

export const EXPANDABLE_TOP_CLASS = 'relative z-10 w-full text-left'
