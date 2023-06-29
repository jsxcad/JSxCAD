import { fromScaleToTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

export const scale = (geometry, vector) =>
  transform(geometry, fromScaleToTransform(...vector));
