[index](../../nb/api/index.md)
### normal()
Produces a reference point along the direction normal to the shape.

This can be visualized as a point.

For complex shapes the normal may be somewhat arbitrary and unintuitive.

See [extrudeAlong](../../nb/api/extrudeAlong.nb), [moveAlong](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/moveAlong.md).

![Image](normal.md.$2.png)

Box(5).and((s) => Edge(Point(), s.normal()), normal())

```JavaScript
await Box(5)
  .and((s) => Edge(Point(), s.normal()), normal())
  .view()
  .note('Box(5).and((s) => Edge(Point(), s.normal()), normal())');
```

![Image](normal.md.$3.png)

Arc(1, 1, 2).and((s) => Edge(Point(), s.normal()), normal())

```JavaScript
await Arc(1, 1, 2)
  .and((s) => Edge(Point(), s.normal()), normal())
  .view()
  .note('Arc(1, 1, 2).and((s) => Edge(Point(), s.normal()), normal())');
```
