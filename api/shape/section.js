import Point from './Point.js';
import Shape from './Shape.js';
import { section as sectionGeometry } from '@jsxcad/geometry';

const baseSection =
  ({ profile = false } = {}, orientations) =>
  (shape) => {
    orientations = orientations
      .flatMap((orientation) => Shape.toShapes(orientation, shape))
      .flatMap((orientation) => Shape.toShapes(orientation, shape));
    if (orientations.length === 0) {
      orientations.push(Point());
    }
    return Shape.fromGeometry(
      sectionGeometry(
        shape.toGeometry(),
        orientations.map((orientation) => orientation.toGeometry()),
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
