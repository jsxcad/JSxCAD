# shape.by(reference)

Transforms shape by the provided reference.

```JavaScript
Box(10)
  .and(align('x>'))
  .view(1)
  .md('The box and a reference point')
  .by(align('x>'))
  .view(2)
  .md('Both moved by the reference.');
```

![Image](by.md.0.png)

The box and a reference point

![Image](by.md.1.png)

Both moved by the reference.
