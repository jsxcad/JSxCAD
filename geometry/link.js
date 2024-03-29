import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { link as linkWithCgal } from '@jsxcad/algorithm-cgal';
import { taggedGroup } from './tagged/taggedGroup.js';

const filter = (geometry) =>
  ['points', 'segments'].includes(geometry.type) && isNotTypeGhost(geometry);

export const Link = (geometries, { close = false, reverse = false } = {}) => {
  const inputs = [];
  for (const geometry of geometries) {
    linearize(geometry, filter, inputs);
  }
  const outputs = linkWithCgal(inputs, close, reverse);
  return taggedGroup({}, ...outputs);
};

export const link = (geometry, geometries, mode) =>
  Link([geometry, ...geometries], mode);

export const loop = (geometry, geometries, mode = {}) =>
  Link([geometry, ...geometries], { ...mode, close: true });

export const Loop = (geometries, mode = {}) =>
  Link(geometries, { ...mode, close: true });
