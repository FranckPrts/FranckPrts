'use client'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { TextLoop } from '@/components/ui/text-loop'
import { motion } from 'motion/react'
import { MonitorIcon, MoonIcon, SunIcon, Blend} from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

const THEMES_OPTIONS = [
  {
    label: 'Light',
    id: 'light',
    icon: <SunIcon className="h-4 w-4" />,
  },
  {
    label: 'Dark',
    id: 'dark',
    icon: <MoonIcon className="h-4 w-4" />,
  },
  {
    label: 'System',
    id: 'system',
    icon: <MonitorIcon className="h-4 w-4" />,
  },
  {
    label: 'Tonal',
    id: 'tonal',
    icon: <Blend className="h-4 w-4" />,
  },
]

function ThemeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <AnimatedBackground
      className="pointer-events-none rounded-lg bg-zinc-100 dark:bg-zinc-800 tonal:bg-[var(--tonal-surface-sunken)]"
      defaultValue={theme}
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.2,
      }}
      enableHover={false}
      onValueChange={(id) => {
        setTheme(id as string)
      }}
    >
      {THEMES_OPTIONS.map((theme) => {
        return (
          <button
            key={theme.id}
            className="inline-flex h-7 w-7 items-center justify-center text-zinc-500 transition-colors duration-100 focus-visible:outline-2 data-[checked=true]:text-zinc-950 dark:text-zinc-400 dark:data-[checked=true]:text-zinc-50 tonal:text-[var(--tonal-fg-muted)] tonal:data-[checked=true]:text-[var(--tonal-fg)]"
            type="button"
            aria-label={`Switch to ${theme.label} theme`}
            data-id={theme.id}
          >
            {theme.icon}
          </button>
        )
      })}
    </AnimatedBackground>
  )
}

function TonalPaletteTest() {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted || theme !== 'tonal') return null
  return (
    <div
      className="mt-3 flex flex-col gap-1"
      role="presentation"
      aria-hidden
    >
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 tonal:text-[var(--tonal-fg-muted)]">
        Tonal palette (test)
      </p>
      <div className="flex h-4 w-full max-w-xs gap-0.5 overflow-hidden rounded-md ring-1 ring-black/5 tonal:ring-[var(--tonal-border)]">
        <span
          className="h-full w-full rounded-l-sm"
          style={{ background: 'var(--tonal-surface)' }}
          title="surface"
        />
        <span
          className="h-full w-full"
          style={{ background: 'var(--tonal-surface-raised)' }}
          title="raised"
        />
        <span
          className="h-full w-full"
          style={{ background: 'var(--tonal-surface-sunken)' }}
          title="sunken"
        />
        <span
          className="h-full w-full"
          style={{ background: 'var(--tonal-fg-muted)' }}
          title="fg-muted"
        />
        <span
          className="h-full w-full rounded-r-sm"
          style={{ background: 'var(--tonal-border)' }}
          title="border"
        />
      </div>
    </div>
  )
}

export function Footer() {
  return (
    <motion.footer
      layout
      className="mt-24 border-t border-zinc-100 px-0 py-4 dark:border-zinc-800 tonal:border-[var(--tonal-border)]"
    >
      <div className="flex items-center justify-between">
        <a href="https://github.com/franckPrts" target="_blank">
        <span className="text-xs text-zinc-500 tonal:text-[var(--tonal-fg-muted)]">Built </span>
          <TextLoop className="text-xs text-zinc-500 tonal:text-[var(--tonal-fg-muted)]">
            <span>with Motion-Primitives.</span>
            <span>to keep track of my projects.</span>
            <span>to explain what I do to my parents.</span>
            <span>to have fun.</span>
          </TextLoop>
        </a>
        <div className="flex flex-row items-end text-xs text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
          <ThemeSwitch />
        </div>
      </div>
    </motion.footer>
  )
}