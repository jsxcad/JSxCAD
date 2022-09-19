### volume()
Parameter|Default|Type
---|---|---
op|(volume) => (shape) => volume|Function receiving the computed volume.

See: [area](../../nb/api/area.md).

```JavaScript
Box(1, 1, 1)
  .note("Box(1, 1, 1).volume((value) => note('' + value)")
  .volume((value) => note('' + value));
```

Box(1, 1, 1).volume((value) => note('' + value)

1

```JavaScript
Orb(1)
  .note("Orb(1).volume((value) => note('' + value))")
  .volume((value) => note('' + value));
```

Orb(1).volume((value) => note('' + value))

0.43463137275279373
