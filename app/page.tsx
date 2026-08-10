'use client'
import { motion } from 'motion/react'
import { XIcon } from 'lucide-react'
import { Spotlight } from '@/components/ui/spotlight'
import { MagneticSocialLink } from '@/components/ui/magnetic-social-link'
import { TextEffect } from '@/components/ui/text-effect'
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogContainer,
} from '@/components/ui/morphing-dialog'
import Link from 'next/link'
import { EducationList } from '@/components/education/EducationList'
import { ExperienceList } from '@/components/experience/ExperienceList'
import {
  PROJECTS,
  BLOG_POSTS,
  EMAIL,
  CONTACT_LINK,
  SOCIAL_LINKS,
} from './data'
import { usePanel } from '@/components/panel/PanelContext'
import { BLOG_REGISTRY } from '@/lib/blog-registry'
import { blogSlugFromPath } from '@/lib/blog-path'

const VARIANTS_CONTAINER = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const VARIANTS_SECTION = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

const TRANSITION_SECTION = {
  duration: 0.3,
}

type ProjectVideoProps = {
  src?: string
  title?: string
}

function ProjectVideoPlaceholder({ title }: { title?: string }) {
  const trimmedTitle = title?.trim() ?? '';
  let initial = '?';
  if (trimmedTitle.length >= 2) {
    initial = trimmedTitle.charAt(0).toUpperCase() + trimmedTitle.charAt(1).toUpperCase();
  } else if (trimmedTitle.length === 1) {
    initial = trimmedTitle.charAt(0).toUpperCase();
  }

  return (
    <div
      className="flex aspect-video w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-zinc-200/80 bg-zinc-100/50 dark:border-zinc-700/80 dark:bg-zinc-900/40 tonal:border-[var(--tonal-border)] tonal:bg-[var(--tonal-surface)]/50"
      role="img"
      aria-label={title ? `No video preview for ${title}` : 'No video preview'}
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-200/80 text-sm font-semibold text-zinc-500 dark:bg-zinc-800/80 dark:text-zinc-400 tonal:bg-[var(--tonal-surface-raised)] tonal:text-[var(--tonal-fg-muted)]">
        {initial}
      </span>
      <span className="text-xs text-zinc-400 dark:text-zinc-500 tonal:text-[var(--tonal-fg-muted)]">
        No preview
      </span>
    </div>
  )
}

type ProjectStillImageProps = {
  src: string
  alt?: string
  title?: string
}

function ProjectStillImage({ src, alt, title }: ProjectStillImageProps) {
  const label = alt?.trim() || title?.trim() || 'Project preview'
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger>
        <img
          src={src}
          alt={label}
          className="aspect-video w-full cursor-zoom-in rounded-xl object-cover"
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative max-h-[85vh] max-w-[min(100vw-2rem,56rem)] rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50 tonal:bg-[var(--tonal-surface-raised)] tonal:ring-[var(--tonal-border)]">
          <img
            src={src}
            alt={label}
            className="max-h-[80vh] w-full rounded-xl object-contain"
          />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1 tonal:bg-[var(--tonal-surface-raised)]"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

type ProjectMediaProps = {
  video?: string
  image?: string
  imageAlt?: string
  title?: string
}

function ProjectMedia({ video, image, imageAlt, title }: ProjectMediaProps) {
  const v = video?.trim()
  if (v) {
    return <ProjectVideo src={v} title={title} />
  }
  const img = image?.trim()
  if (img) {
    return (
      <ProjectStillImage src={img} alt={imageAlt} title={title} />
    )
  }
  return <ProjectVideoPlaceholder title={title} />
}

function ProjectVideo({ src, title }: ProjectVideoProps) {
  if (!src?.trim()) {
    return <ProjectVideoPlaceholder title={title} />
  }

  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0,
        duration: 0.3,
      }}
    >
      <MorphingDialogTrigger>
        <video
          src={src}
          autoPlay
          loop
          muted
          className="aspect-video w-full cursor-zoom-in rounded-xl"
        />
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent className="relative aspect-video rounded-2xl bg-zinc-50 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950 dark:ring-zinc-800/50 tonal:bg-[var(--tonal-surface-raised)] tonal:ring-[var(--tonal-border)]">
          <video
            src={src}
            autoPlay
            loop
            muted
            className="aspect-video h-[50vh] w-full rounded-xl md:h-[70vh]"
          />
        </MorphingDialogContent>
        <MorphingDialogClose
          className="fixed top-6 right-6 h-fit w-fit rounded-full bg-white p-1 tonal:bg-[var(--tonal-surface-raised)]"
          variants={{
            initial: { opacity: 0 },
            animate: {
              opacity: 1,
              transition: { delay: 0.3, duration: 0.1 },
            },
            exit: { opacity: 0, transition: { duration: 0 } },
          }}
        >
          <XIcon className="h-5 w-5 text-zinc-500" />
        </MorphingDialogClose>
      </MorphingDialogContainer>
    </MorphingDialog>
  )
}

type BlogPostRow = (typeof BLOG_POSTS)[number]

