import {
  ToothProfile,
  pitchRadius,
  outerRadius,
  baseRadius,
  rootRadius,
  iang,
} from './gearFn.js';

export const hasTeeth = Shape.chainable(
  (gearTeeth) => (s) => s.updatePlan({ gearTeeth })
);
export const hasMmPerTooth = Shape.chainable(
  (gearMmPerTooth) => (s) => s.updatePlan({ gearMmPerTooth })
);
export const hasHiddenTeeth = Shape.chainable(
  (gearHiddenTeeth) => (s) => s.updatePlan({ gearHiddenTeeth })
);
export const hasPressureAngle = Shape.chainable(
  (gearPressureAngle) => (s) => s.updatePlan({ gearPressureAngle })
);
export const hasClearance = Shape.chainable(
  (gearClearance) => (s) => s.updatePlan({ gearClearance })
);
export const hasBacklash = Shape.chainable(
  (gearBacklash) => (s) => s.updatePlan({ gearBacklash })
);
export const hasToothResolution = Shape.chainable(
  (gearToothResolution) => (s) => s.updatePlan({ gearToothResolution })
);

Shape.registerMethod('hasTeeth', hasTeeth);
Shape.registerMethod('hasMmPerTooth', hasMmPerTooth);
Shape.registerMethod('hasHiddenTeeth', hasHiddenTeeth);
Shape.registerMethod('hasPressureAngle', hasPressureAngle);
Shape.registerMethod('hasClearance', hasClearance);
Shape.registerMethod('hasBacklash', hasBacklash);
Shape.registerMethod('hasToothResolution', hasToothResolution);

Shape.registerReifier('Gear', (plan) => {
  const pi = Math.PI;

  const numberOfTeeth = ofPlan(plan, 'gearTeeth', 16);
  const mmPerTooth = ofPlan(plan, 'gearMmPerTooth', pi);
  const teethToHide = ofPlan(plan, 'gearTeethToHide', 0);
  const pressureAngle = ofPlan(plan, 'gearPressureAngle', 20);
  const clearance = ofPlan(plan, 'gearClearance', 0);
  const backlash = ofPlan(plan, 'gearBacklash', 0);
  const toothResolution = ofPlan(plan, 'gearToothResolution', 5);
  // const p = mmPerTooth * numberOfTeeth / pi / 2; // radius of pitch circle
  const p = pitchRadius(mmPerTooth, numberOfTeeth);
  const c = outerRadius(mmPerTooth, numberOfTeeth, clearance);
  const b = baseRadius(mmPerTooth, numberOfTeeth, pressureAngle);
  const r = rootRadius(mmPerTooth, numberOfTeeth, clearance);
  const t = mmPerTooth / 2 - backlash / 2;

  // angle to where involute meets base circle on each side of tooth
  const k = -iang(b, p) - (t / 2 / p / pi) * 180;

  const toothProfile = ToothProfile(r, b, c, k, toothResolution);

  return toothProfile
    .seq(
      { upto: numberOfTeeth - teethToHide },
      (i) => rz(-i / numberOfTeeth),
      Group
    )
    .loop();
});
