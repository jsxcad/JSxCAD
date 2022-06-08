```JavaScript
const star = Triangle(5)
  .seq({ upto: 120 / 360, by: 30 / 360 }, rz, Join)
  .view();
```

![Image](stars.md.0.png)

```JavaScript
const r = Random();
```

```JavaScript
const stars = star
  .seq(
    { upto: 20 },
    () => x(r.in(-100, 100)).y(r.in(-100, 100)),
    Group
  )
  .and(toolpath())
  .gcode('stars');
```

![Image](stars.md.1.png)

[stars_0.gcode](stars.stars_0.gcode)
