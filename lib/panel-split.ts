export const DEFAULT_INDEX_WIDTH = 640
export const MIN_INDEX_WIDTH = 320
export const MIN_PANEL_WIDTH = 400

export function clampIndexWidth(width: number, layoutWidth: number): number {
  const max = Math.max(MIN_INDEX_WIDTH, layoutWidth - MIN_PANEL_WIDTH)
  return Math.min(Math.max(width, MIN_INDEX_WIDTH), max)
}
