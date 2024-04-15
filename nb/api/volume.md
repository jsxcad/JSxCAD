[index](../../nb/api/index.md)
### volume()
Parameter|Default|Type
---|---|---
op|(volume) => (shape) => volume|Function receiving the computed volume.

See: [area](../../nb/api/area.md).

Box(1, 1, 1).volume((value) => note(value.toFixed(2))

1.00

```JavaScript
Box(1, 1, 1)
  .note("Box(1, 1, 1).volume((value) => note(value.toFixed(2))")
  .volume((value) => note(value.toFixed(2)));
```

Orb(1).volume((value) => note(value.toFixed(2)))

0.43

```JavaScript
Orb(1)
  .note("Orb(1).volume((value) => note(value.toFixed(2)))")
  .volume((value) => note(value.toFixed(2)));
```
