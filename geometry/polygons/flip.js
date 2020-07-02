import { flip as flipOfPoly3 } from '@jsxcad/math-poly3';
import { map } from './map.js';

export const flip = (polygons) => map(polygons, flipOfPoly3);
