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
      sectionGeometry(
        await shape.toGeometry(),
        orientations,
        { profile }
      )
    );
  };

export const section = Shape.registerMethod(
  'section',
  (...orientations) =>
    (shape) =>
      baseSection({ profile: false }, orientations)(shape)
);

export const sectionProfile = Shape.registerMethod(
  'sectionProfile',
  (...orientations) =>
    (shape) =>
      baseSection({ profile: true }, orientations)(shape)
);
