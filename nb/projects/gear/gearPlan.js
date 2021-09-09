import {
  ToothProfile,
  pitchRadius,
  outerRadius,
  baseRadius,
  rootRadius,
  iang,
} from './gearFn.js';

Shape.registerMethod(
  'hasTeeth',
  (gearTeeth) => (s) => s.updatePlan({ gearTeeth })
);

Shape.registerMethod(
  'hasMmPerTooth',
  (gearMmPerTooth) => (s) => s.updatePlan({ gearMmPerTooth })
);

Shape.registerMethod(
  'hasHiddenTeeth',
  (gearHiddenTeeth) => (s) => s.updatePlan({ gearHiddenTeeth })
);

Shape.registerMethod(
  'hasPressureAngle',
  (gearPressureAngle) => (s) => s.updatePlan({ gearPressureAngle })
);

Shape.registerMethod(
  'hasClearance',
  (gearClearance) => (s) => s.updatePlan({ gearClearance })
);

Shape.registerMethod(
  'hasBacklash',
  (gearBacklash) => (s) => s.updatePlan({ gearBacklash })
);

Shape.registerMethod(
  'hasToothResolution',
  (gearToothResolution) => (s) => s.updatePlan({ gearToothResolution })
);

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

  let profile = Shape.fromOpenPath([]);
  for (let i = 0; i < numberOfTeeth - teethToHide; i++) {
    profile = profile.concat(toothProfile.rotateZ(-i / numberOfTeeth));
  }

  return profile.close().toGeometry();
});
