```JavaScript
await LoadSvg('https://jsxcad.js.org/svg/dinosaur.svg', { fill: false })
  .scale(10)
  .by(align('xy'))
  .and(toolpath())
  .gcode('dinosaur');
```

![Image](dinosaur.md.$1_dinosaur.png)

[dinosaur.gcode](dinosaur.dinosaur.gcode)
