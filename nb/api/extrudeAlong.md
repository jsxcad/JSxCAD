### extrudeAlong()
Parameter|Default|Type
---|---|---
|direction|_required_|Reference shape
|...extents||List of begin and end extents.

Extrudes the surface by the extents provided.
If the number of extents is odd, 0 will be appended.

The operator [e](../../nb/api/e.md) is supplied as shorthand for extrudeAlong(normal(), ...)

The operator [ex](../../nb/api/ex.md) is supplied as shorthand for extrudeAlong([1, 0, 0], ...)

The operator [ey](../../nb/api/ey.md) is supplied as shorthand for extrudeAlong([0, 1, 0], ...)

The operator [ez](../../nb/api/ez.md) is supplied as shorthand for extrudeAlong([0, 0, 1], ...)

See [e](../../nb/api/e.nb), [ex](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/ex.nb), [ey](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/ey.nb), [ez](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/ez.md)

_Consider renaming extrudeAlong to extrude._

```JavaScript
Box(10)
  .extrudeAlong([0, 0, 1], 1)
  .view()
  .note('Box(10).extrudeAlong([0, 0, 1], 1)');
```

![Image](extrudeAlong.md.0.png)

Box(10).extrudeAlong([0, 0, 1], 1)

```JavaScript
Box(10)
  .extrudeAlong([0, 0, 1], 5, 4, 3, 2, 1, 0)
  .view()
  .note('Box(10).extrudeAlong([0, 0, 1], 5, 4, 3, 2, 1, 0)');
```

![Image](extrudeAlong.md.1.png)

Box(10).extrudeAlong([0, 0, 1], 5, 4, 3, 2, 1, 0)

```JavaScript
Box(10)
  .extrudeAlong(Point(0, 1, 1), 1)
  .view()
  .note('Box(10).extrudeAlong(Point(0, 1, 1), 1) extrudes diagonally');
```

![Image](extrudeAlong.md.2.png)

Box(10).extrudeAlong(Point(0, 1, 1), 1) extrudes diagonally

```JavaScript
Box(10)
  .rx(1 / 8)
  .extrudeAlong(normal(), 1, -1)
  .view()
  .note(
    'Box(10).rx(1 / 8).extrudeAlong(normal(), 1) extrudes along the normal'
  );
```

![Image](extrudeAlong.md.3.png)

Box(10).rx(1 / 8).extrudeAlong(normal(), 1) extrudes along the normal
