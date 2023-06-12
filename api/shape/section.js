import Point from './Point.js';
import Shape from './Shape.js';
import { section as sectionGeometry } from '@jsxcad/geometry';

const baseSection =
  ({ profile = false } = {}, orientations) =>
  async (shape) => {
    orientations = await shape.toShapesGeometries(orientations);
    if (orientations.length === 0) {
      orientations.push(await Point().toGeometry());
    }
    return Shape.fromGeometry(
      sectionGeometry(await shape.toGeometry(), orientations, { profile })
    );
  };

export const section = Shape.registerMethod2(
  'section',
  ['input', 'shapes'],
  (input, orientations) => baseSection({ profile: false }, orientations)(input)
);

export const sectionProfile = Shape.registerMethod2(
  'sectionProfile',
  ['input', 'shapes'],
  (input, orientations) => baseSection({ profile: true }, orientations)(input)
);
