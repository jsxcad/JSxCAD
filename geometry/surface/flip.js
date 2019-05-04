import { flip as flipPolygon } from '@jsxcad/math-poly3';
import { map } from './map';

export const flip = (surface) => map(surface, flipPolygon);
