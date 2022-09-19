### Arc()
Parameter|Default|Type
---|---|---
...dimensions|[1, 1, 1]|The size of the bounding box of the arc.

Produces an arc z axis within the dimensions provided.

Arc is equivanent to ArcZ.

See: [ArcX](../../nb/api/ArcX.nb), [ArcY](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/ArcY.nb), [ArcZ](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/ArcZ.md).

```JavaScript
Group(Arc(4), Arc(4, [3, 4]))
  .view()
  .md('Dimensions may be ranges.');
```

![Image](Arc.md.0.png)

Dimensions may be ranges.

```JavaScript
Arc(4, 5, 6).view().md('Three dimensions are supported.');
```

![Image](Arc.md.1.png)

Three dimensions are supported.

```JavaScript
Arc(4)
  .hasAngle(1 / 16, 15 / 16)
  .view()
  .md('Angle constraints can be supplied to produce open arcs.');
```

![Image](Arc.md.2.png)

Angle constraints can be supplied to produce open arcs.

```JavaScript
Arc(4)
  .hasAngle(1 / 16, 15 / 16)
  .and(Point())
  .loop()
  .fill()
  .view()
  .md('Points are ordered to allow loops.');
```

![Image](Arc.md.3.png)

Points are ordered to allow loops.
