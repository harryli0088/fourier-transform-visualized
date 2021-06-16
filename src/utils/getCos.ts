export default function getCos(
  freq: number = 1,
  offset: number = 0,
) {
  return (x: number) => Math.cos(freq*x*2*Math.PI + offset)
}