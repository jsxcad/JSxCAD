```JavaScript
(await readSvg('https://jsxcad.js.org/svg/mandala.svg', { fill: false }))
  .by(align('xy'))
  .scale(20)
  .and(toolpath())
  .gcode('mandala');
```

![Image](mandala.md.0.png)

[mandala_0.gcode](mandala.mandala_0.gcode)
