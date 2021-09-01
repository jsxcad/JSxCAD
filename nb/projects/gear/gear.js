// Probably derived from https://github.com/sadr0b0t/pd-gears/blob/master/pd-gears.scad
// Public Domain Parametric Involute Spur Gear (and involute helical gear and involute rack)
// version 1.1 by Leemon Baird, 2011, Leemon@Leemon.com

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

// convert polar to cartesian coordinates
const polar = (radius, theta) => [radius * sin(theta), radius * cos(theta)];

// point at radius d on the involute curve
const q6 = (baseCircle, side, angle, pitchRadius) =>
  polar(pitchRadius, side * (iang(baseCircle, pitchRadius) + angle));

// radius a fraction f up the curved side of the tooth
const q7 = (fraction, rootRadius, baseRadius, outerRadius, angle, side) =>
  q6(
    baseRadius,
    side,
    angle,
    (1 - fraction) * max(baseRadius, rootRadius) + fraction * outerRadius
  );

// unwind a string this many degrees to go from radius r1 to radius r2
const iang = (baseRadius, pitchRadius) =>
  (sqrt((pitchRadius / baseRadius) * (pitchRadius / baseRadius) - 1) /
    Math.PI) *
    180 -
  acos(baseRadius / pitchRadius);

export const ToothProfile = (
  rootRadius = 7,
  baseRadius = 7.517540966287267,
  outerRadius = 9,
  angle = -6.478958291841238,
  resolution = 5
) => {
  const path = [polar(rootRadius, -angle)];
  for (let i = 0; i <= resolution; i++) {
    path.push(
      q7(i / resolution, rootRadius, baseRadius, outerRadius, angle, -1)
    );
  }
  for (let i = resolution; i >= 0; i--) {
    path.push(
      q7(i / resolution, rootRadius, baseRadius, outerRadius, angle, 1)
    );
  }
  if (rootRadius < baseRadius) {
    path.push(polar(rootRadius, angle));
  }

  return Shape.fromOpenPath(path);
};

export const pitchRadius = (mmPerTooth = Math.PI, numberOfTeeth = 16) =>
  (mmPerTooth * numberOfTeeth) / Math.PI / 2;

export const outerRadius = (
  mmPerTooth = Math.PI,
  numberOfTeeth = 16,
  clearance = 0
) => pitchRadius(mmPerTooth, numberOfTeeth) + mmPerTooth / Math.PI - clearance;

export const baseRadius = (
  mmPerTooth = Math.PI,
  numberOfTeeth = 16,
  pressureAngle = 20
) => pitchRadius(mmPerTooth, numberOfTeeth) * cos(pressureAngle);

export const rootRadius = (
  mmPerTooth = Math.PI,
  numberOfTeeth = 16,
  clearance = 0
) => {
  const p = pitchRadius(mmPerTooth, numberOfTeeth);
  const c = outerRadius(mmPerTooth, numberOfTeeth);
  return p - (c - p) - clearance;
};

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

export const Gear = () => Plan('Gear');
