```JavaScript
Spiral((t) => Point(1 + (t * 360) / 100), {
  to: 10,
  by: 3 / 360,
}).and(toolpath())
  .gcode('spiral');
```

![Image](spiral.md.0.png)

[spiral_0.gcode](spiral.spiral_0.gcode)
