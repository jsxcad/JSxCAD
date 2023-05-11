[index](../../nb/api/index.md)
### points()

Produces a set of points from the incoming shape.

![Image](points.md.$2.png)

Arc(5).x(-2, 2).points().view() produces a ring of points.

```JavaScript
Arc(5)
  .x(-2, 2)
  .points()
  .view()
  .note('Arc(5).x(-2, 2).points().view() produces a ring of points.');
```

![Image](points.md.$3.png)

Box(5, 5, 5).op(ghost(), remesh(1).points()) shows the points on the remeshes box surface.

```JavaScript
Box(5, 5, 5)
  .op(ghost(), remesh(1).points())
  .view()
  .note(
    'Box(5, 5, 5).op(ghost(), remesh(1).points()) shows the points on the remeshes box surface.'
  );
```
