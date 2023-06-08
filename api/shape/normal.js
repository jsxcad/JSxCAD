import Shape from './Shape.js';
import { computeNormal } from '@jsxcad/geometry';

export const normal = Shape.registerMethod2(
  'normal',
  ['inputGeometry'],
  (geometry) => {
    const result = Shape.fromGeometry(computeNormal(geometry));
    console.log(`QQ/normal/geometry: ${JSON.stringify(geometry)}`);
    console.log(`QQ/normal/result: ${JSON.stringify(result)}`);
    return result;
  }
);

export default normal;
