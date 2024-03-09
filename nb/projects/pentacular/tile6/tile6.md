```JavaScript
const Tile = (play) =>
  Box(24 - play, 24 - play, [3])
    .cut(
      Box(2 + play, [4, 12], [2 + play * 2])
        .x(4, -4)
        .rz({ by: 1 / 4 }),
      Arc(14 + play / 2)
        .cut(Arc(10 - play / 2))
        .ez([2 + play * 2])
    )
    .clean()
    .view();
```

![Image](tile6.md.tile.png)

![Image](tile6.md.tile.png)

![Image](tile6.md.tile.png)

```JavaScript
const tile = Tile(0.2).clip(py.z(3)).maskedBy(Tile(0)).view();
```

```JavaScript
const Grid = (l, w) =>
  Box(l * 24 - 0.2, w * 24 - 0.2, [3])
    .cut(
      tile
        .x({ from: l * -12, upto: l * 12, by: 24 })
        .y({ from: w * -12, upto: w * 12, by: 24 })
    )
    .view();
```

![Image](tile6.md.grid1x1.png)

![Image](tile6.md.grid1x1.png)

```JavaScript
const grid1x1 = Grid(1, 1).view();
```

![Image](tile6.md.grid2x2.png)

![Image](tile6.md.grid2x2.png)

```JavaScript
const grid2x2 = Grid(2, 2).view();
```

![Image](tile6.md.grid3x3.png)

![Image](tile6.md.grid3x3_grid3x3.png)

[grid3x3.stl](tile6.grid3x3.stl)

```JavaScript
const grid3x3 = Grid(3, 3).stl('grid3x3');
```

```JavaScript
const contourFlagstone1 = LoadPng('t/flagstone1.png', { by: 1 / 4 }, (l, h) =>
  ez([h])
)
  .align('xyz>')
  .view()
  .v(11);
```

```JavaScript
const contourRiverbed1 = LoadPng('t/riverbed1.png', { by: 1 / 8 }, (l, h) =>
  ez([h])
)
  .align('xy')
  .v(7)
  .view();
```

![Image](tile6.md.$2.png)

```JavaScript
Box(10).ez(1).view().v(9);
```

```JavaScript
const contourTile1 = LoadPng('t/tile1.png', { by: 1 / 10 }, (l, h) => ez([h]))
  .align('xyz>')
  .scaleToFit(23, 23, 2)
  .v(7)
  .view();
```

```JavaScript
const contourWood1 = LoadPng('t/wood1.png', { by: 1 / 10 }, (l, h) => ez([h]))
  .align('xyz>')
  .scaleToFit(23, 23, 2)
  .v(7)
  .view();
```

```JavaScript
const contourSoil1 = LoadPng('t/soil1.png', { by: 1 / 10 }, (l, h) => ez([h]))
  .align('xy')
  .v(7)
  .view();
```

```JavaScript
const contourStone1 = LoadPng('t/stone1.png', { by: 1 / 10 }, (l, h) => ez([h]))
  .align('xy')
  .v(7)
  .view();
```

```JavaScript
const contourRocks1 = LoadPng('t/rocks1.png', { by: 1 / 10 }, (l, h) => e([h]))
  .align('xy')
  .v(7)
  .view();
```

```JavaScript
const contourBrick1 = LoadPng('t/brick2.png', { by: 1 / 10 }, (l, h) =>
  ez([0, h])
)
  .align('xyz>')
  .scaleToFit(36, 36, 2)
  .clip(Box(23, 23, [2]))
  .v(7)
  .view();
```

```JavaScript
const py = Box(23).hull(Point(0, 0, -11.5));
```

```JavaScript
const Wall = (tile) =>
  grid1x1
    .noGap()
    .y(12, -12)
    .cutFrom(
      tile
        .align('z>')
        .and(rz(1 / 4).sz(-1))
        .ry(-1 / 4)
        .align('z>')
        .z(3, 3 + 24)
        .and(Box(7, 23, [3]))
        .clip(
          py
            .sz(1, -1)
            .ry(-1 / 4)
            .align('z>')
            .z(3, 4 - 24, 3 + 24)
            .fuse()
        )
        .and(Box(0.8, 22, [2, 24 * 2]))
    )
    .clean();
```

```JavaScript
const contourWreath1 = LoadPng(
  'https://jsxcad.js.org/png/wreath.png',
  { by: 1 / 20 },
  (l, h) => ez([0, h])
)
  .align('xyz>')
  .scaleToFit(23, 23, 2)
  .v(8)
  .view();
```
