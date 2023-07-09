import Shape from './Shape.js';
import { hasShowOverlay as op } from '@jsxcad/geometry';

export const overlay = Shape.registerMethod3('overlay', ['inputGeometry'], op);
