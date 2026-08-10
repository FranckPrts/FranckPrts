import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { ExpandableAccordionProvider } from '@/components/expandable/ExpandableAccordionContext'
import { PanelProvider } from '@/components/panel/PanelContext'
import { AppShell } from './AppShell'

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export const metadata: Metadata = {
  metadataBase: new URL('https://franckporteous.com/'),
  alternates: {
    canonical: '/'
  },
  title: {
    default: 'Franck Prts',
    template: '%s | Franck Prts'
  },
  description:  "A website about Franck",
  icons: {
    icon: [{ url: '/icons/favicon.svg', type: 'image/svg+xml' }],
  },
};

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-code',
  subsets: ['latin'],
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} bg-white tracking-tight antialiased dark:bg-zinc-950 tonal:bg-[var(--tonal-surface)] tonal:text-[var(--tonal-fg)]`}
        suppressHydrationWarning
      >
        <ThemeProvider
          enableSystem={true}
          attribute="class"
          storageKey="theme"
          defaultTheme="system"
          themes={['light', 'dark', 'system', 'tonal']}
        >
          <div className="font-[family-name:var(--font-inter)]">
            <PanelProvider>
              <ExpandableAccordionProvider>
                <AppShell>{children}</AppShell>
              </ExpandableAccordionProvider>
            </PanelProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
