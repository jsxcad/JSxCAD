### mask()
Parameter|Default|Type
---|---|---
other||mask to apply.

Makes other into a mask for shape.

When the result is cut away from something, other will be removed, and shape will not be involved in the operation.

This allows for things like threaded bolts with cylindrical hole fittings.

See: [masking](../../nb/api/masking.md)

```JavaScript
Arc(4)
  .ez(10)
  .mask(Hexagon(6).ez(10))
  .fit(Box(8, 8, 4))
  .view()
  .note(
    'Arc(4).ez(10).mask(Hexagon(6).ez(10)) masks a cylinder with a hexagonal prism.'
  );
```

![Image](mask.md.0.png)

Arc(4).ez(10).mask(Hexagon(6).ez(10)) masks a cylinder with a hexagonal prism.
