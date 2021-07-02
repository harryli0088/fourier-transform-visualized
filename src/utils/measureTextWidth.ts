const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

/**
 * Uses a canvas context to measure the pixel width of text
 * @param text the string to measure
 * @param font the font to use, optional
 * @returns    the pixel width of the text
 */
export default function measureTextWidth(
  text: string,
  font: string = "12px Arial",
) {
  ctx.font = font
  return ctx.measureText(text).width
}