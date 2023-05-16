[index](../../nb/api/index.md)
### by()
Parameter|Default|Type
---|---|---
reference||The reference by which to transform shape.

Transforms shape by the provided reference.

![Image](by.md.$2_1.png)

Box(10).and(alignment('x>')) produces a box and a reference point

![Image](by.md.$2_2.png)

by(alignment('x>')) moves both by the reference.

```JavaScript
Box(10)
  .and(align('x>'))
  .view(1)
  .note("Box(10).and(alignment('x>')) produces a box and a reference point")
  .by(alignment('x>'))
  .view(2)
  .note("by(alignment('x>')) moves both by the reference.");
```
