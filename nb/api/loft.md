[index](../../nb/api/index.md)
### loft(...shapes)
Parameter|Default|Type
---|---|---
...shapes||Shapes to loft between.
'open'|false|Cap the ends of the loft.

Lofts a surface between pairs of shapes, potentially forming a volume.

Note that the incoming shape provides context but is not automatically included in the loft.

_Note: loft is a work in progress and has limited functionality._

![Image](loft.md.$2.png)

Box(5).loft(z(5).rz(1 / 8)) lofts a Box by 5 mm with a 1/8 rotation.

```JavaScript
Box(5)
  .loft(z(5).rz(1 / 8))
  .view()
  .note(
    'Box(5).loft(z(5).rz(1 / 8)) lofts a Box by 5 mm with a 1/8 rotation.'
  );
```

![Image](loft.md.$3.png)

Box(5).loft(Arc(4).z(5)) lofts a box by 5 mm to a circle.

```JavaScript
Box(5)
  .loft(Arc(4).z(5))
  .view()
  .note('Box(5).loft(Arc(4).z(5)) lofts a box by 5 mm to a circle.');
```
