import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Credits',
  description: 'Tools, fonts, libraries, and assets used to build this site.',
  alternates: {
    canonical: '/credit',
  },
}

type Credit = {
  name: string
  href: string
  note: string
}

type CreditSection = {
  title: string
  items: Credit[]
}

const SECTIONS: CreditSection[] = [
  {
    title: 'Development',
    items: [
      {
        name: 'Cursor',
        href: 'https://cursor.com/',
        note: 'IDE used to build and iterate on this site',
      },
    ],
  },
  {
    title: 'Inspiration & structure',
    items: [
      {
        name: 'Nim',
        href: 'https://tympanus.net/codrops/2025/02/01/nim-nextjs-react-tailwind-motion-template/',
        note: 'Creative direction and code structure this site was originally based on',
      },
    ],
  },
  {
    title: 'Assets',
    items: [
      {
        name: 'Faces',
        href: 'https://faces.notion.com/',
        note: 'Favicon illustration',
      },
      {
        name: 'Inkscape',
        href: 'https://inkscape.org/',
        note: 'Favicon SVG refinement',
      },
    ],
  },
  {
    title: 'UI & motion',
    items: [
      {
        name: 'Motion Primitives',
        href: 'https://motion-primitives.com/',
        note: 'Animated UI components used throughout the site',
      },
      {
        name: 'Motion',
        href: 'https://motion.dev/',
        note: 'Animation library powering those components',
      },
      {
        name: 'Lucide',
        href: 'https://lucide.dev/',
        note: 'Icons',
      },
      {
        name: 'next-themes',
        href: 'https://github.com/pacocoursey/next-themes',
        note: 'Light, dark, system, and tonal theme switching',
      },
    ],
  },
  {
    title: 'Typography',
    items: [
      {
        name: 'Inter',
        href: 'https://fonts.google.com/specimen/Inter',
        note: 'Primary UI typeface',
      },
      {
        name: 'JetBrains Mono',
        href: 'https://fonts.google.com/specimen/JetBrains+Mono',
        note: 'Code and monospace typeface',
      },
    ],
  },
  {
    title: 'Content & code',
    items: [
      {
        name: 'MDX',
        href: 'https://mdxjs.com/',
        note: 'Blog posts and rich markdown content',
      },
      {
        name: 'Mermaid',
        href: 'https://mermaid.js.org/',
        note: 'Diagrams in blog posts',
      },
      {
        name: 'sugar-high',
        href: 'https://github.com/huozhi/sugar-high',
        note: 'Syntax highlighting in MDX',
      },
    ],
  },
  {
    title: 'Stack',
    items: [
      {
        name: 'Next.js',
        href: 'https://nextjs.org/',
        note: 'App framework and routing',
      },
      {
        name: 'React',
        href: 'https://react.dev/',
        note: 'UI library',
      },
      {
        name: 'Tailwind CSS',
        href: 'https://tailwindcss.com/',
        note: 'Styling, including Typography plugin for prose',
      },
    ],
  },
]

function CreditLink({ name, href }: Pick<Credit, 'name' | 'href'>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-[450] text-zinc-900 underline decoration-zinc-300 underline-offset-2 transition-colors hover:text-zinc-700 dark:text-zinc-50 dark:decoration-zinc-600 dark:hover:text-zinc-300 tonal:text-[var(--tonal-fg)] tonal:decoration-[var(--tonal-border)] tonal:hover:text-[var(--tonal-fg)]"
    >
      {name}
    </a>
  )
}

export default function CreditPage() {
  return (
    <main className="space-y-12">
      <div>
        <h1 className="mb-2 text-lg font-medium dark:text-zinc-100 tonal:text-[var(--tonal-fg)]">
          Credits
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
          Tools, fonts, libraries, and assets that I have used to make this website. A particular thanks for thse open source projects and initiatives that make a pretty internet possible.
        </p>
      </div>

      <div className="space-y-10">
        {SECTIONS.map((section) => (
          <section key={section.title}>
            <h2 className="mb-4 text-sm font-medium text-zinc-500 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
              {section.title}
            </h2>
            <ul className="space-y-3">
              {section.items.map((item) => (
                <li
                  key={item.name}
                  className="text-sm text-zinc-500 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]"
                >
                  <CreditLink name={item.name} href={item.href} />
                  <span aria-hidden> — </span>
                  <span>{item.note}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="text-sm text-zinc-500 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
        <Link
          href="/"
          className="underline decoration-zinc-300 underline-offset-2 transition-colors hover:text-zinc-700 dark:decoration-zinc-600 dark:hover:text-zinc-300 tonal:decoration-[var(--tonal-border)] tonal:hover:text-[var(--tonal-fg)]"
        >
          Back home
        </Link>
      </p>
    </main>
  )
}
