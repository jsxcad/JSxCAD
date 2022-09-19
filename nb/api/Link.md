### Link()
Parameter|Default|Type
---|---|---
|...shapes||Shapes to link into a polyline.

Constructs a polyline from the segments of shapes.

The shapes are linked by straight segments.

The polyline is not closed.

See: [Loop](../../nb/api/Loop.md)

_Note: We should rethink Arc and Box being implicitly filled._

```JavaScript
Link(
  Line(5),
  Point(0, 8),
  Arc([4, 5], [4, 5])
    .hasAngle(0 / 4, 3 / 4)
    .outline()
).view();
```

![Image](Link.md.0.png)

```JavaScript
Seq(
  { by: 1 / 8, upto: 1 },
  (t) =>
    Arc(4)
      .hasAngle(3 / 8, 6 / 8)
      .x(5)
      .rz(t),
  Link
).view();
```

![Image](Link.md.1.png)
