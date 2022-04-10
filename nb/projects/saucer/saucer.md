```JavaScript
const profile = Arc(1)
  .hasAngle(0 / 4, 2 / 4)
  .x(10)
  .and(Point(5, -2), Point(0.001, -2), Point(0.001, -1), Point(5, -1))
  .loop()
  .fill()
  .view();
```

![Image](saucer.md.0.png)

```JavaScript
const saucer = profile
  .rx(1 / 4)
  .seq({ by: 1 / 8 }, rz, Loft)
  .view();
```

![Image](saucer.md.1.png)

```JavaScript
saucer
  .and(
    (s) => s.lowerEnvelope().ez(-1).z(-5),
    (s) => s.upperEnvelope().ez(1).z(5)
  )
  .align('z>')
  .view(1);
```

![Image](saucer.md.2.png)
