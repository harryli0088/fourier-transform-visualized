import lastArrEle from "../lastArrEle"

test("empty array", () => {
  expect(lastArrEle([])).toEqual(undefined)
})

test("one element array", () => {
  expect(lastArrEle([4])).toEqual(4)
  expect(lastArrEle(["b"])).toEqual("b")
})

test("multi element array", () => {
  expect(lastArrEle([5,7,3,1,8,2])).toEqual(2)
  expect(lastArrEle(["c","b","a"])).toEqual("a")
})