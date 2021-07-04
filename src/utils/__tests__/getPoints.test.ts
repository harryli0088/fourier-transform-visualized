import getPoints from "../getPoints"

test("specify numPoints, don't include end point", () => {
  const funcs = [
    (x:number)=>x,
    (x:number)=>x*x
  ]
  const includeEndPoint = false;

  ([1, 2, 3]).forEach(span => {
    ([10, 20, 30]).forEach(numPoints => {
      funcs.forEach(f => {
        expect(
          getPoints([0,span], f,numPoints,includeEndPoint)
        ).toEqual(Array.from(new Array(numPoints).keys()).map(i => {
          const x = span*i/numPoints
          return {
            x, y: f(x)
          }
        }))
      })
    })
  })
})

test("undefined numPoints, don't include end point", () => {
  const funcs = [
    (x:number)=>x,
    (x:number)=>x*x
  ]
  const includeEndPoint = false;

  ([1, 2, 3]).forEach(span => {
    funcs.forEach(f => {
      expect(
        getPoints([0,span], f,undefined,includeEndPoint)
      ).toEqual(Array.from(new Array(span*1000).keys()).map(i => {
        const x = i/1000
        return {
          x, y: f(x)
        }
      }))
    })
  })
})



test("specify numPoints, do include end point", () => {
  const funcs = [
    (x:number)=>x,
    (x:number)=>x*x
  ]
  const includeEndPoint = true;

  ([1, 2, 3]).forEach(span => {
    ([10, 20, 30]).forEach(numPoints => {
      funcs.forEach(f => {
        expect(
          getPoints([0,span], f,numPoints,includeEndPoint)
        ).toEqual(Array.from(new Array(numPoints-1).keys()).map(i => {
          const x = span*i/(numPoints - 1)
          return {
            x, y: f(x)
          }
        }).concat([{x:span, y:f(span)}]))
      })
    })
  })
})

test("undefined numPoints, do include end point", () => {
  const funcs = [
    (x:number)=>x,
    (x:number)=>x*x
  ]
  const includeEndPoint = true;

  ([1, 2, 3]).forEach(span => {
    funcs.forEach(f => {
      expect(
        getPoints([0,span], f,undefined,includeEndPoint)
      ).toEqual(Array.from(new Array(span*1000 - 1).keys()).map(i => {
        const x = span*i/(span*1000 - 1)
        return {
          x, y: f(x)
        }
      }).concat([{x:span, y:f(span)}]))
    })
  })
})

//TODO different spans? different start domains?