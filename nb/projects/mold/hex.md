```JavaScript
const assembled = Hexagon(50, 50, 50)
  .eachEdge(
    (e, l) =>
      Box([0, l], [0, 5], [0, -1])
        .join(ArcX([0, l], [4, 7.0], 3).hasAngle(0 / 4, 2 / 4))
        .to(e),
    (f, e) => f.e(1).join(e)
  )
  .view();
```

![Image](hex.md.0.png)

```JavaScript
const disassembled = assembled
  .each(to(XY()))
  .pack()
  .view();
```

![Image](hex.md.1.png)
