### center()
Computes the centroid of shape.

```JavaScript
Triangle(5)
  .and(center())
  .view()
  .note('Triangle(5).and(center()) shows the centroid in the middle.');
```

![Image](center.md.0.png)

Triangle(5).and(center()) shows the centroid in the middle.

```JavaScript
Triangle(5)
  .join(Arc(4).y(2).x(2))
  .and(center())
  .view()
  .md(
    'Triangle(5).join(Arc(4).y(2).x(2)).and(center()) shows the centroid move as we change the shape.'
  );
```

![Image](center.md.1.png)

Triangle(5).join(Arc(4).y(2).x(2)).and(center()) shows the centroid move as we change the shape.

```JavaScript
Triangle(5)
  .join(Arc(4).y(2).x(2))
  .ez(-1)
  .and(center())
  .material('glass')
  .view()
  .note(
    'Triangle(5).join(Arc(4).y(2).x(2)).ez(-1).and(center()) shows the centroid of a volume'
  );
```

![Image](center.md.2.png)

Triangle(5).join(Arc(4).y(2).x(2)).ez(-1).and(center()) shows the centroid of a volume
