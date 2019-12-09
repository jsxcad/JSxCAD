// Probably derived from https://github.com/sadr0b0t/pd-gears/blob/master/pd-gears.scad
// Public Domain Parametric Involute Spur Gear (and involute helical gear and involute rack)
// version 1.1 by Leemon Baird, 2011, Leemon@Leemon.com

// Easing
const roundBottom = ease(0.00, 0.10, t => 0.9 + sin(t * 90) * 0.10);
const roundTop = ease(0.90, 1.0, t => 0.9 + cos(t * 90) * 0.10);
const round = roundBottom(roundTop());

const easedExtrude = (profile, easer = (t => 1), height = 1, { resolution = 10 } = {}) => 
  Prism.ofSlices(t => profile.scale(easer(t)).moveZ(t * height),
                 { slices: resolution });

// convert polar to cartesian coordinates
const polar = (r, theta) => [r * sin(theta), r * cos(theta)];

// point at radius d on the involute curve
const q6 = (b, s, t, d) => polar(d, s * (iang(b, d) + t));

// radius a fraction f up the curved side of the tooth
const q7 = (f, r, b, r2, t, s) => q6(b, s, t, (1 - f) * max(b, r) + f * r2);

// unwind a string this many degrees to go from radius r1 to radius r2
const iang = (r1, r2) => sqrt((r2 / r1) * (r2 / r1) - 1) / Math.PI * 180 - acos(r1 / r2);

const buildTooth = ({ r, b, c, k, numberOfTeeth }) =>
  Shape.fromOpenPath([polar(r, r < b ? -k : 180 / numberOfTeeth),
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
                      polar(r, -181 / numberOfTeeth)]);

export const pitchRadius = (mmPerTooth = Math.PI, numberOfTeeth = 16) =>
  mmPerTooth * numberOfTeeth / Math.PI / 2;

export const outerRadius = (mmPerTooth = Math.PI, numberOfTeeth = 16, clearance = 0) =>
  pitchRadius(mmPerTooth, numberOfTeeth) + mmPerTooth / Math.PI - clearance;

export const baseRadius = (mmPerTooth = Math.PI, numberOfTeeth = 16, pressureAngle = 20) =>
  pitchRadius(mmPerTooth, numberOfTeeth) * cos(pressureAngle);

export const rootRadius = (mmPerTooth = Math.PI, numberOfTeeth = 16, clearance = 0) => {
  const p = pitchRadius(mmPerTooth, numberOfTeeth);
  const c = outerRadius(mmPerTooth, numberOfTeeth);
  return p - (c - p) - clearance;
}

export const profile = (numberOfTeeth = 16,
                        { mmPerTooth = Math.PI, teethToHide = 0, pressureAngle = 20, clearance = 0, backlash = 0 } = {}) => {
      const pi = Math.PI;
      // const p = mmPerTooth * numberOfTeeth / pi / 2; // radius of pitch circle
      const p = pitchRadius(mmPerTooth, numberOfTeeth);
      // const c = p + mmPerTooth / pi - clearance; // radius of outer circle
      const c = outerRadius(mmPerTooth, numberOfTeeth, clearance)
      // const b = p * cos(pressureAngle); // radius of base circle
      const b = baseRadius(mmPerTooth, numberOfTeeth, pressureAngle);
      // const r = p - (c - p) - clearance; // radius of the root circle
      const r = rootRadius(mmPerTooth, numberOfTeeth, clearance);
      const t = mmPerTooth / 2 - backlash / 2; // tooth thickness at pitch circle
      const k = -iang(b, p) - t / 2 / p / pi * 180; // angle to where involute meets base circle on each side of tooth
      const tooth = buildTooth({ r, b, c, k, numberOfTeeth });
      let profile = Shape.fromOpenPath([]);
      for (let i = 0; i < numberOfTeeth - teethToHide; i++) {
        profile = profile.concat(tooth.rotateZ(i * 360 / numberOfTeeth));
      }
      return profile.close();
    };

export const Gear = (numberOfTeeth, thickness = 1, options) =>
  profile(numberOfTeeth, options)
    .interior()
    .extrude(thickness);

export const RoundedGear = (numberOfTeeth, thickness = 1, options) =>
  profile(numberOfTeeth, options)
    .interior()
    .op(profile => easedExtrude(profile, round, thickness));

export const main = () =>
  profile()
    .interior()
    .op(profile => easedExtrude(profile, round, 3))
    .with(Plan.Radius(pitchRadius()).rotateZ(45 * 0))
    .with(Plan.Radius(outerRadius()).rotateZ(45 * 1))
    .with(Plan.Radius(baseRadius()).rotateZ(45 * 2))
    .with(Plan.Radius(rootRadius()).rotateZ(45 * 3));
