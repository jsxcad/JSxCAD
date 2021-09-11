const dinosaur = await readSvg(
  'https://gitcdn.link/cdn/jsxcad/JSxCAD/master/nb/projects/plotter/dinosaur.svg',
  { fill: false }
);
const plotter = defGrblPlotter('plotter');
const aligned = dinosaur.scale(10).align('xy').gcode('dinosaur', plotter);
![Image](plotter.md.0.png)

const spiral = Spiral((a) => [[1 + (a * 360) / 100]], {
  to: 10,
  by: 3 / 360,
}).gcode('spiral', plotter);
![Image](plotter.md.1.png)

const flowers = await readSvg(
  'https://gitcdn.link/cdn/jsxcad/JSxCAD/master/nb/projects/plotter/flowers.svg',
  { fill: false }
);
const mandala = await readSvg(
  'https://gitcdn.link/cdn/jsxcad/JSxCAD/master/nb/projects/plotter/mandala.svg',
  { fill: false }
);
flowers
  .scale(1 / 60)
  .align()
  .gcode('flowers', plotter);
![Image](plotter.md.2.png)

const scaledMandala = mandala
  .align('xy')
  .scale(20)
  .gcode('mandala', plotter, { doPlan: false });
![Image](plotter.md.3.png)

const visnezh = await readSvg(
  'https://gitcdn.link/cdn/jsxcad/JSxCAD/master/nb/projects/plotter/visnezh.svg',
  { fill: false }
);
const calibration = Group(
  ...seq(
    (x) =>
      Box(10)
        .x(x)
        .op((s) =>
          Group(...seq((y) => s.y(y), { from: -100, upto: 100, by: 60 }))
        ),
    { from: -100, upto: 100, by: 60 }
  )
)
  .align('xy')
  .gcode('calibration', plotter);
![Image](plotter.md.4.png)

const scaledVisnezh = visnezh
  .align('xy')
  .scale(1 / 100)
  .gcode('visnezh', plotter, { doPlan: false });
![Image](plotter.md.5.png)

const star = Group(
  ...seq((a) => Triangle(5).rz(a), { upto: 120 / 360, by: 30 / 360 })
).view({ outline: false });
![Image](plotter.md.6.png)

const r = Random();
const stars = Group(
  ...seq((i) => star.x(r.in(-100, 100)).y(r.in(-100, 100)), { upto: 20 })
).gcode('stars', plotter);
![Image](plotter.md.7.png)
