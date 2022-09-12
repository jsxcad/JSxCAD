# shape.clipFrom(other, ['exact', 'open', 'noVoid'])

Clips other by shape, rather than shape by other.

See: [clip](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/clip.nb)

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
