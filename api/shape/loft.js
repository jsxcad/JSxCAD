import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const Loft = Shape.registerMethod2(
  'Loft',
  ['geometries', 'modes'],
  (geometries, modes) =>
    Shape.fromGeometry(loftGeometry(geometries, !modes.includes('open')))
);

export const loft = Shape.registerMethod2(
  'loft',
  ['inputGeometry', 'geometries', 'modes'],
  (geometry, geometries, modes) =>
    Shape.fromGeometry(
      loftGeometry([geometry, ...geometries], !modes.includes('open'))
    )
);

export default Loft;
