[index](../../nb/api/index.md)
### involute()
Produces a surface inscribed within the shape.

Reverses the faces of a shape.

This is occasionally useful for repairing shapes.

```JavaScript
Box(5, 5, 5).involute().view().note('Box(5, 5, 5) produces an inside out box.');
```

![Image](involute.md.0.png)

Box(5, 5, 5) produces an inside out box.

```JavaScript
Arc(5)
  .involute()
  .view()
  .note('Arc(5).involute() produces a downward facing surface');
```

![Image](involute.md.1.png)

Arc(5).involute() produces a downward facing surface
