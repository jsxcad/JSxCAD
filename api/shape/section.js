import Point from './Point.js';
import Shape from './Shape.js';
import { section as sectionGeometry } from '@jsxcad/geometry';

const baseSection =
  ({ profile = false } = {}, orientations) =>
  async (geometry) => {
    if (orientations.length === 0) {
      orientations.push(await Point().toGeometry());
    }
    return Shape.fromGeometry(
      sectionGeometry(geometry, orientations, { profile })
    );
  };

export const section = Shape.registerMethod2(
  'section',
  ['inputGeometry', 'geometries'],
  (input, orientations) => baseSection({ profile: false }, orientations)(input)
);

export const sectionProfile = Shape.registerMethod2(
  'sectionProfile',
  ['inputGeometry', 'geometries'],
  (input, orientations) => baseSection({ profile: true }, orientations)(input)
);
