[index](../../nb/api/index.md)
### Join()
Parameter|Default|Type
---|---|---
...shapes||The shapes to join
'exact'|false|Use exact, but slower, geometry

Join takes an empty geometry and extends it to cover the space of shapes.

See: [join](../../nb/api/join.md)

![Image](Join.md.$2.png)

Join(Box(1, 2, 3), Box(3, 2, 1))

```JavaScript
Join(Box(1, 2, 3), Box(3, 2, 1))
  .view()
  .note('Join(Box(1, 2, 3), Box(3, 2, 1))');
```

![Image](Join.md.$3.png)

Join(Box(1, 2), Box(2, 1))

```JavaScript
Join(Box(1, 2), Box(2, 1)).view().note('Join(Box(1, 2), Box(2, 1))');
```
