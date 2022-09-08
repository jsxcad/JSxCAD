Assembly(...shapes)

Produces a disjoint assembly of shapes.

```JavaScript
Assembly(Box(10), Arc(8), Triangle(6))
  .view(1)
  .md('The assembled assembly.')
  .pack()
  .view(2)
  .md('The disassembled assembly.');
```

![Image](Assembly.md.0.png)

The assembled assembly.

![Image](Assembly.md.1.png)

The disassembled assembly.
