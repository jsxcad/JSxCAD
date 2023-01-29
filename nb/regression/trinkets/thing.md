```JavaScript
const core = await Group(
  Arc(11).ez([15.5]).z(4),
  Arc(7.85).ez([23.5]),
  Arc(30).ez([7]).z(4.5)
).view();
```

![Image](thing.md.core.png)

```JavaScript
const center = await Arc(6.26).ez([28.5]).cut(Box(10, 10).ez([31.5]).x(7.3)).view();
```

![Image](thing.md.center.png)

```JavaScript
const base = await core
  .cut(center)
  .ry(1 / 2)
  .color('olive')
  .z(4)
  .tag('gear')
  .view();
```

![Image](thing.md.base.png)

```JavaScript
const grabber = await Arc(12).ez([10]).z(-2).view();
```

![Image](thing.md.grabber.png)

```JavaScript
const final = await base.cut(grabber).stl('test shape.stl');
```

![Image](thing.md.final_test_shape.stl.png)

[test shape.stl.stl](thing.test%20shape.stl.stl)
