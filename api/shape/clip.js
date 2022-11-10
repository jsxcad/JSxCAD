import { Shape } from './Shape.js';
import { clip as clipGeometry } from '@jsxcad/geometry';
import { destructure } from './destructure.js';

export const Clip = Shape.registerShapeMethod('Clip', (shape, ...shapes) =>
  shape.clip(...shapes)
);

export const clip = Shape.registerMethod('clip', (...args) => async (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    clipGeometry(
      shape.toGeometry(),
      await shape.toShapesGeometries(shapes),
      modes.includes('open'),
      modes.includes('exact'),
      modes.includes('noVoid')
    )
  );
});
