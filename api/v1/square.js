import { assertEmpty, assertNumber } from './assert';
import { buildRegularPolygon, regularPolygonEdgeLengthToRadius } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { dispatch } from './dispatch';

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);
const unitSquare = () => Shape.fromPathToZ0Surface(buildRegularPolygon({ edges: 4 })).rotateZ(45).scale(edgeScale);

export const fromSize = ({ size }) => unitSquare().scale(size);
export const fromDimensions = ({ width, length }) => unitSquare().scale([width, length, 1]);

export const square = dispatch(
  'square',
  // square()
  (...args) => {
    assertEmpty(args);
    return () => fromSize({ size: 1 });
  },
  // square(4)
  (size) => {
    assertNumber(size);
    return () => fromSize({ size });
  },
  // square({ size: 4 })
  ({ size }) => {
    assertNumber(size);
    return () => fromSize({ size });
  },
  // square({ size: [4, 5] })
  ({ size }) => {
    const [width, length, ...rest] = size;
    assertNumber(width, length);
    assertEmpty(rest);
    return () => fromDimensions({ width, length });
  });

export default square;
