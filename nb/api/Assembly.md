### Assembly()
Parameter|Default|Type
---|---|---
...shapes||The shapes to assemble.

Produces a disjoint assembly of shapes.

```JavaScript
Assembly(
  Box(10).color('red'),
  Arc(8).color('green'),
  Triangle(6).y(2).color('blue')
)
  .view(1)
  .note(
    'Assembly(Box(10), Arc(8), Triangle(6)) assembles three shapes. The triangle cuts the arc and the box. The arc cuts the box.'
  )
  .pack()
  .view(2)
  .note('pack() disassembles the arrangement, showing the disjunction.');
```

![Image](Assembly.md.0.png)

Assembly(Box(10), Arc(8), Triangle(6)) assembles three shapes. The triangle cuts the arc and the box. The arc cuts the box.

![Image](Assembly.md.1.png)

pack() disassembles the arrangement, showing the disjunction.
