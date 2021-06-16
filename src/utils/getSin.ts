export default function getSin(
  freq: number = 1,
  offset: number = 0,
) {
  return (x: number) => Math.sin(freq*x*2*Math.PI + offset)
}