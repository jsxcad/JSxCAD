[index](../../nb/api/index.md)
### center()
Computes the centroid of shape.

![Image](center.md.$2.png)

Triangle(5).and(center()) shows the centroid in the middle.

```JavaScript
Triangle(5)
  .and(center())
  .view()
  .note('Triangle(5).and(center()) shows the centroid in the middle.');
```

![Image](center.md.$3.png)

Triangle(5).join(Arc(4).y(2).x(2)).and(center()) shows the centroid move as we change the shape.

```JavaScript
Triangle(5)
  .join(Arc(4).y(2).x(2))
  .and(center())
  .view()
  .note(
    'Triangle(5).join(Arc(4).y(2).x(2)).and(center()) shows the centroid move as we change the shape.'
  );
```

![Image](center.md.$4.png)

Triangle(5).join(Arc(4).y(2).x(2)).ez([-1]).and(center()) shows the centroid of a volume

```JavaScript
Triangle(5)
  .join(Arc(4).y(2).x(2))
  .ez([-1])
  .and(center())
  .material('glass')
  .view()
  .note(
    'Triangle(5).join(Arc(4).y(2).x(2)).ez([-1]).and(center()) shows the centroid of a volume'
  );
```
