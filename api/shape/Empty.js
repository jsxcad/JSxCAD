import Shape from './Shape.js';
import { Empty as op } from '@jsxcad/geometry';

export const Empty = Shape.registerMethod3('Empty', [], op);

export default Empty;
