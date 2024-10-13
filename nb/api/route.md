[index](../../nb/api/index.md)
### route()
Parameter|Default|Type
---|---|---
tool||The tool shape to route.

Follows the input segments with the vertically oriented tool shape.

![Image](route.md.tool.png)

tool = Arc(3).Loft(z(-1), z(-0.5), inset(1).z(-0.5), inset(1).z(0.5), z(0.5), z(1))

```JavaScript
const tool = Arc(3)
  .Loft(z(-1), z(-0.5), inset(1).z(-0.5), inset(1).z(0.5), z(0.5), z(1))
  .view()
  .note('tool = Arc(3).Loft(z(-1), z(-0.5), inset(1).z(-0.5), inset(1).z(0.5), z(0.5), z(1))');
```

![Image](route.md.path.png)

path = Box(20, 20, 20).cut(outline().route(tool))

```JavaScript
const path = Box(20, 20, 20)
  .cut(outline().route(tool))
  .view(clean())
  .note('path = Box(20, 20, 20).cut(outline().route(tool))');
```
