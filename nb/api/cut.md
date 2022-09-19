### cut()
Parameter|Default|Type
---|---|---
...others||The shapes to join
'exact'|false|Use exact, but slower, computations
'open'|false|May produce a surface rather than a solid
'noVoid'|false|Does not cut void shapes.

The results should be watertight manifolds.

See: [cutFrom](../../nb/api/cutFrom.md)

```JavaScript
Box(10)
  .color('blue')
  .cut(Arc(12).color('red'))
  .view()
  .md("Box(10).color('blue').clip(Arc(12).color('red'))");
```

![Image](cut.md.0.png)

Box(10).color('blue').clip(Arc(12).color('red'))

```JavaScript
Box(10)
  .ez(2)
  .material('copper')
  .cut(Orb(5))
  .view()
  .md("Box(10).ez(2).material('copper').clip(Orb(5))");
```

![Image](cut.md.1.png)

Box(10).ez(2).material('copper').clip(Orb(5))

```JavaScript
Box(10, 10, 10)
  .cut(Box(12, 12, 8), 'open')
  .view()
  .md("Box(10, 10, 10).clip(Box(12, 12, 8), 'open')");
```

![Image](cut.md.2.png)

Box(10, 10, 10).clip(Box(12, 12, 8), 'open')
