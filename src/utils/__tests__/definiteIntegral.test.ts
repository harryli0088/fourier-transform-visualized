import definiteIntegral from "../definiteIntegral"

test("definiteIntegral cases, x squared", () => {
  const func = (x: number) => x**2
  for(let i =-100; i < 100; ++i) {
    for(let j=-100; j < 100; ++j) {
      expect(definiteIntegral(func, i, j)).toStrictEqual(j**2 - i**2)
    }
  }
})