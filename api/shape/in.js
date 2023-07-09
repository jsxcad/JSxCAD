import Shape from './Shape.js';
import { inItem } from '@jsxcad/geometry';

export const inFn = Shape.registerMethod3('in', ['inputGeometry'], inItem);
