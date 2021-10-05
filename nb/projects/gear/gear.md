```JavaScript
const numberOfTeeth = control('number of teeth', 16, 'input');
```

```JavaScript
import { Gear } from './gear.js';
```

```JavaScript
const mmPerTooth = control('mm per tooth', Math.PI, 'input');
```

```JavaScript
const teethToHide = control('teeth to hide', 0, 'input');
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
Gear()
  .hasTeeth(8)
  .and((s) => s.hasClearance(0.5).color('red'))
  .gridView()
  .md(`Clearance adds play to the gear tips`);
```

![Image](gear.md.0.png)

Clearance adds play to the gear tips

```JavaScript
Gear()
  .hasTeeth(numberOfTeeth)
  .hasMmPerTooth(mmPerTooth)
  .hasHiddenTeeth(teethToHide)
  .hasPressureAngle(pressureAngle)
  .hasClearance(clearance)
  .hasBacklash(backlash)
  .hasToothResolution(toothResolution)
  .ex(thickness)
  .material('wood')
  .stl(`gear_${numberOfTeeth}`);
```

![Image](gear.md.1.png)

[gear_16_0.stl](gear.gear_16_0.stl)

```JavaScript
Gear()
  .hasTeeth(8)
  .and((s) => s.hasBacklash(1).color('red'))
  .gridView()
  .md(`Backlash adds play to the gear sides`);
```

![Image](gear.md.2.png)

Backlash adds play to the gear sides

```JavaScript
Gear()
  .hasTeeth(8)
  .and(
    (s) => s.hasPressureAngle(30).color('red'),
    (s) => s.hasPressureAngle(10).color('blue')
  )
  .material('glass')
  .gridView()
  .md(`Pressure Angle makes the tip sharper or blunter`);
```

![Image](gear.md.3.png)

Pressure Angle makes the tip sharper or blunter

```JavaScript
const gear = Gear().hasClearance(0.1).hasBacklash(0.5);
```

```JavaScript
Arc(41)
  .cut(gear.hasTeeth(32).hasBacklash(-0.5).hasClearance(-0.1))
  .md(`Some care needs to be taken to invert play when cutting gears out.`)
  .color('blue')
  .as('ring')
  .and(gear.hasTeeth(8).x(12).fill().color('red').as('planet'))
  .and(
    gear
      .hasTeeth(16)
      .rz(1 / 32)
      .fill()
      .color('green')
      .as('sun')
  )
  .gridView()
  .md(`The planetary assembly can be seen as a profile.`)
  .ex(5)
  .view()
  .md(`Then extruded for printing.`)
  .stl('ring', get('ring'))
  .stl('planet', get('planet'))
  .stl('sun', get('sun'));
```

Some care needs to be taken to invert play when cutting gears out.

![Image](gear.md.4.png)

The planetary assembly can be seen as a profile.

![Image](gear.md.5.png)

Then extruded for printing.

![Image](gear.md.6.png)

[ring_0.stl](gear.ring_0.stl)

![Image](gear.md.7.png)

[planet_0.stl](gear.planet_0.stl)

![Image](gear.md.8.png)

[sun_0.stl](gear.sun_0.stl)
