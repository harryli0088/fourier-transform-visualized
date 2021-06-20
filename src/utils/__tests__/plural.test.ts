import plural from "../plural"

test("singular cases", () => {
  expect(plural(1, "box", "boxes")).toEqual("box")
  expect(plural(1, "cat")).toEqual("cat")
  expect(plural(1, "dog")).toEqual("dog")
  expect(plural(1, "fox", "foxes")).toEqual("fox")
  expect(plural(1, "lion")).toEqual("lion")
})

test("plural cases", () => {
  for(let i=-5; i<10; ++i) {
    if(i !== 1) {
      expect(plural(i, "box", "boxes")).toEqual("boxes")
      expect(plural(i, "cat")).toEqual("cats")
      expect(plural(i, "dog")).toEqual("dogs")
      expect(plural(i, "fox", "foxes")).toEqual("foxes")
      expect(plural(i, "lion")).toEqual("lions")
    }
  }
})