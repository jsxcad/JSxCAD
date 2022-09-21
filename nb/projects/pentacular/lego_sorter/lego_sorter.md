```JavaScript
const grid = Hexagon(16)
  .seq(
    { from: -4, to: 4 },
    { from: -4, to: 4 },
    (i, j) =>
      move((i + (j % 2) * 0.5) * 18 * Math.sqrt(3) * 0.5, j * 18 * 0.75),
    Group
  )
  .gridView();
```

![Image](lego_sorter.md.0.png)

```JavaScript
const ring = Arc(99).cutFrom(Arc(102)).ez(2.5).gridView();
```

![Image](lego_sorter.md.1.png)

```JavaScript
const base = grid.cutFrom(Arc(100)).ez(1).gridView();
```

![Image](lego_sorter.md.2.png)

```JavaScript
const wall1 = grid
  .cutFrom(Box(80, 110))
  .rz(1 / 4)
  .ez(2)
  .rx(1 / 4);
```

```JavaScript
const sorter = ring.and(base).stl('sorter');
```

![Image](lego_sorter.md.3.png)

[sorter_0.stl](lego_sorter.sorter_0.stl)

```JavaScript
const wall = wall1
  .by(align('x<'))
  .and(by(align('x>')))
  .by(align('x<'))
  .and(by(align('x>')))
  .by(align('x<'))
  .and(by(align('x>')))
  .view();
```

![Image](lego_sorter.md.4.png)

```JavaScript
const bentWall = wall
  .clip(Box(475, 50, 500))
  .scale(1 / 1.5)
  .by(align('z>'))
  .y(51)
  .bend(50)
  .view();
```

![Image](lego_sorter.md.5.png)

```JavaScript
bentWall.and(ring, base, ring.z(52)).scale(1.5).view().stl('tall_sorter');
```

![Image](lego_sorter.md.6.png)

![Image](lego_sorter.md.7.png)

[tall_sorter_0.stl](lego_sorter.tall_sorter_0.stl)
