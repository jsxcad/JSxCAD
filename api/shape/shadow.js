import Shape from './Shape.js';
import { XY } from './refs.js';
import { cast as castGeometry } from '@jsxcad/geometry';

export const shadow = Shape.registerMethod2(
  ['shadow', 'silhouette'],
  ['inputGeometry', 'shape', 'shape'],
  async (geometry, planeReference = XY(0), sourceReference = XY(1)) =>
    Shape.fromGeometry(
      castGeometry(
        await planeReference.toGeometry(),
        await sourceReference.toGeometry(),
        geometry
      )
    )
);

export default shadow;
