# shape.area(op = value => shape => value)

Calls op(value)(shape) with the computed surface area of the shape.

_Check: Does op have a useful signature?_

```JavaScript
Box(2)
  .view()
  .area((v) => (s) => s.md(`A 2x2 box has an area of ${v}`));
```

![Image](area.md.0.png)

A 2x2 box has an area of 4.000000000000002

```JavaScript
Box(2, 2, 2)
  .view()
  .area((v) => (s) => s.md(`A 2x2x2 box has an area of ${v}`));
```

![Image](area.md.1.png)

A 2x2x2 box has an area of 24.000000000000014
