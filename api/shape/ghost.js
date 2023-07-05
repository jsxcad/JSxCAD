import Shape from './Shape.js';
import { ghost as op } from '@jsxcad/geometry';

export const ghost = Shape.registerMethod3('ghost', ['inputGeometry'], op);
