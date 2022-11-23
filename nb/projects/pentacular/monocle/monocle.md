```JavaScript
const Rim = (diameter = 37, thickness = 2) =>
  Arc(diameter, { start: 1/4 })
    .eachPoint((p) => (s) => p.Orb(thickness), ChainHull);
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
        .ez(height - lensThickness, height)
        .mask(grow('z', 0.1))
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

```JavaScript
const monocle_37x12x2x2 = await Monocle(37, 12, 2, 2);
```

![Image](monocle.md.monocle_37x12x2x2.png)

[lens-37x12x2x2_1.stl](monocle.lens-37x12x2x2_1.stl)
