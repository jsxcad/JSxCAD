import Shape from './Shape.js';
import { flat as op } from '@jsxcad/geometry';

export const flat = Shape.registerMethod3('flat', ['inputGeometry'], op);
