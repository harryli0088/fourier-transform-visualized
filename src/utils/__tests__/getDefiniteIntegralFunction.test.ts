import complex from "../complexNumber"
import getDefiniteIntegralFunction from "../getDefiniteIntegralFunction"

test("getDefiniteIntegralFunction cases, x squared", () => {
  const func = (t: number) => (freq: number) => complex.makeNew({
    i: freq*t,
    r: t
  })
  for(let i=-20; i<20; ++i) {
    for(let j=-20; j<20; ++j) {
      for(let freq=0; freq<10; ++freq) {
        expect(getDefiniteIntegralFunction(func, i, j)(freq)).toEqual(complex.makeNew({
          i: j * freq - i * freq,
          r: j - i
        }))
      }
    }
  }
})