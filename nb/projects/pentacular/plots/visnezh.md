```JavaScript
await LoadSvg('https://jsxcad.js.org/svg/visnezh.svg', { fill: false })
  .by(align('xy'))
  .scale(1 / 100)
  .and(toolpath())
  .gcode('visnezh');
```

![Image](visnezh.md.$1_visnezh.png)

[visnezh.gcode](visnezh.visnezh.gcode)
