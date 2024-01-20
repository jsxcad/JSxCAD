[index](../../nb/api/index.md)
### gauge()
Parameter|Default|Type
---|---|---
...refs||Reference geometry for the gauge positions.
{offset}|5|Additional length for the gauge needles
{color}|'green'|The color to use for the gauge needles.

Generates a set of gauges for measuring width at a particular reference position.

![Image](gauge.md.$2.png)

Box(20).z(-5).hull(Point().z(5)).rz(1 / 8).gauge(0, Z({ from: -5, to: 5, by: 5 }))

```JavaScript
Box(20)
  .z(-5)
  .hull(Point().z(5))
  .rz(1 / 8)
  .gauge(0, Z({ from: -5, to: 5, by: 5 }))
  .view('top')
  .note("Box(20).z(-5).hull(Point().z(5)).rz(1 / 8).gauge(0, Z({ from: -5, to: 5, by: 5 }))");
```

![Image](gauge.md.$3.png)

Box(20).z(-5).hull(Point().z(5)).rz(1 / 8).gauge(15, RX({ by: 1 / 8, to: 1 / 2 }))

```JavaScript
Box(20)
  .z(-5)
  .hull(Point().z(5))
  .rz(1 / 8)
  .gauge(15, RX({ by: 1 / 8, to: 1 / 2 }))
  .view()
  .note('Box(20).z(-5).hull(Point().z(5)).rz(1 / 8).gauge(15, RX({ by: 1 / 8, to: 1 / 2 }))');
```
