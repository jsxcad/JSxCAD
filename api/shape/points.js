import Shape from './Shape.js';
import { toPoints as op } from '@jsxcad/geometry';

export const points = Shape.registerMethod3('points', ['inputGeometry'], op);
