### shape.cut(...other, ['exact', 'open', 'noVoid'])

Removes the coverage of shape that covered by any of the other shapes.

Flags:
* 'exact' uses slower but exact computations. Non-exact maintains a watertight manifold.
* 'open' may produce a surface rather than a solid.
* 'noVoid' does not cut void geometry.

See: [cutFrom](#https://raw.githubusercontent.com/jsxcad/JSxCAD/master/nb/api/cutFrom.nb)

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
