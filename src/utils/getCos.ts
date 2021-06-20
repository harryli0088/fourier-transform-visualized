export default function getCos(
  freq: number = 1,
  offset: number = 0,
) {
  return (t: number) => Math.cos(freq*t + offset)
}

/**
 * Given multiple frequencies to add,
 * return a function that, given the time, returns the sum of the cosines
 * @param freqs array of frequencies to add up
 * @returns     a function that, given the time, returns the sum of the cosines
 */
export function getCombinedCos(
  freqs: number[] = [1]
) {
  const funcs = freqs.map(getCos) //map all the frequencies to cosine functions
  /**
   * @param t time in seconds
   * @returns sum of all the cosine functions at time t
   */
  return (t: number) => funcs.reduce((sum,func) => sum + func(t), 0)
}