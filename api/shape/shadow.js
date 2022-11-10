import Shape from './Shape.js';
import { XY } from './refs.js';
import { cast as castGeometry } from '@jsxcad/geometry';

export const shadow = Shape.registerMethod(
  'shadow',
  (planeReference = XY(0), sourceReference = XY(1)) =>
    (shape) =>
      Shape.fromGeometry(
        castGeometry(
          Shape.toShape(planeReference, shape).toGeometry(),
          Shape.toShape(sourceReference, shape).toGeometry(),
          shape.toGeometry()
        )
      )
);

export default shadow;
