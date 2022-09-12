### bb()
Parameter|Default|Type
---|---|---
xMargin|1|Number of mm to add on the x axis.
yMargin|xMargin|Number of mm to add on the x axis.
zMargin|yMargin|Number of mm to add on the x axis.

Produces an axis-aligned bounding box dilated by the specified margin.

```JavaScript
Orb(5).and(bb(0).material('glass')).view().md('A minimal bounding box.');
```

![Image](bb.md.0.png)

A minimal bounding box.

```JavaScript
Orb(5)
  .and(bb(1).material('glass'))
  .view()
  .md('A bounding box with a margin of 1.');
```

![Image](bb.md.1.png)

A bounding box with a margin of 1.
