import { fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { transform } from './transform.js';

export { butLast } from './butLast.js';
export { canonicalize } from './canonicalize.js';
export { close } from './close.js';
export { difference } from './difference.js';
export { eachPoint } from './eachPoint.js';
export { findOpenEdges } from './findOpenEdges.js';
export { flip } from './flip.js';
export { intersection } from './intersection.js';
export { last } from './last.js';
export { measureBoundingBox } from './measureBoundingBox.js';
export { segment } from './segment.js';
export { segmented } from './segmented.js';
export { toGeneric } from './toGeneric.js';
export { toPoints } from './toPoints.js';
export { toPolygons } from './toPolygons.js';
export { toZ0Polygons } from './toZ0Polygons.js';
export { transform } from './transform.js';
export { union } from './union.js';

export const scale = ([x = 1, y = 1, z = 1], paths) =>
  transform(fromScaling([x, y, z]), paths);
export const translate = ([x = 0, y = 0, z = 0], paths) =>
  transform(fromTranslation([x, y, z]), paths);
