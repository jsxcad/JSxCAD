[index](../../nb/api/index.md)
### fair()
Parameter|Default|Type
---|---|---
resolution|1|Mesh resolution to apply for fairing.
...selections|[]|The volume to select for fairing.

Makes curves within the selected region as smooth as possible.

![Image](fair.md.$2.png)

Box(10, 10, [-5, 3]).join(Box(6, 6, [3, 5])).fair(0.5, outline().route(Box(1, 1, 1)))

```JavaScript
Box(10, 10, [-5, 3])
  .join(Box(6, 6, [3, 5]))
  .fair(0.5, outline().route(Box(1, 1, 1)))
  .view(clean())
  .note('Box(10, 10, [-5, 3]).join(Box(6, 6, [3, 5])).fair(0.5, outline().route(Box(1, 1, 1)))');
```
