import { assertEquals, assertNumber, assertString } from './assert';

import Cube from './Cube';
import Cylinder from './Cylinder';
import Triangle from './Triangle';
import assemble from './assemble';
import { dispatch } from './dispatch';
import intersection from './intersection';
import lathe from './lathe';
import specify from './specify';

/**
 *
 * # Fastener
 *
 **/

export const Head = dispatch('Head', ({ style, radius, thickness }) => {
  assertString(style);
  assertNumber(radius);
  assertNumber(thickness);
  assertEquals(style, 'flat');
  return () => Cylinder(radius, thickness, 8);
});

export const Shank = dispatch('Shank', ({ radius, length }) => {
  assertNumber(radius);
  assertNumber(length);
  return () => Cylinder(radius, length, 4);
});

export const Nail = dispatch('Nail', (length, diameter) => {
  assertNumber(length);
  assertNumber(diameter);
  return () =>
    specify(
      ['Nail', length, diameter],
      Head({ style: 'flat', radius: diameter, thickness: 1 }).above(),
      Shank({ radius: diameter / 2, length: length }).below()
    );
});

const Thread = (radius = 1, height = 1, pitch = 1, sides = 16) => {
  const Y = 1;
  const Z = 2;
  const thread = lathe(
    { loops: height / pitch + 2, loopOffset: pitch, sides },
    Triangle().scale(pitch).rotateZ(90).move(0, radius)
  );
  const [min, max] = thread.measureBoundingBox();
  return intersection(
    Cube.fromCorners([0, min[Y], min[Z]], [height, max[Y], max[Z]]),
    thread.move(-pitch, 0, 0)
  )
    .rotateY(-90)
    .center();
};

const ThreadedRod = (
  radius = 1,
  height = 1,
  pitch = 1,
  sides = 16,
  play = 0
) => {
  if (play !== 0) {
    return assemble(
      ThreadedRod(radius, height, pitch, sides).drop(),
      ThreadedRod(radius - play, height, pitch, sides)
    );
  } else {
    return assemble(
      Thread(radius, height, pitch, sides),
      Cylinder({ radius, height, sides })
    );
  }
};

const Nut = (radius = 1, height = 1, sides = 6) =>
  Cylinder(radius, height, sides);

export const Bolt = dispatch('Bolt', (length, diameter) => {
  assertNumber(length);
  assertNumber(diameter);
  return () =>
    specify(
      ['Bolt', length, diameter],
      Nut(diameter, 3).above(),
      ThreadedRod(diameter / 2, length).below()
    );
});

Bolt.M = (m, length) => {
  // See: http://www.atlrod.com/metric-hex-bolt-dimensions/
  const build = (dMax, dMin, hMax, hMin, fMax, fMin, cMax, cMin) =>
    specify(
      ['Bolt.M', m, length],
      Nut(cMax / 2, hMax).above(),
      ThreadedRod(dMin / 2, length).below()
    );
  switch (m) {
    case 10:
      return build(10.0, 9.78, 6.63, 6.17, 17, 15.73, 18.48, 17.77);
    case 12:
      return build(12.0, 11.73, 7.76, 4.24, 19, 17.73, 20.78, 20.03);
    case 14:
      return build(14.0, 13.73, 9.09, 8.51, 22, 20.67, 24.25, 23.35);
    case 16:
      return build(16.0, 15.73, 10.32, 9.68, 24, 23.67, 27.71, 26.75);
    case 20:
      return build(20.0, 19.67, 12.88, 12.12, 30, 29.16, 34.64, 32.95);
    case 24:
      return build(24.0, 23.67, 15.44, 14.56, 36, 35.0, 41.57, 39.55);
    case 30:
      return build(30.0, 29.67, 19.48, 17.92, 46, 45.0, 53.12, 50.85);
    case 36:
      return build(36.0, 35.61, 23.38, 21.63, 55, 53.8, 63.51, 60.79);
    case 42:
      return build(42.0, 41.38, 26.97, 25.03, 65, 62.9, 75.06, 71.71);
    case 48:
      return build(48.0, 47.38, 31.07, 28.93, 75, 72.6, 86.6, 82.76);
    case 56:
      return build(56.0, 55.26, 36.2, 33.8, 85, 82.2, 98.15, 93.71);
    case 64:
      return build(64.0, 63.26, 41.32, 38.68, 95, 91.8, 109.7, 104.65);
    case 72:
      return build(72.0, 71.26, 46.45, 43.55, 105, 101.4, 121.24, 115.6);
    case 80:
      return build(80.0, 79.26, 51.58, 48.42, 115, 111.0, 132.72, 126.54);
    case 90:
      return build(90.0, 89.13, 57.74, 54.26, 130, 125.5, 150.11, 143.07);
    default:
      throw Error('Unsupported metric bolt size');
  }
};

export const Fastener = {
  Bolt,
  Nail,
  ThreadedRod,
};
