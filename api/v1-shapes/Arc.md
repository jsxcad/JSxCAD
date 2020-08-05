# Arc

---

`Arc.ofRadius(radius, angle = 360, { start = 0, sides = 32 })`

> Draws an clockwise turning arc containing the number of angles, at the given
> radius.

`Arc(radius, angle = 360, { start = 0, sides = 32 })`

As for `Arc.ofRadius`

![Image](Arc.md.1.png)

`Arc(10, 90).topView();`

![Image](Arc.md.2.png)

`Arc(10, 90, { start: 45 }).topView();`

Issues:

1. Is Arc(20, 90, { start : 45 }) better than Arc(20, 90).rotate(45)?
