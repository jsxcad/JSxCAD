import Shape from './Shape.js';
import { unfold as op } from '@jsxcad/geometry';

export const unfold = Shape.registerMethod3('unfold', ['inputGeometry'], op);
