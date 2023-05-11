[index](../../nb/api/index.md)
### Assembly()
Parameter|Default|Type
---|---|---
...shapes||The shapes to assemble.

Produces a disjoint assembly of shapes.

![Image](Assembly.md.$2_1.png)

Assembly(Box(10), Arc(8), Triangle(6)) assembles three shapes. The triangle cuts the arc and the box. The arc cuts the box.

![Image](Assembly.md.$2_2.png)

pack() disassembles the arrangement, showing the disjunction.

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
