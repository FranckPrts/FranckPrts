'use client'
import { TextEffect } from '@/components/ui/text-effect'
import Link from 'next/link'

export function Header() {
  return (
    <header className="mb-8 flex items-center justify-between">
      <div>
        <Link href="/" className="text-4xl font-medium">
          <TextEffect
            as="h1"
            preset="fade-in-blur"
            per="word"
            className="text-black dark:text-white tonal:text-[var(--tonal-fg)]"
            delay={0}
            speedReveal={1}
          >
              Franck Porteous
          </TextEffect>
        </Link>
      </div>
    </header>
  )
}
