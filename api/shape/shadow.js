import Shape from './Shape.js';
import { XY } from './refs.js';
import { cast as castGeometry } from '@jsxcad/geometry';

export const shadow = Shape.chainable(
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

Shape.registerMethod('shadow', shadow);

export default shadow;
