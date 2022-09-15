### Polygon()
Parameter|Default|Type
---|---|---
...coordinates|[]|Coordinates of the vertices.

Constructs a polygon from a sequence of points.

```JavaScript
Polygon(Point(6).seq({ by: 1 / 8, upto: 1 }, rz))
  .view()
  .note(
    'Polygon(Point(10).seq({ by: 1 / 8, upto: 1 }, rz)) produces a regular octagon.'
  );
```

![Image](Polygon.md.0.png)

Polygon(Point(10).seq({ by: 1 / 8, upto: 1 }, rz)) produces a regular octagon.
