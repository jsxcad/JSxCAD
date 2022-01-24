```JavaScript
(await readSvg('https://jsxcad.js.org/svg/dinosaur.svg', { fill: false }))
  .scale(10)
  .align('xy')
  .and(toolpath())
  .gcode('dinosaur');
```

![Image](plotter.md.0.png)

[dinosaur_0.gcode](plotter.dinosaur_0.gcode)

```JavaScript
Spiral((a) => [[1 + (a * 360) / 100]], {
  to: 10,
  by: 3 / 360,
}).and(toolpath())
  .gcode('spiral');
```

![Image](plotter.md.1.png)

[spiral_0.gcode](plotter.spiral_0.gcode)

```JavaScript
(await readSvg('https://jsxcad.js.org/svg/flowers.svg', { fill: false }))
  .scale(1 / 60)
  .align()
  .and(toolpath())
  .gcode('flowers');
```

![Image](plotter.md.2.png)

[flowers_0.gcode](plotter.flowers_0.gcode)

```JavaScript
Group(
  seq(
    (x) =>
      Box(10)
        .x(x)
        .op((s) =>
          Group(seq((y) => s.y(y), { from: -100, upto: 100, by: 60 }))
        ),
    { from: -100, upto: 100, by: 60 }
  )
)
  .align('xy')
  .toolpath()
  .gcode('calibration');
```

![Image](plotter.md.3.png)

[calibration_0.gcode](plotter.calibration_0.gcode)

```JavaScript
const star = Triangle(5)
  .seq({ upto: 120 / 360, by: 30 / 360 }, rz, Join)
  .view();
```

![Image](plotter.md.4.png)

```JavaScript
const r = Random();
```

```JavaScript
const stars = star
  .seq(
    { upto: 20 },
    () => (s) => s.x(r.in(-100, 100)).y(r.in(-100, 100)),
    Group
  )
  .and(toolpath())
  .gcode('stars');
```

![Image](plotter.md.5.png)

[stars_0.gcode](plotter.stars_0.gcode)
