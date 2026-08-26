declare module '*.mdx' {
  import type { ComponentType } from 'react'

  export const metadata: {
    title?: string
    relatedPost?: string
    forks?: Array<{
      slug: string
      label: string
      blurb: string
    }>
  }

  const MDXContent: ComponentType
  export default MDXContent
}
