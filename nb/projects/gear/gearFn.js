// Probably derived from https://github.com/sadr0b0t/pd-gears/blob/master/pd-gears.scad
// Public Domain Parametric Involute Spur Gear (and involute helical gear and involute rack)
// version 1.1 by Leemon Baird, 2011, Leemon@Leemon.com

// convert polar to cartesian coordinates
export const polar = (radius, theta) => [
  radius * sin(theta),
  radius * cos(theta),
];

// point at radius d on the involute curve
export const q6 = (baseCircle, side, angle, pitchRadius) =>
  polar(pitchRadius, side * (iang(baseCircle, pitchRadius) + angle));

// radius a fraction f up the curved side of the tooth
export const q7 = (
  fraction,
  rootRadius,
  baseRadius,
  outerRadius,
  angle,
  side
) =>
  q6(
    baseRadius,
    side,
    angle,
    (1 - fraction) * max(baseRadius, rootRadius) + fraction * outerRadius
  );

// unwind a string this many degrees to go from radius r1 to radius r2
export const iang = (baseRadius, pitchRadius) =>
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
