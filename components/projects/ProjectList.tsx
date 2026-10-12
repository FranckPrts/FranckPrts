'use client'

import { SELECTED_PROJECTS } from '@/app/data'
import { BiteDialog } from '@/components/panel/BiteDialog'
import { usePanel } from '@/components/panel/PanelContext'
import { ProjectMedia } from '@/components/projects/ProjectMedia'
import { resolveContentLink } from '@/lib/content-link'

type Project = (typeof SELECTED_PROJECTS)[number]

const PROJECT_NAME_CLASS =
  'font-base group relative inline-block text-left font-[450] text-zinc-900 dark:text-zinc-50 tonal:text-[var(--tonal-fg)]'

function ProjectNameUnderline() {
  return (
    <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 dark:bg-zinc-50 tonal:bg-[var(--tonal-fg)] transition-all duration-200 group-hover:max-w-full" />
  )
}

function ProjectCard({ project }: { project: Project }) {
  const { open: openPanel, items } = usePanel()
  const resolved = resolveContentLink(
    (project.panel ?? '').trim() || project.link,
  )
  const isOpen =
    resolved.kind === 'panel' &&
    items.some((item) => item.id === resolved.slug)
  const href = project.link.trim()
  const isExternal = /^https?:\/\//i.test(href)
  const bite =
    resolved.kind === 'bite'
      ? { id: resolved.id, title: resolved.title }
      : undefined
  const media = {
    video: project.video,
    image: project.image,
    imageAlt: project.imageAlt,
  }

  return (
    <div className="space-y-2">
      <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50 tonal:bg-[var(--tonal-surface-raised)]/60 tonal:ring-[var(--tonal-border)]/80">
        <ProjectMedia {...media} title={project.name} bite={bite} />
      </div>
      <div className="px-1">
        {bite ? (
          <BiteDialog
            id={bite.id}
            title={bite.title}
            className={PROJECT_NAME_CLASS}
            media={media}
          >
            {project.name}
            <ProjectNameUnderline />
          </BiteDialog>
        ) : resolved.kind === 'panel' ? (
          <button
            type="button"
            className={PROJECT_NAME_CLASS}
            onClick={() =>
              openPanel({ id: resolved.slug, title: resolved.title })
            }
          >
            {project.name}
            {isOpen ? (
              <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-zinc-400 align-middle dark:bg-zinc-500" />
            ) : null}
            <ProjectNameUnderline />
          </button>
        ) : (
          <a
            className={PROJECT_NAME_CLASS}
            href={href}
            {...(isExternal
              ? { target: '_blank', rel: 'noopener noreferrer' }
              : {})}
          >
            {project.name}
            <ProjectNameUnderline />
          </a>
        )}
        <p className="text-base text-zinc-600 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
          {project.description}
        </p>
      </div>
    </div>
  )
}

export function ProjectList() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {SELECTED_PROJECTS.map((project) => (
        <ProjectCard key={project.name} project={project} />
      ))}
    </div>
  )
}
