// Probably derived from https://github.com/sadr0b0t/pd-gears/blob/master/pd-gears.scad
// Public Domain Parametric Involute Spur Gear (and involute helical gear and involute rack)
// version 1.1 by Leemon Baird, 2011, Leemon@Leemon.com

// convert polar to cartesian coordinates
const polar = (r, theta) => [r * sin(theta), r * cos(theta)];

// point at radius d on the involute curve
const q6 = (b, s, t, d) => polar(d, s * (iang(b, d) + t));

// radius a fraction f up the curved side of the tooth
const q7 = (f, r, b, r2, t, s) => q6(b, s, t, (1 - f) * max(b, r) + f * r2);

// unwind a string this many degrees to go from radius r1 to radius r2
const iang = (r1, r2) =>
  (sqrt((r2 / r1) * (r2 / r1) - 1) / Math.PI) * 180 - acos(r1 / r2);

export const ToothProfile = ({ r, b, c, k, numberOfTeeth }) =>
  Shape.fromOpenPath([
    polar(r, r < b ? -k : 180 / numberOfTeeth),
    q7(0 / 5, r, b, c, k, -1),
    q7(1 / 5, r, b, c, k, -1),
    q7(2 / 5, r, b, c, k, -1),
    q7(3 / 5, r, b, c, k, -1),
    q7(4 / 5, r, b, c, k, -1),
    q7(5 / 5, r, b, c, k, -1),
    q7(5 / 5, r, b, c, k, 1),
    q7(4 / 5, r, b, c, k, 1),
    q7(3 / 5, r, b, c, k, 1),
    q7(2 / 5, r, b, c, k, 1),
    q7(1 / 5, r, b, c, k, 1),
    q7(0 / 5, r, b, c, k, 1),
    polar(r, r < b ? k : -180 / numberOfTeeth),
    polar(r, -181 / numberOfTeeth),
  ]);

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

export const GearProfile = (
  numberOfTeeth = 16,
  {
    mmPerTooth = Math.PI,
    teethToHide = 0,
    pressureAngle = 20,
    clearance = 0,
    backlash = 0,
  } = {}
) => {
  const pi = Math.PI;
  // const p = mmPerTooth * numberOfTeeth / pi / 2; // radius of pitch circle
  const p = pitchRadius(mmPerTooth, numberOfTeeth);
  const c = outerRadius(mmPerTooth, numberOfTeeth, clearance);
  const b = baseRadius(mmPerTooth, numberOfTeeth, pressureAngle);
  const r = rootRadius(mmPerTooth, numberOfTeeth, clearance);
  const t = mmPerTooth / 2 - backlash / 2;

  // angle to where involute meets base circle on each side of tooth
  const k = -iang(b, p) - (t / 2 / p / pi) * 180;

  const toothProfile = ToothProfile({ r, b, c, k, numberOfTeeth });

  let profile = Shape.fromOpenPath([]);
  for (let i = 0; i < numberOfTeeth - teethToHide; i++) {
    profile = profile.concat(toothProfile.rotateZ((i * 360) / numberOfTeeth));
  }

  return profile.close();
};
