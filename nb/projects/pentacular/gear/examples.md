```JavaScript
import { Gear } from './gear.nb';
```

```JavaScript
const teeth = control('teeth', 16, 'input');
```

```JavaScript
const mmPerTooth = control('mm per tooth', Math.PI, 'input');
```

```JavaScript
const hiddenTeeth = control('hidden teeth', 0, 'input');
```

```JavaScript
const pressureAngle = control('pressure angle', 20, 'input');
```

```JavaScript
const clearance = control('clearance', 0, 'input');
```

```JavaScript
const backlash = control('backlash', 0, 'input');
```

```JavaScript
const thickness = control('thickness', 2, 'input');
```

```JavaScript
const toothResolution = control('toothResolution', 5, 'input');
```

```JavaScript
await Gear({ teeth, mmPerTooth, hiddenTeeth, pressureAngle, clearance, backlash, toothResolution })
  .fill()
  .ez(thickness)
  .material('wood')
  .stl(`gear_${teeth}`);
```

[gear_16_1.stl](examples.gear_16_1.stl)

```JavaScript
await Gear({ teeth: 8 })
  .and(Gear({ teeth, clearance: 0.5 }).color('red'))
  .gridView()
  .md(`Clearance adds play to the gear tips`);
```

![Image](examples.md.$2.png)

Clearance adds play to the gear tips

```JavaScript
await Gear({ teeth: 8 })
  .and(Gear({ teeth, backlash: 1 }).color('red'))
  .gridView()
  .md(`Backlash adds play to the gear sides`);
```

![Image](examples.md.$3.png)

Backlash adds play to the gear sides

```JavaScript
await Gear({ teeth: 8 })
  .and(
    Gear({ teeth: 8, pressureAngle: 30 }).color('red'),
    Gear({ teeth: 8, pressureAngle: 10 }).color('blue')
  )
  .material('glass')
  .gridView()
  .md(`Pressure Angle makes the tip sharper or blunter`);
```

![Image](examples.md.$4.png)

Pressure Angle makes the tip sharper or blunter

### Planetary Gears

```JavaScript
const planetary = await Gear({teeth: 8 }).fill().md(`Our base involute gear.`);
```

Our base involute gear.

```JavaScript
const planetaryFootprint = await planetary
  .offset(0.2)
  .view()
  .md(`We'll use an offset template to cut the other gears`);
```

![Image](examples.md.planetaryFootprint.png)

We'll use an offset template to cut the other gears

```JavaScript
const ring = await Arc(50, { start: -1 / 64, end: 1 / 64 })
  .hull(noOp(), Point())
  .cut(Arc(30))
  .cut(
    seq(
      { from: -1, by: 1 / 16, to: 1 },
      (a) =>
        planetaryFootprint
          .rz(a / -8)
          .y(12)
          .rz(a / 32)
    )
  )
  .clean()
  .seq({ by: 1 / 32 }, rz)
  .gridView()
  .md(
    `We simulate the gear motion to cut a single tooth, then rotate it around.`
  );
```

![Image](examples.md.ring.png)

We simulate the gear motion to cut a single tooth, then rotate it around.

```JavaScript
const solar = await Arc(20, { start: -1 / 30, end: 1 / 30 })
  .hull(noOp(), Point())
  .cut(
    seq(
      { from: -1, by: 1 / 16, to: 1 },
      (a) =>
        planetaryFootprint
          .rz(a / 8)
          .y(12)
          .rz(a / 16)
    )
  )
  .clean()
  .seq({ by: 1 / 16 }, rz)
  .fuse()
  .gridView()
  .md(
    `We simulate the gear motion to cut a single tooth, then rotate it around.`
  )
  .clean();
```

![Image](examples.md.solar.png)

```JavaScript
const rack = await Box(20, Math.PI)
  .by(align('x<'))
  .cut(
    seq(
{
      from: -1,
      by: 1 / 8,
      to: 1,
    },
(a) => planetaryFootprint.rz(-a / 8).y(Math.PI * a))
  )
  .seq({ to: 10 }, (a) => y(a * Math.PI))
  .gridView()
  .md(`We can do the same thing to cut a rack.`)
  .clean();
```

![Image](examples.md.rack.png)

We can do the same thing to cut a rack.

```JavaScript
const planetaryDesign1 = await Arc(44)
  .ez(-4)
  .as('hoop')
  .fitTo(Octagon(42).ez(-2, -4))
  .clean();
```

```JavaScript
const planetaryDesign2 = await planetaryDesign1
  .cut(Octagon(42).ez(-2))
  .and(ring.clip(Octagon(42)).ez(-2))
  .cut(Arc(24).ez(-2, -4))
  .color('blue')
  .as('ring')
  .clean();
```

```JavaScript
const planetaryDesign3 = await planetaryDesign2
  .and(
    planetary
      .ez(-2)
      .cut(Arc(2).ez(-2))
      .color('red')
      .as('planetary')
      .x(12)
      .rz(1 / 4, 2 / 4, 3 / 4, 4 / 4)
  )
  .clean();
```

```JavaScript
const planetaryDesign4a = await solar.ez(-2);
```

```JavaScript
const planetaryDesign4b = await planetaryDesign4a.and(Arc(23.5).ez(-2, -4));
```

```JavaScript
const planetaryDesignAxle = await Octagon(12)
  .fitTo(Arc(8).void())
  .ez(-4)
  .color('orange')
  .as('axle');
```

```JavaScript
const planetaryDesign4c = await planetaryDesign4b.fitTo(planetaryDesignAxle);
```

```JavaScript
const planetaryDesign4 = await planetaryDesign4c.color('green').as('solar');
```

```JavaScript
const planetaryDesign = await planetaryDesign3
  .and(planetaryDesign4)
  .gridView()
  .stl(
    'hoop',
    get('ring')
      .get('hoop')
      .rx(0 / 2, 1 / 2)
  )
  .stl('ring', get('ring').getNot('hoop'))
  .stl(
    'planetary',
    get('planetary')
      .n(0)
      .y(12)
      .rx(0 / 2, 1 / 2)
  )
  .stl('solar', get('solar').getNot('axle'))
  .stl(
    'axle',
    get('solar')
      .get('axle')
      .rx(0 / 2, 1 / 2)
  );
```

![Image](examples.md.planetaryDesign.png)

[ring_1.stl](examples.ring_1.stl)

![Image](examples.md.planetaryDesign_ring.png)

[planetary_1.stl](examples.planetary_1.stl)

![Image](examples.md.planetaryDesign_planetary.png)

[solar_1.stl](examples.solar_1.stl)

![Image](examples.md.planetaryDesign_solar.png)