function BlogCardInner({
  post,
  isOpen,
}: {
  post: BlogPostRow
  isOpen?: boolean
}) {
  return (
    <div
      className={
        post.coverImage
          ? 'flex flex-row items-start gap-4'
          : 'flex flex-col space-y-1'
      }
    >
      {post.coverImage ? (
        <div className="relative aspect-video w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-900 tonal:bg-[var(--tonal-surface-raised)]">
          <img
            src={post.coverImage}
            alt={post.coverAlt ?? ''}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="min-w-0 flex-1 space-y-1">
        <h4 className="font-normal dark:text-zinc-100 tonal:text-[var(--tonal-fg)]">
          {post.title}
          {isOpen && (
            <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-zinc-400 align-middle dark:bg-zinc-500" />
          )}
        </h4>
        <p className="text-zinc-500 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
          {post.description}
        </p>
      </div>
    </div>
  )
}

export default function Personal() {
  const { open: openPanel, items } = usePanel()

  return (
    <motion.main
      className="space-y-24"
      variants={VARIANTS_CONTAINER}
      initial="hidden"
      animate="visible"
    >
      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <div className="flex-1">
          <p className="text-zinc-600 pb-2 dark:text-zinc-400 tonal:text-[var(--tonal-tonal-accent)]">
          I build and operate systems to make real-world research in the real world, from platform infrastructure across Ed institutions to live EEG hardware networked and compute systems across performance spaces.
          </p>
        </div>
        <TextEffect
          as="p"
          preset="fade-in-blur"
          per="line"
          className="text-zinc-600 dark:text-zinc-500 tonal:text-[var(--tonal-fg-muted)]"
          delay={0.2}
          speedReveal={1}
        >
          I act as connective tissue between the siloed technical fields, disciplines to empower educators, artists, and researchers to realize their potential.
        </TextEffect>
      </motion.section>


      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Selected Projects</h3>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {PROJECTS.map((project) => (
            <div key={project.name} className="space-y-2">
              <div className="relative rounded-2xl bg-zinc-50/40 p-1 ring-1 ring-zinc-200/50 ring-inset dark:bg-zinc-950/40 dark:ring-zinc-800/50 tonal:bg-[var(--tonal-surface-raised)]/60 tonal:ring-[var(--tonal-border)]/80">
                <ProjectMedia
                  video={project.video}
                  image={project.image}
                  imageAlt={project.imageAlt}
                  title={project.name}
                />
              </div>
              <div className="px-1">
                <a
                  className="font-base group relative inline-block font-[450] text-zinc-900 dark:text-zinc-50 tonal:text-[var(--tonal-fg)]"
                  href={project.link}
                  {...(/^https?:\/\//i.test(project.link.trim())
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                >
                  {project.name}
                  <span className="absolute bottom-0.5 left-0 block h-[1px] w-full max-w-0 bg-zinc-900 dark:bg-zinc-50 tonal:bg-[var(--tonal-fg)] transition-all duration-200 group-hover:max-w-full"></span>
                </a>
                <p className="text-base text-zinc-600 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Experience</h3>
        <ExperienceList />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Education</h3>
        <EducationList />
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-3 text-lg font-medium">Blog</h3>
        <div className="flex flex-col space-y-2">
          {BLOG_POSTS.map((post) => {
            const slug = blogSlugFromPath(post.link)
            const hasPanel = slug !== null && slug in BLOG_REGISTRY
            const isOpen =
              slug !== null &&
              items.some((item) => item.id === slug)

            if (hasPanel) {
              return (
                <button
                  key={post.uid}
                  type="button"
                  data-id={post.uid}
                  onClick={() =>
                    openPanel({ id: slug, title: post.title })
                  }
                  className="relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] text-left dark:bg-zinc-600/30 tonal:bg-stone-400/35"
                >
                  <Spotlight
                    className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50 tonal:from-stone-700 tonal:via-stone-600 tonal:to-stone-500"
                    size={64}
                  />
                  <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950 tonal:bg-[var(--tonal-surface)]">
                    <BlogCardInner post={post} isOpen={isOpen} />
                  </div>
                </button>
              )
            }

            return (
              <Link
                key={post.uid}
                className="relative block w-full cursor-pointer overflow-hidden rounded-2xl bg-zinc-300/30 p-[1px] dark:bg-zinc-600/30 tonal:bg-stone-400/35"
                href={post.link}
                data-id={post.uid}
              >
                <Spotlight
                  className="from-zinc-900 via-zinc-800 to-zinc-700 blur-2xl dark:from-zinc-100 dark:via-zinc-200 dark:to-zinc-50 tonal:from-stone-700 tonal:via-stone-600 tonal:to-stone-500"
                  size={64}
                />
                <div className="relative h-full w-full rounded-[15px] bg-white p-4 dark:bg-zinc-950 tonal:bg-[var(--tonal-surface)]">
                  <BlogCardInner post={post} />
                </div>
              </Link>
            )
          })}
        </div>
      </motion.section>

      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Connect</h3>
        <p className="mb-5 text-zinc-600 dark:text-zinc-400 tonal:text-[var(--tonal-fg-muted)]">
          Feel free to contact me {' '}
          <a
            className="underline dark:text-zinc-300 tonal:text-[var(--tonal-fg)]"
            target="_blank"
            rel="noopener noreferrer"
            href={CONTACT_LINK}
          >
            {/* {EMAIL} */}
            here
          </a>
          .
        </p>
        <div className="flex items-center justify-start space-x-3">
          {SOCIAL_LINKS.map((link) => (
            <MagneticSocialLink key={link.label} link={link.link}>
              {link.label}
            </MagneticSocialLink>
          ))}
        </div>
      </motion.section>
    </motion.main>
  )
}
