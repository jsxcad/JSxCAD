### Point()
Parameter|Default|Type
---|---|---
...coordinate|[0, 0, 0]|Coordinate of the point.

Constructs a point at the coordinate.

```JavaScript
Point(1, 2, 3)
  .and((s) => Edge(Point(), s))
  .view()
  .note(
    'Point(1, 2, 3).and((s) => Edge(Point(), s)) shows a point at [1, 2, 3].'
  );
```

![Image](Point.md.0.png)

Point(1, 2, 3).and((s) => Edge(Point(), s)) shows a point at [1, 2, 3].
