[index](../../nb/api/index.md)
### Triangle()
Parameter|Default|Type
---|---|---
...dimensions|[1, 1, 1]|The size of the bounding box of the triangle.

Produces an triangle or triangular prism that fits into the bounding box.

![Image](Triangle.md.$2.png)

Triangle(5)

```JavaScript
Triangle(5).view().note('Triangle(5)');
```

![Image](Triangle.md.$3.png)

Triangle(2, 4)

```JavaScript
Triangle(2, 4).view().note('Triangle(2, 4)');
```

![Image](Triangle.md.$4.png)

Triangle(2, 4, 1)

```JavaScript
Triangle(2, 4, 1).view().note('Triangle(2, 4, 1)');
```
