import Shape from './Shape.js';
import { as as op } from '@jsxcad/geometry';

export const as = Shape.registerMethod3('as', ['inputGeometry', 'strings'], op);

export default as;
