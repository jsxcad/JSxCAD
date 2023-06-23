import Shape from './Shape.js';
import { makeAbsolute } from '@jsxcad/geometry';

export const absolute = Shape.registerMethod3('absolute', ['inputGeometry'], makeAbsolute);

export default absolute;
