### clipFrom()
Parameter|Default|Type
---|---|---
other||The shape to clip
'exact'|false|Use exact, but slower, computations
'open'|false|May produce a surface rather than a solid
'noVoid'|false|Does not clip void shapes.
Clips other by shape, rather than shape by other.

See: [clip](../../nb/api/clip.md)

```JavaScript
Box(10)
  .color('blue')
  .clipFrom(Arc(12).color('red'))
  .view()
  .md("Box(10).color('blue').clipFrom(Arc(12).color('red'))");
```

![Image](clipFrom.md.0.png)

Box(10).color('blue').clipFrom(Arc(12).color('red'))

```JavaScript
Box(10)
  .color('blue')
  .clip(Arc(12).color('red'))
  .view()
  .md("Box(10).color('blue').clip(Arc(12).color('red'))");
```

![Image](clipFrom.md.1.png)

Box(10).color('blue').clip(Arc(12).color('red'))
