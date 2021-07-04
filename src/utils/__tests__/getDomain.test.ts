import getDomain from "../getDomain"

test("empty array", () => {
  expect(getDomain([])).toEqual([0,0])
})

test("one element array", () => {
  expect(getDomain([
    {x: 1, y: 0},
  ])).toEqual([0,0])
})

test("two element array", () => {
  expect(getDomain([
    {x: 1, y: 0},
    {x: 2, y: 10},
  ])).toEqual([1,2])
})

test("five element array", () => {
  expect(getDomain([
    {x: 1, y: 0},
    {x: 2, y: 10},
    {x: 3, y: 1},
    {x: 4, y: 3},
    {x: 5, y: 4},
  ])).toEqual([1,5])
})