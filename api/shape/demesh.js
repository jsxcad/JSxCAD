import Shape from './Shape.js';
import { demesh as op } from '@jsxcad/geometry';

export const demesh = Shape.registerMethod3('demesh', ['inputGeometry'], op);
