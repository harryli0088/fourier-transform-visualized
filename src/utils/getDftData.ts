import complex from "./complexNumber"
import fft from "./fft"
import plural from "./plural"

export const DFT_FREQ_LIMIT = 10

/**
 * Calculate the DFT and some other data on some samples
 * @param values    sampled y values
 * @param timeSpan  time span in seconds
 * @returns         DFT and other data
 */
export default function getDftData(
  values: number[],
  timeSpan: number,
) {
  const complexPoints = values.map(r => complex.makeNew({r})) //convert the samples into complex numbers
  const dftPoints = fft(complexPoints).map((n,i) => ({ //find the DFT
    x: i/timeSpan,
    y: complex.magnitude(n)
  }))
  const slicedDftPoints = dftPoints.slice(0, complexPoints.length / 2).slice(0, DFT_FREQ_LIMIT*timeSpan + 1) //slice to 10

  const sampleRate = values.length / timeSpan
  const sampleRateText = `${sampleRate.toFixed(1)} ${plural(sampleRate, "sample")} per second (Hz)`

  return {
    dftPoints,
    sampleRate,
    sampleRateText,
    slicedDftPoints,
  }
}