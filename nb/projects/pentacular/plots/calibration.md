```JavaScript
await Box(10)
  .seq({ from: -100, upto: 100, by: 60 }, y, Group)
  .seq({ from: -100, upto: 100, by: 60 }, x, Group)
  .by(align('xy'))
  .toolpath()
  .gcode('calibration');
```

![Image](calibration.md.$1_calibration.png)

[calibration.gcode](calibration.calibration.gcode)
