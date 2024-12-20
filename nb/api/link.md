[index](../../nb/api/index.md)
### link(...shapes)
Parameter|Default|Type
---|---|---
|...shapes||Shapes to link into a polyline.

Constructs a polyline from the segments of the shape and provided shapes.

The shapes are linked by straight segments.

The polyline is not closed.

See: [Link](../../nb/api/Link.nb), [loop](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/loop.md)

_Note: We should rethink Arc and Box being implicitly filled._

![Image](link.md.$2.png)

Line(5).link(Point(0, 8), Arc([4, 5], [4, 5], { end: 3 / 4 }))

```JavaScript
Line(5)
  .link(Point(0, 8), Arc([4, 5], [4, 5], { end: 3 / 4 }))
  .view()
  .note(
    'Line(5).link(Point(0, 8), Arc([4, 5], [4, 5], { end: 3 / 4 }))'
  );
```
