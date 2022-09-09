### eachPoint
Parameter|Default|Type
---|---|---
|pointOp|(point, shape) => edge|Function to transform points.
|groupOp|Group|Function to group transformed points.

pointOp may be a shape, in which case it is equivalent to point => pointOp.to(point)

Takes each point shape as an individual reference.

```JavaScript
Box(5, 5, 5)
  .cutFrom(eachPoint((p) => Orb(3).to(p)))
  .view()
  .md('Box(5, 5, 5).cutFrom(eachPoint((p) => Orb(3).to(p)))');
```

![Image](eachPoint.md.0.png)

Box(5, 5, 5).cutFrom(eachPoint((p) => Orb(3).to(p)))

```JavaScript
Box(5, 5, 5)
  .outline()
  .and(eachPoint(Arc(4)))
  .view()
  .md('Box(5, 5, 5).outline().and(eachPoint(Arc(4)))');
```

![Image](eachPoint.md.1.png)

Box(5, 5, 5).outline().and(eachPoint(Arc(4)))
