[index](../../nb/api/index.md)
### smooth()
Parameter|Default|Type
---|---|---
resolution|1|How smooth to make it.
...selections||Only smooth where covered by a selection shape.
{time}|5|
{resolution}|0.25|

Smooths the selected part of the shape.

The time parameter affects curvature.
The resolution is used to remesh the selection prior to smoothing.

![Image](smooth.md.$2.png)

Box(10, 10, [-5, 3]).join(Box(6, 6, [3, 5])).smooth(5, 0.25, outline().route(Box(1, 1, 1)))

```JavaScript
Box(10, 10, [-5, 3])
  .join(Box(6, 6, [3, 5]))
  .smooth(5, 0.25, outline().route(Box(1, 1, 1)))
  .view(clean())
  .note('Box(10, 10, [-5, 3]).join(Box(6, 6, [3, 5])).smooth(5, 0.25, outline().route(Box(1, 1, 1)))');
```

![Image](smooth.md.$3.png)

Box(2, 2, 15).join(rx(1 / 4), ry(1 / 4), 'exact').And(material('glass'), smooth(10, Box(10, 10, 10)))

```JavaScript
Box(2, 2, 15)
  .join(rx(1 / 4), ry(1 / 4), 'exact')
  .And(material('glass'), smooth(10, Box(10, 10, 10)))
  .view(clean())
  .note(`Box(2, 2, 15).join(rx(1 / 4), ry(1 / 4), 'exact').And(material('glass'), smooth(10, Box(10, 10, 10)))`);
```
