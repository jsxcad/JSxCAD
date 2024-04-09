import {
  fromRotateXToTransform,
  fromRotateYToTransform,
  fromRotateZToTransform,
} from '@jsxcad/algorithm-cgal';

import { Group } from './Group.js';
import { getInverseMatrices } from './tagged/getInverseMatrices.js';
import { transform } from './transform.js';

const turnTransform = (geometry, rotation) => {
  const { local, global } = getInverseMatrices(geometry);
  const localGeometry = transform(geometry, local);
  const turnedGeometry = transform(localGeometry, rotation);
  const globalGeometry = transform(turnedGeometry, global);
  return globalGeometry;
};

export const turnX = (geometry, turn) =>
  turnTransform(geometry, fromRotateXToTransform(turn));

export const turnXs = (geometry, turns) =>
  Group(
    turns.map((turn) => turnTransform(geometry, fromRotateXToTransform(turn)))
  );

export const turnY = (geometry, turn) =>
  turnTransform(geometry, fromRotateYToTransform(turn));

export const turnYs = (geometry, turns) =>
  Group(
    turns.map((turn) => turnTransform(geometry, fromRotateYToTransform(turn)))
  );

export const turnZ = (geometry, turn) =>
  turnTransform(geometry, fromRotateZToTransform(turn));

export const turnZs = (geometry, turns) =>
  Group(
    turns.map((turn) => turnTransform(geometry, fromRotateZToTransform(turn)))
  );
