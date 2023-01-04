```JavaScript
await Spiral((t) => Point(1 + (t * 360) / 100), {
  to: 10,
  by: 3 / 360,
}).and(toolpath())
  .gcode('spiral');
```

![Image](spiral.md.$1_spiral.png)

[spiral.gcode](spiral.spiral.gcode)
