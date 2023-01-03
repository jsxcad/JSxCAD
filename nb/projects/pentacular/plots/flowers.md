```JavaScript
await LoadSvg('https://jsxcad.js.org/svg/flowers.svg', { fill: false })
  .scale(1 / 60)
  .by(align())
  .and(toolpath())
  .gcode('flowers');
```

![Image](flowers.md.$1_flowers.png)

[flowers.gcode](flowers.flowers.gcode)
