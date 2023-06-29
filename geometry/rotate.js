import {
  fromRotateXToTransform,
  fromRotateYToTransform,
  fromRotateZToTransform,
} from '@jsxcad/algorithm-cgal';

import { Group } from './Group.js';
import { transform } from './transform.js';

export const rotateX = (geometry, turn) =>
  transform(geometry, fromRotateXToTransform(turn));

export const rotateXs = (geometry, turns) =>
  Group(turns.map((turn) => transform(geometry, fromRotateXToTransform(turn))));

export const rotateY = (geometry, turn) =>
  transform(geometry, fromRotateYToTransform(turn));

export const rotateYs = (geometry, turns) =>
  Group(turns.map((turn) => transform(geometry, fromRotateYToTransform(turn))));

export const rotateZ = (geometry, turn) =>
  transform(geometry, fromRotateZToTransform(turn));

export const rotateZs = (geometry, turns) =>
  Group(turns.map((turn) => transform(geometry, fromRotateZToTransform(turn))));
