# shape.bend(radius)

Bends a shape onto a circle of the given radius.

The shape needs to have an appropriate meshing density.

See: [remesh](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/remesh.nb)

```JavaScript
Box(40, 1, 5)
  .y(20)
  .and(remesh().bend(20))
  .by(align())
  .view()
  .md('Box(40, 1, 5).y(20).and(remesh().bend(20))');
```

![Image](bend.md.0.png)

Box(40, 1, 5).y(20).and(remesh().bend(20))
