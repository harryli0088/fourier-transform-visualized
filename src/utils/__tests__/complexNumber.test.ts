import complex from "../complexNumber"

describe("constructor", () => {
  test("empty r and i", () => {
    const n = complex.makeNew({})
    expect(n.i).toStrictEqual(0)
    expect(n.r).toStrictEqual(0)
  })

  test("empty i", () => {
    const n = complex.makeNew({r: 14})
    expect(n.i).toStrictEqual(0)
    expect(n.r).toStrictEqual(14)
  })

  test("empty r", () => {
    const n = complex.makeNew({i: 17})
    expect(n.i).toStrictEqual(17)
    expect(n.r).toStrictEqual(0)
  })

  test("set r and i", () => {
    const n = complex.makeNew({i: 11, r: 10})
    expect(n.i).toStrictEqual(11)
    expect(n.r).toStrictEqual(10)
  })
})

test("add", () => {
  const n = complex.makeNew({i: 4, r: 3})
  const sum = complex.add(n, complex.makeNew({i: 7, r: 13}))
  expect(sum).toMatchObject({i: 11, r: 16 })
})

test("subtract", () => {
  const n = complex.makeNew({i: 100, r: 200})
  const diff = complex.subtract(n, complex.makeNew({i: 25, r: 31}))
  expect(diff).toMatchObject({i: 75, r: 169})
})

test("multiply", () => {
  const n = complex.makeNew({i: 3, r: 2})
  const prod = complex.multiply(n, complex.makeNew({i: 5, r: 4}))
  expect(prod).toMatchObject({i: 22, r: -7})
})

test("conjugate", () => {
  const n = complex.makeNew({i: 3, r: 2})
  const conj = complex.conjugate(n)
  expect(conj).toMatchObject({i: -3, r: 2})
})

test("divide", () => {
  const n = complex.makeNew({i: -4, r: 20})
  const quot = complex.divide(n, complex.makeNew({i: 2, r: 3}))
  expect(quot).toMatchObject({i: -4, r: 4})
})

test("magnitude", () => {
  expect(complex.magnitude(complex.makeNew({i: 0, r: 10}))).toStrictEqual(10)
  expect(complex.magnitude(complex.makeNew({i: -13, r: 0}))).toStrictEqual(13)
  expect(complex.magnitude(complex.makeNew({i: -4, r: 3}))).toStrictEqual(5)
  expect(complex.magnitude(complex.makeNew({i: 5, r: -12}))).toStrictEqual(13)
})

test("phase", () => {
  expect(complex.phase(complex.makeNew({i: -10, r: -10}))).toStrictEqual(-Math.PI*3/4)
  expect(complex.phase(complex.makeNew({i: -10, r: 0}))).toStrictEqual(-Math.PI/2)
  expect(complex.phase(complex.makeNew({i: -10, r: 10}))).toStrictEqual(-Math.PI/4)
  expect(complex.phase(complex.makeNew({i: 0, r: 10}))).toStrictEqual(0)
  expect(complex.phase(complex.makeNew({i: 10, r: 10}))).toStrictEqual(Math.PI/4)
  expect(complex.phase(complex.makeNew({i: 10, r: 0}))).toStrictEqual(Math.PI/2)
  expect(complex.phase(complex.makeNew({i: 10, r: -10}))).toStrictEqual(Math.PI*3/4)
})