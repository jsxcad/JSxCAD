[index](../../nb/api/index.md)
### join()
Parameter|Default|Type
---|---|---
...others||The shapes to join
'exact'|false|Use exact, but slower, geometry

The shape is extended to cover the space of the others.

Join attempts to merge geometry of similar types.

Solids join solids, surfaces join coplanar surfaces, segments join segments, points join points.

![Image](join.md.$2.png)

Box(1, 2, 3).join(Box(3, 2, 1))

```JavaScript
Box(1, 2, 3).join(Box(3, 2, 1)).view().note('Box(1, 2, 3).join(Box(3, 2, 1))');
```

![Image](join.md.$3.png)

Box(1, 2).join(Box(2, 1))

```JavaScript
Box(1, 2).join(Box(2, 1)).view().note('Box(1, 2).join(Box(2, 1))');
```
