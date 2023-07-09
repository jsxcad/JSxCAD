import Shape from './Shape.js';
import { Box as op } from '@jsxcad/geometry';

export const Box = Shape.registerMethod3('Box', ['intervals', 'options'], op);

export default Box;
