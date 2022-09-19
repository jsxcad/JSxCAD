### Loop(...shapes)
Parameter|Default|Type
---|---|---
|...shapes||Shapes to link into a closed polyline.

Constructs a polyline from the segments of the shape and provided shapes.

The shapes are linked by straight segments.

The polyline is closed.

See: [Link](../../nb/api/Link.md)

_Note: We should rethink Arc and Box being implicitly filled._

```JavaScript
Loop(
  Line(5),
  Point(0, 8),
  Arc([4, 5], [4, 5])
    .hasAngle(0 / 4, 3 / 4)
    .outline()
).view();
```

![Image](Loop.md.0.png)

```JavaScript
Seq(
  { by: 1 / 8, upto: 1 },
  (t) =>
    Arc(4)
      .hasAngle(3 / 8, 6 / 8)
      .x(5)
      .rz(t),
  Loop
).view();
```

![Image](Loop.md.1.png)
