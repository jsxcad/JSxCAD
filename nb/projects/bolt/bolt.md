```JavaScript
const Profile = (pitch = 1, angle = 60 / 360) =>
  Path(
    Point(0, 1 / -2),
    Point(pitch / -2, 1 / 2),
    Point(pitch / 2, 1 / 2),
    Point(0, 1 / -2)
  ).fill();
```

Show the fit.

```JavaScript
export const ScrewThread = (
  diameter,
  height,
  { pitch = 1, angle, play = 0.1, lefthanded = false } = {}
) =>
  Profile(pitch, angle)
    .y(diameter / -2 + 1 / 2 + play * 2)
    .ry(1 / 4)
    .loft(
      ...seq((t) => (s) => s.rz(t).z(pitch * t * 1.001), {
        from: -1 / 2,
        by: 1 / 32,
        to: 3 / 2,
      })
    )
    .scale(lefthanded ? 1 : -1, lefthanded ? 1 : -1, 1)
    .clip(Box(diameter).ex(pitch))
    .z(...seq((a) => a, { from: 0, to: height, by: pitch }))
    .clip(Box(diameter).ex(height))
    .and(Arc(diameter - 2).ex(height));
```

```JavaScript
export const NutThread = (
  diameter,
  height,
  { pitch = 1, angle, play = 0.1, lefthanded = false } = {}
) =>
  Profile(pitch, angle)
    .rz(1 / 2)
    .y(diameter / -2 + 1 / 2 - play * 2)
    .ry(1 / 4)
    .loft(
      ...seq((t) => (s) => s.rz(t).z(pitch * t * 1.001), {
        from: -1 / 2,
        by: 1 / 32,
        to: 3 / 2,
      })
    )
    .scale(lefthanded ? 1 : -1, lefthanded ? 1 : -1, 1)
    .clip(Box(diameter + 2).ex(pitch))
    .z(...seq((a) => a, { from: 0, to: height, by: pitch }))
    .clip(Box(diameter + 2).ex(height))
    .rz(1 / 2)
    .mask(Arc(diameter).ex(height));
```

```JavaScript
const profile = Profile().view();
```

![Image](bolt.md.0.png)

```JavaScript
const nutThread = NutThread(20, 10)
  //.and(Arc(30).cut(Arc(20)).ex(10))
  .material('steel')
  .stl('nut 20x10');
```

![Image](bolt.md.1.png)

[nut 20x10_0.stl](bolt.nut 20x10_0.stl)

```JavaScript
const screwThread = ScrewThread(20, 10)
  .cut(
    Box(2, 10)
      .ex(10, 5)
      .rz(0, 1 / 4)
  )
  .material('steel')
  .stl('thread 20x10');
```

![Image](bolt.md.2.png)

[thread 20x10_0.stl](bolt.thread 20x10_0.stl)

```JavaScript
ScrewThread(10, 5)
  .and(NutThread(10, 5).and(Arc(15).cut(Arc(10)).ex(5)))
  .view()
  .view({ op: section() });
```

![Image](bolt.md.3.png)

![Image](bolt.md.4.png)
