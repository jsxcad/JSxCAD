[index](../../nb/api/index.md)
### area()
Parameter|Default|Type
---|---|---
op|value => shape => value|Function to receive the area.

Calls op(value)(shape) with the computed surface area of the shape.

![Image](area.md.$2.png)

```JavaScript
Box(2)
  .view()
  .area((a) => note(`Box(2).area() gives ${a}`));
```

![Image](area.md.$3.png)

```JavaScript
Box(2, 2, 2)
  .view()
  .area((a) => note(`Box(2, 2, 2).area() gives ${a}`));
```
