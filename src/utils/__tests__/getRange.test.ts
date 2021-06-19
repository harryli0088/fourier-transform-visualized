import getRange from "../getRange"

test("empty array", () => {
  expect(getRange([])).toStrictEqual([0,0])
})

test("simple test case", () => {
  expect(getRange([
    {x: 0, y: 10},
    {x: 1, y: 17},
    {x: 2, y: -1},
    {x: 3, y: 2},
    {x: 4, y: -3},
  ])).toStrictEqual([-3,17])
})