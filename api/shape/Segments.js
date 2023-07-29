import Shape from './Shape.js';
import { Segments as op } from '@jsxcad/geometry';

export const Segments = Shape.registerMethod3('Segments', ['segments'], op);

export default Segments;
