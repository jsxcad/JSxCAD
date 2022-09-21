```JavaScript
(await readSvg('https://jsxcad.js.org/svg/flowers.svg', { fill: false }))
  .scale(1 / 60)
  .by(align())
  .and(toolpath())
  .gcode('flowers');
```

![Image](flowers.md.0.png)

[flowers_0.gcode](flowers.flowers_0.gcode)
