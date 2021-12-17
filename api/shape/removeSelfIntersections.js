import Shape from './Shape.js';
import { removeSelfIntersections as removeSelfIntersectionsOfGeometry } from '@jsxcad/geometry';

export const removeSelfIntersections = () => (shape) =>
  Shape.fromGeometry(removeSelfIntersectionsOfGeometry(shape.toGeometry()));

Shape.registerMethod('removeSelfIntersections', removeSelfIntersections);
