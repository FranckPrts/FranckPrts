import type { MDXComponents } from 'mdx/types'
import {
  Children,
  ComponentPropsWithoutRef,
  createElement,
  isValidElement,
  type ElementType,
  type ReactElement,
  type ReactNode,
} from 'react'
import { highlight } from 'sugar-high'
import { MermaidBlock } from '@/components/mdx/MermaidBlock'

function isExternalHref(href: string | undefined) {
  if (!href) return false
  return (
    href.startsWith('http://') ||
    href.startsWith('https://') ||
    href.startsWith('//')
  )
}

function classNameHasMermaid(className: unknown): boolean {
  if (typeof className === 'string') return className.includes('language-mermaid')
  if (Array.isArray(className)) {
    return className.some(
      (c) => typeof c === 'string' && c.includes('language-mermaid'),
    )
  }
  return false
}

function reactNodeToString(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return ''
  if (typeof node === 'string' || typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(reactNodeToString).join('')
  if (isValidElement(node)) {
    return reactNodeToString(
      (node as ReactElement<{ children?: ReactNode }>).props.children,
    )
  }
  return ''
}

function isMermaidCodeBlock(
  child: ReactNode,
): child is ReactElement<{ className?: unknown; children?: ReactNode }> {
  if (!isValidElement<{ className?: unknown }>(child)) return false
  return classNameHasMermaid(child.props.className)
}

export function useMDXComponents(
  components: MDXComponents = {},
): MDXComponents {
  return {
    ...components,
    Picture: ({
      src,
      alt,
      caption,
    }: {
      src: string
      alt: string
      caption: string
    }) => {
      return (
        <figure className="flex flex-col items-center">
          <img src={src} alt={alt} className="rounded-xl w-xl border-2 border-zinc-200 dark:border-zinc-800 tonal:border-[var(--tonal-border)]" />
          <figcaption>{caption}</figcaption>
        </figure>
      )
    },
    pre: ({ children, ...props }: ComponentPropsWithoutRef<'pre'>) => {
      const only = Children.toArray(children)
      if (only.length === 1 && isMermaidCodeBlock(only[0])) {
        return (
          <MermaidBlock source={reactNodeToString(only[0].props.children)} />
        )
      }
      const DefaultPre = components.pre as ElementType | undefined
      if (DefaultPre) {
        return createElement(DefaultPre, props, children)
      }
      return <pre {...props}>{children}</pre>
    },
    code: ({ children, ...props }: ComponentPropsWithoutRef<'code'>) => {
      if (classNameHasMermaid(props.className)) {
        return <code {...props}>{children}</code>
      }
      const codeHTML = highlight(children as string)
      return <code dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
    },
    a: ({
      href,
      children,
      target,
      rel,
      ...rest
    }: ComponentPropsWithoutRef<'a'>) => {
      if (!isExternalHref(href)) {
        return (
          <a href={href} target={target} rel={rel} {...rest}>
            {children}
          </a>
        )
      }
      return (
        <a
          href={href}
          {...rest}
          target={target ?? '_blank'}
          rel={rel ?? 'noopener noreferrer'}
        >
          {children}
        </a>
      )
    },
  }
}
