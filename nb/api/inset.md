### inset()
Parameter|Default|Type
---|---|---
initial|1|Number of mm to initially inset by.
{segments}|16|Number of segments for corners.
{step}||Number of mm for subsequent insetting.
{limit}||Maximum mm to inset by.

Produces a surface inscribed within the shape.

See: [offset](../../nb/api/offset.md).

```JavaScript
Arc(5)
  .join(Box(10, 2, 2))
  .cut(inset(0.5))
  .view()
  .note('Arc(5).join(Box(10, 2, 2)).cut(inset(0.5))');
```

![Image](inset.md.0.png)

Arc(5).join(Box(10, 2, 2)).cut(inset(0.5))

```JavaScript
Arc(5)
  .join(Box(10, 2, 2))
  .cut(inset(0.5, { step: 0.5 }))
  .view()
  .note(
    'Arc(5).join(Box(10, 2, 2)).cut(inset(0.5, { step: 0.1 })) produces further insets.'
  );
```

![Image](inset.md.1.png)

Arc(5).join(Box(10, 2, 2)).cut(inset(0.5, { step: 0.1 })) produces further insets.
