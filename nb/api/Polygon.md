[index](../../nb/api/index.md)
### Polygon()
Parameter|Default|Type
---|---|---
...coordinates|[]|Coordinates of the vertices.

Constructs a polygon from a sequence of points.

![Image](Polygon.md.$2.png)

Polygon(Point(10).seq({ by: 1 / 8, upto: 1 }, rz)) produces a regular octagon.

```JavaScript
Polygon(Point(6).seq({ by: 1 / 8, upto: 1 }, rz))
  .view()
  .note(
    'Polygon(Point(10).seq({ by: 1 / 8, upto: 1 }, rz)) produces a regular octagon.'
  );
```
