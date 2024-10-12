![Image](shape_2.md.$1.png)

```JavaScript
Box(20)
  .ez(2)
  .clean()
  .And(color('red'), shell([2]).color('green'))
  .clip(YZ(0))
  .view();
```

![Image](shape_2.md.$2.png)

```JavaScript
Box(20)
  .ez(2)
  .clean()
  .And(color('red'), shell([-1000000, 2], 'protect').color('green'))
  .clip(YZ(0))
  .view();
```

![Image](shape_2.md.$3.png)

```JavaScript
Line(20).grow(Arc(1)).view();
```

```JavaScript
const Squiggle = (seed = 0, to = 10) =>
  Curve(
    Seq({ to }, (t) => random(2, t + seed * to, (x, y) => Point(10 * x, 10 * y))),
    to * 10
  );
```

![Image](shape_2.md.$4_2.png)

```JavaScript
Squiggle(1, 10).grow(Arc(0.5)).view(2);
```

![Image](shape_2.md.$5.png)

```JavaScript
await Assembly(Box(5), Arc(5.5).gap()).noGap().gridView();
```

![Image](shape_2.md.$6.png)

```JavaScript
Box(8, 12)
  .join(Box(12, 8))
  .And(points(), curve('closed', 200))
  .gridView();
```

![Image](shape_2.md.$7.png)

```JavaScript
Box(10)
  .and(Arc(plus(diameter(), 1)))
  .fill('holes')
  .view();
```

![Image](shape_2.md.$8.png)

```JavaScript
Box(10)
  .and(Arc(times(diameter(), 3/4)))
  .fill('holes')
  .view();
```

![Image](shape_2.md.$9.png)

```JavaScript
Box(10).x({ to: 100, by: 11 }).view();
```

![Image](shape_2.md.$10.png)

```JavaScript
Box(10).rz({ by: 1/3 }).view();
```
