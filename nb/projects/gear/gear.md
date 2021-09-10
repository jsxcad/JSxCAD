import './gearPlan.js';
import {
  ToothProfile,
  pitchRadius,
  outerRadius,
  baseRadius,
  rootRadius,
  iang,
} from './gearFn.js';
import { Gear } from './gear.js';
const numberOfTeeth = control('number of teeth', 16, 'input');
const mmPerTooth = control('mm per tooth', Math.PI, 'input');
const teethToHide = control('teeth to hide', 0, 'input');
const pressureAngle = control('pressure angle', 20, 'input');
const clearance = control('clearance', 0, 'input');
const backlash = control('backlash', 0, 'input');
const thickness = control('thickness', 2, 'input');
const toothResolution = control('toothResolution', 5, 'input');
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
![Image](gear.md.0.png)
