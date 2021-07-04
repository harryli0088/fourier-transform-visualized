import getRange from "../getRange"
import type { PointType } from "../types"

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


test("accessor", () => {
  expect(getRange([
    {x: 0, y: 10},
    {x: 1, y: 17},
    {x: 2, y: -1},
    {x: 3, y: 2},
    {x: 5, y: -3},
    {x: 4, y: -3},
  ], (p: PointType) => p.x)).toStrictEqual([0, 5])
})

test("min is zero or lower", () => {
  expect(getRange([
    {x: 0, y: 10},
    {x: 1, y: 17},
    {x: 2, y: 11},
    {x: 3, y: 21},
    {x: 4, y: 3},
  ])).toStrictEqual([0,21])
})