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

![Image](calibration.md.0.png)

[calibration_0.gcode](calibration.calibration_0.gcode)
