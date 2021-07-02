const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

/**
 * Uses a canvas context to measure the pixel width of text
 * @param text      the string to measure
 * @param fillStyle the fill style to use, optional
 * @returns         the pixel width of the text
 */
export default function measureTextWidth(
  text: string,
  fillStyle: string = "12px Arial",
) {
  ctx.fillStyle = fillStyle
  return ctx.measureText(text).width
}