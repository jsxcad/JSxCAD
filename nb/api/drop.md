[index](../../nb/api/index.md)
### drop()
Parameter|Default|Type
---|---|---
|selector|self|Shape: the shapes to drop.

Drop removes the selected leaf shapes from shape.

get() and getNot() are common selectors.

See: [get](../../nb/api/get.md)

![Image](drop.md.$2_1.png)

Box(5, 5, 5).color('red').and(Orb(4).color('green').x(4))

![Image](drop.md.$2_2.png)

drop(get('color:red')) removes the red shapes.

![Image](drop.md.$2_3.png)

drop(getNot('color:yellow')) removes the non-yellow shapes.

```JavaScript
Box(5, 5, 5)
  .color('red')
  .and(Orb(4).color('green').x(4), Icosahedron(4).color('yellow').y(-4))
  .view(1)
  .note("Box(5, 5, 5).color('red').and(Orb(4).color('green').x(4))")
  .drop(get('color:red'))
  .view(2)
  .note("drop(get('color:red')) removes the red shapes.")
  .drop(getNot('color:yellow'))
  .view(3)
  .note("drop(getNot('color:yellow')) removes the non-yellow shapes.");
```
