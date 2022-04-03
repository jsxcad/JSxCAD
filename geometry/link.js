import { isNotTypeVoid } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { link as linkWithCgal } from '@jsxcad/algorithm-cgal';
import { taggedGroup } from './tagged/taggedGroup.js';
import { toConcreteGeometry } from './tagged/toConcreteGeometry.js';

const filter = (geometry) =>
  ['points', 'segments'].includes(geometry.type) &&
  isNotTypeVoid(geometry);

export const link = (geometries, close = false) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(toConcreteGeometry(geometry), filter, inputs);
  }
  const outputs = linkWithCgal(inputs, close);
  return taggedGroup({}, ...outputs);
};
