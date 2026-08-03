'use client'

import Link from 'next/link'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { WorkExperience, WorkExperienceChild } from '@/app/data'
import { usePanel } from '@/components/panel/PanelContext'
import { BLOG_REGISTRY } from '@/lib/blog-registry'
import { blogSlugFromPath } from '@/lib/blog-path'

const FILL_MS = 600
const FILL_OUT_MS = 180
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'

type ExperienceRowProps = {
  job: WorkExperience
  expanded: boolean
  onToggleExpand: () => void
  rowRef?: (el: HTMLDivElement | null) => void
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

function ChipButton({ child }: { child: WorkExperienceChild }) {
  const { open: openPanel } = usePanel()
  const href = child.link.trim()
  const slug = blogSlugFromPath(href)
  const className =
    'pointer-events-auto rounded-lg bg-zinc-200 px-4 py-2 text-left text-base text-zinc-800 transition-colors hover:bg-zinc-300 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900 tonal:bg-[var(--tonal-surface)] tonal:text-[var(--tonal-fg)] tonal:hover:bg-[var(--tonal-surface-raised)]'

  if (slug !== null && slug in BLOG_REGISTRY) {
    const entry = BLOG_REGISTRY[slug]
    return (
      <button
        type="button"
        className={className}
        onClick={(e) => {
          e.stopPropagation()
          openPanel({ id: slug, title: entry.title })
        }}
      >
        {child.label}
      </button>
    )
  }

  if (slug !== null) {
    return (
      <Link
        href={href}
        className={className}
        onClick={(e) => e.stopPropagation()}
      >
        {child.label}
      </Link>
    )
  }

  if (!href) {
    return (
      <span className={`${className} cursor-default opacity-60`}>
        {child.label}
      </span>
    )
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      onClick={(e) => e.stopPropagation()}
    >
      {child.label}
    </a>
  )
}

function OrgLogo({
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

function RowHeader({ job }: { job: WorkExperience }) {
  const company = job.company.trim()
  const logoAlt =
    job.logoAlt?.trim() || company || job.title.trim() || 'Organization'
  return (
    <div className="relative flex w-full flex-row items-start justify-between gap-4">
      <div className="flex min-w-0 flex-row items-start gap-2.5">
        <OrgLogo logo={job.logo} alt={logoAlt} />
        <div className="min-w-0">
          <h4 className="text-sm font-normal dark:text-zinc-100 tonal:text-[var(--tonal-fg)]">
            {job.title}
          </h4>
          {company ? (
            <p className="text-sm text-zinc-500 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
              {company}
            </p>
          ) : null}
        </div>
      </div>
      <p className="shrink-0 whitespace-nowrap text-sm text-zinc-600 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
        {job.start} - {job.end}
      </p>
    </div>
  )
}

export function ExperienceRow({
  job,
  expanded,
  onToggleExpand,
  rowRef,
}: ExperienceRowProps) {
  const { open: openPanel } = usePanel()
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

  // Expanded (or resize while open): ensure fill covers the full card.
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
  const fillDurationMs = showFill ? FILL_MS : FILL_OUT_MS
  const children = job.children ?? []
  const isParent = children.length > 0

  const topClassName = 'relative z-10 w-full text-left'

  const fillLayer = (
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
  )

  const chipRail = isParent ? (
    <AnimatePresence initial={false}>
      {expanded ? (
        <motion.div
          key="rail"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative z-10 overflow-hidden"
        >
          <div
            className="pointer-events-none flex flex-wrap gap-2.5"
            onClick={(e) => e.stopPropagation()}
          >
            {children.map((child) => (
              <ChipButton key={child.id} child={child} />
            ))}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  ) : null

  if (isParent) {
    return (
      <div
        ref={setRefs}
        data-id={job.id}
        className="relative -mx-3 overflow-hidden rounded-lg"
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {fillLayer}
        <div
          className={`relative z-10 flex flex-col px-4 py-3.5${expanded ? ' gap-3' : ''}`}
        >
          <button
            type="button"
            className={`${topClassName} cursor-pointer`}
            aria-expanded={expanded}
            onClick={(e) => {
              e.stopPropagation()
              onToggleExpand()
            }}
          >
            <RowHeader job={job} />
          </button>
          {chipRail}
        </div>
      </div>
    )
  }

  const href = job.link.trim()
  const slug = blogSlugFromPath(href)

  const leafShell = (inner: ReactNode) => (
    <div
      ref={setRefs}
      data-id={job.id}
      className="relative -mx-3 overflow-hidden rounded-lg"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {fillLayer}
      <div className="relative z-10 px-4 py-3.5">{inner}</div>
    </div>
  )

  if (!href) {
    return leafShell(
      <div className={topClassName}>
        <RowHeader job={job} />
      </div>,
    )
  }

  if (slug !== null && slug in BLOG_REGISTRY) {
    const entry = BLOG_REGISTRY[slug]
    return leafShell(
      <button
        type="button"
        className={`${topClassName} cursor-pointer`}
        onClick={() => openPanel({ id: slug, title: entry.title })}
      >
        <RowHeader job={job} />
      </button>,
    )
  }

  if (slug !== null) {
    return leafShell(
      <Link href={href} className={`${topClassName} block cursor-pointer`}>
        <RowHeader job={job} />
      </Link>,
    )
  }

  return leafShell(
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${topClassName} block`}
    >
      <RowHeader job={job} />
    </a>,
  )
}
