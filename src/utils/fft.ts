import type { ComplexNumber } from "./complexNumber";
import complex from "./complexNumber";

export default function fft(
  values: ComplexNumber[],
) {
  const X = []
  const N = values.length
  const half = N / 2
  if(N === 1) {
    return values
  }
  
  const X_e = fft(values.filter((v, i) => i%2 === 0))
  const X_o = fft(values.filter((v, i) => i%2 === 1))
  for(let k=0; k<half; ++k) {
    const p = X_e[k]
    const q = complex.multiply(
      exponent(k,N),
      X_o[k]
    )
    X[k] = complex.add(p, q)
    X[k + half] = complex.subtract(p, q)
  }
  return X
}

export function zeroPad(values: ComplexNumber[]) {
  const valuesCopy = values.slice()
  const length = valuesCopy.length
  const power = Math.log2(length)
  const nextPower = Math.ceil(power)
  const paddedLength = Math.pow(2, nextPower)
  for(let i = length; i<paddedLength; ++i) {
    valuesCopy.push(complex.makeNew({}))
  }
  return valuesCopy
}

const cacheExponents:{
  [N: string]: {
    [k: string]: ComplexNumber
  }
} = {}
function exponent(k: number, N: number):ComplexNumber {
  const x = -2 * Math.PI * k / N
  cacheExponents[N] = cacheExponents[N] || {}
  cacheExponents[N][k] = cacheExponents[N][k] || complex.makeNew({
    i: Math.sin(x),
    r: Math.cos(x),
  })
  return cacheExponents[N][k]
}