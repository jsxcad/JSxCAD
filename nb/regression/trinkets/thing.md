```JavaScript
const core = Group(
  Arc(11).ez(15.5).z(4),
  Arc(7.85).ez(23.5),
  Arc(30).ez(7).z(4.5)
).view();
```

![Image](thing.md.0.png)

```JavaScript
const center = Arc(6.26).ez(28.5).cut(Box(10, 10).ez(31.5).x(7.3)).view();
```

![Image](thing.md.1.png)

```JavaScript
const base = core
  .cut(center)
  .ry(1 / 2)
  .color('olive')
  .z(4)
  .tag('gear')
  .view();
```

![Image](thing.md.2.png)

```JavaScript
const grabber = Arc(12).ez(10).z(-2).view();
```

![Image](thing.md.3.png)

```JavaScript
const final = base.cut(grabber).stl('test shape.stl');
```

![Image](thing.md.4.png)

[test shape.stl_0.stl](thing.test%20shape.stl_0.stl)
