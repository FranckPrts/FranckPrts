import type { MermaidConfig } from 'mermaid'

/**
 * Hex palettes for Mermaid `theme: 'base'` + `themeVariables`.
 * Light/dark: zinc-adjacent values aligned with prose (Tailwind zinc scale).
 * Tonal: keep in sync with `html.tonal` in app/globals.css
 */
const ZINC_LIGHT = {
  darkMode: false,
  background: '#ffffff',
  textColor: '#18181b',
  primaryColor: '#f4f4f5',
  primaryTextColor: '#18181b',
  secondaryColor: '#e4e4e7',
  tertiaryColor: '#fafafa',
  lineColor: '#d4d4d8',
  primaryBorderColor: '#d4d4d8',
  noteBkgColor: '#fafafa',
  noteTextColor: '#3f3f46',
  noteBorderColor: '#e4e4e7',
  clusterBkg: '#fafafa',
  clusterBorder: '#e4e4e7',
  titleColor: '#18181b',
  edgeLabelBackground: '#f4f4f5',
} as const satisfies Record<string, string | boolean>

const ZINC_DARK = {
  darkMode: true,
  background: '#09090b',
  textColor: '#f4f4f5',
  primaryColor: '#27272a',
  primaryTextColor: '#f4f4f5',
  secondaryColor: '#3f3f46',
  tertiaryColor: '#18181b',
  lineColor: '#52525b',
  primaryBorderColor: '#3f3f46',
  noteBkgColor: '#27272a',
  noteTextColor: '#e4e4e7',
  noteBorderColor: '#3f3f46',
  clusterBkg: '#18181b',
  clusterBorder: '#3f3f46',
  titleColor: '#f4f4f5',
  edgeLabelBackground: '#27272a',
} as const satisfies Record<string, string | boolean>

/** Same hex as `html.tonal` in app/globals.css */
const TONAL = {
  darkMode: true,
  background: '#0a1208',
  textColor: '#ddd8cc',
  primaryColor: '#1b2717',
  primaryTextColor: '#ddd8cc',
  secondaryColor: '#12210e',
  tertiaryColor: '#0a1208',
  lineColor: '#2b3d22',
  primaryBorderColor: '#2b3d22',
  noteBkgColor: '#12210e',
  noteTextColor: '#ddd8cc',
  noteBorderColor: '#2b3d22',
  clusterBkg: '#12210e',
  clusterBorder: '#2b3d22',
  titleColor: '#7d9970',
  edgeLabelBackground: '#1b2717',
} as const satisfies Record<string, string | boolean>

const DIAGRAM_FONT =
  "'Inter', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'"

export function getMermaidInitializeConfig(
  resolvedTheme: string | undefined,
): MermaidConfig {
  let themeVariables: Record<string, string | boolean>

  if (resolvedTheme === 'dark') {
    themeVariables = { ...ZINC_DARK }
  } else if (resolvedTheme === 'tonal') {
    themeVariables = { ...TONAL }
  } else {
    themeVariables = { ...ZINC_LIGHT }
  }

  themeVariables.fontFamily = DIAGRAM_FONT

  return {
    startOnLoad: false,
    theme: 'base',
    themeVariables,
  }
}
