```JavaScript
const Rim = (diameter = 37, thickness = 2) =>
  Arc(diameter, { start: 1/4 })
    .eachPoint((p) => (s) => Orb(thickness).to(p), ChainHull);
```

```JavaScript
const Monocle = (
  diameter = 37,
  height = 11,
  frameThickness = 2,
  lensThickness = 2
) =>
  Rim(diameter, frameThickness)
    .z(0)
    .join(
      'exact',
      Hull(Arc(1.8, 3.6), Arc(3.6).z(height))
        .join('exact', Orb(3.6, 3.6, 2, { zag: 0.5 }).z(height))
        .x(37 / 2)
        .rz(3 / 360, 3 / 8, 267 / 360)
    )
    .fitTo(
      Arc(diameter)
        .ez([height - lensThickness, height])
        .masked(grow('z', 0.1))
        .material('glass')
        .as('lens')
    )
    .view()
    .stl(
      getNot('lens'),
      `frame-${diameter}x${height}x${frameThickness}x${lensThickness}`
    )
    .stl(
      get('lens'),
      `lens-${diameter}x${height}x${frameThickness}x${lensThickness}`
    );
```

![Image](monocle.md.monocle_37x12x2x2.png)

![Image](monocle.md.monocle_37x12x2x2.png)

[frame-37x12x2x2.stl](monocle.frame-37x12x2x2.stl)

![Image](monocle.md.monocle_37x12x2x2.png)

[lens-37x12x2x2.stl](monocle.lens-37x12x2x2.stl)

```JavaScript
const monocle_37x12x2x2 = await Monocle(37, 12, 2, 2);
```

![Image](monocle.md.simpleMonocle.png)

[s2.stl](monocle.s2.stl)

```JavaScript
const simpleMonocle = Arc(35)
  .cut(inset(1))
  .ez([0, 2], [8, 10])
  .join(Arc(33).cut(inset(1)).ez([10]))
  .clean()
  .fuse()
  .clip(ArcX(35, [16, -16], [-12, 12]).y(20 / 2))
  .join(Arc(35).cut(inset(1)).ez([0, 2]))
  .stl('s2');
```
