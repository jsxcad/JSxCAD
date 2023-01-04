```JavaScript
const star = await Triangle(5)
  .seq({ upto: 120 / 360, by: 30 / 360 }, rz, Join)
  .view();
```

![Image](stars.md.star.png)

```JavaScript
const r = Random();
```

```JavaScript
const stars = await star
  .seq(
    { upto: 20 },
    () => x(r.in(-100, 100)).y(r.in(-100, 100)),
    Group
  )
  .and(toolpath())
  .gcode('stars');
```

![Image](stars.md.stars_stars.png)

[stars.gcode](stars.stars.gcode)
