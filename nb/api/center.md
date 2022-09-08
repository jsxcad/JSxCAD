# shape.center()

Computes the centroid of shape.

```JavaScript
Triangle(5)
  .and(center())
  .view()
  .md('The center() of a triangle is in the middle.');
```

![Image](center.md.0.png)

The center() of a triangle is in the middle.

```JavaScript
Triangle(5)
  .join(Arc(4).y(2).x(2))
  .and(center())
  .view()
  .md('The center() moves if we change the shape.');
```

![Image](center.md.1.png)

The center() moves if we change the shape.

```JavaScript
Triangle(5)
  .join(Arc(4).y(2).x(2))
  .ez(-1)
  .cut(center())
  .material('glass')
  .view()
  .md('center() works on volumes, too.');
```

![Image](center.md.2.png)

center() works on volumes, too.
