import { fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { transform } from './transform';

export { butLast } from './butLast';
export { canonicalize } from './canonicalize';
export { difference } from './difference';
export { eachPoint } from './eachPoint';
export { findOpenEdges } from './findOpenEdges';
export { flip } from './flip';
export { intersection } from './intersection';
export { last } from './last';
export { measureBoundingBox } from './measureBoundingBox';
export { segment } from './segment';
export { toGeneric } from './toGeneric';
export { toPoints } from './toPoints';
export { toPolygons } from './toPolygons';
export { toZ0Polygons } from './toZ0Polygons';
export { transform } from './transform';
export { union } from './union';

export const scale = ([x = 1, y = 1, z = 1], paths) =>
  transform(fromScaling([x, y, z]), paths);
export const translate = ([x = 0, y = 0, z = 0], paths) =>
  transform(fromTranslation([x, y, z]), paths);
