### Points()
Parameter|Default|Type
---|---|---
...coordinates|[0, 0, 0]|Coordinates of the points.

Constructs a point at the coordinate.

```JavaScript
Points([
  [1, 2, 3],
  [3, 2, 1],
  [0, 0, 0],
])
  .and(loop())
  .view()
  .note(
    'Points([[1, 2, 3], [3, 2, 1], [0, 0, 0]]).and(loop()) shows three points linked together.'
  );
```

![Image](Points.md.0.png)

Points([[1, 2, 3], [3, 2, 1], [0, 0, 0]]).and(loop()) shows three points linked together.