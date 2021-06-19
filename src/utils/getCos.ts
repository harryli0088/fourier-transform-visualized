export default function getCos(
  freq: number = 1,
  offset: number = 0,
) {
  return (t: number) => Math.cos(freq*t + offset)
}