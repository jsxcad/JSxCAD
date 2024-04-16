import Shape from './Shape.js';
import { base as op } from '@jsxcad/geometry';

export const base = Shape.registerMethod3(['base'], ['inputGeometry'], op);
