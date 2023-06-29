import Shape from './Shape.js';
import { computeNormal as op } from '@jsxcad/geometry';

export const normal = Shape.registerMethod3('normal', ['inputGeometry'], op);

export default normal;
