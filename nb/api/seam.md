[index](../../nb/api/index.md)
### seam()
Parameter|Default|Type
---|---|---
...selections||Shapes to select the areas to seam.

Add non-geometric edges where the selections intersect the shape.

See: [demesh](../../nb/api/demesh.nb), [remesh](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/remesh.md).

![Image](seam.md.$2.png)

Box(5, 5, 5).seam(Box([0, 5], [0, 5], [0, 5])) adds seams around a corner

```JavaScript
Box(5, 5, 5)
  .seam(Box([0, 5], [0, 5], [0, 5]))
  .view('wireframe')
  .note(
    'Box(5, 5, 5).seam(Box([0, 5], [0, 5], [0, 5])) adds seams around a corner'
  );
```

![Image](seam.md.$3.png)

Box(5, 5, 5).seam(Arc(4, 3, 5)) adds cylindrical seams

```JavaScript
Box(5, 5, 5)
  .seam(Arc(4, 3, 5))
  .view('wireframe')
  .note('Box(5, 5, 5).seam(Arc(4, 3, 5)) adds cylindrical seams');
```
