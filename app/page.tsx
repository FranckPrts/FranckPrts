'use client'
import { motion } from 'motion/react'
import { MagneticSocialLink } from '@/components/ui/magnetic-social-link'
import { TextEffect } from '@/components/ui/text-effect'
import { BlogPostList } from '@/components/blog/BlogPostList'
import { EducationList } from '@/components/education/EducationList'
import { ExperienceList } from '@/components/experience/ExperienceList'
import { ProjectList } from '@/components/projects/ProjectList'
import { EMAIL, CONTACT_LINK, SOCIAL_LINKS } from './data'
import { DesignIcon } from '@/lib/design-system'

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

export default function Personal() {
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
          I build and operate systems in collaboration with neuroscience researchers, educators, and artists, to enable making real-world research. My works supports STEM education and provide tooling for researchers dedicated to improving it.
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
          I'm particularly interested in social neuroscience, BCIs, and tech (no surprise there) with an ephasis on these fields intersection with urban design and development.
        </TextEffect>
        <div className="mt-3 flex items-center gap-3">
          {SOCIAL_LINKS.map((link) =>
            link.icon ? (
              <a
                key={link.label}
                href={link.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="text-zinc-400 transition-colors hover:text-zinc-900 dark:text-zinc-500 dark:hover:text-zinc-100 tonal:text-[var(--tonal-fg-muted)] tonal:hover:text-[var(--tonal-fg)]"
              >
                <DesignIcon name={link.icon} className="size-4" />
              </a>
            ) : null,
          )}
        </div>
      </motion.section>


      <motion.section
        variants={VARIANTS_SECTION}
        transition={TRANSITION_SECTION}
      >
        <h3 className="mb-5 text-lg font-medium">Projects Highlights</h3>
        <ProjectList />
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
        <h3 className="mb-3 text-lg font-medium">Projects & Blog</h3>
        <BlogPostList />
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
