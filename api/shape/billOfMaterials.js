import Shape from './Shape.js';
import note from './note.js';
import { tags } from '@jsxcad/geometry';

export const billOfMaterials = Shape.registerMethod3(
  ['billOfMaterials', 'bom'],
  ['inputGeometry', 'function'],
  (geometry) => tags(geometry, 'part:*'),
  (tags, [geometry, op = (...list) => note(`Materials: ${list.join(', ')}`)]) =>
    op(...tags)(Shape.fromGeometry(geometry))
);
