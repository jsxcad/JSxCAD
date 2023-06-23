import { And as AndOp } from '@jsxcad/geometry';
import Shape from './Shape.js';

export const Group = Shape.registerMethod3('Group', ['geometries'], AndOp);

export default Group;
