```JavaScript
const assembled = await Hexagon(50, 50, 50)
  .eachEdge(
    (e, l) => (s) =>
      Box([0, 5], [0, -1], [0, l])
        .join(Arc([4, 7.0], 3, [0, l], { start: 1 / 4, end: 3 / 4 }))
        .to(e),
    (e, f) => (s) => f.e([1]).join(e)
  )
  .view();
```
