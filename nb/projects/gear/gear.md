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
const example = Gear()
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

![Image](gear.md.0.png)

[gear_16_0.stl](gear.gear_16_0.stl)
