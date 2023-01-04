```JavaScript
await LoadSvg('https://jsxcad.js.org/svg/mandala.svg', { fill: false })
  .by(align('xy'))
  .scale(20)
  .and(toolpath())
  .gcode('mandala');
```

![Image](mandala.md.$1_mandala.png)

[mandala.gcode](mandala.mandala.gcode)
