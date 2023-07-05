import Shape from './Shape.js';
import { fix as op } from '@jsxcad/geometry';

export const fix = Shape.registerMethod3('fix', ['inputGeometry'], op);
