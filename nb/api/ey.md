### ey()
Parameter|Default|Type
---|---|---
|...extents||List of begin and end extents.

Extrudes the surface along the y axis by the extents provided.

See [extrudeAlong](../../nb/api/extrudeAlong.nb), [e](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/e.nb), [ex](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/ex.nb), [ez](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/ez.md)

```JavaScript
Box(10)
  .rx(1 / 4)
  .ey(1, -1, 4, 3)
  .view()
  .note(
    'Box(10).rx(1 / 4).ey(1, -1, 4, 3) extrudes along the y axis by two extents'
  );
```

![Image](ey.md.0.png)

Box(10).rx(1 / 4).ey(1, -1, 4, 3) extrudes along the y axis by two extents
