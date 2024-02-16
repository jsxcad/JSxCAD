import { Group } from './Group.js';
import { fromTranslateToTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './tagged/transform.js';

export const translate = (geometry, vector) =>
  transform(geometry, fromTranslateToTransform(...vector));

export const translateXs = (geometry, xs) =>
  Group(xs.map((x) => translate(geometry, [x, 0, 0])));

export const translateYs = (geometry, ys) =>
  Group(ys.map((y) => translate(geometry, [0, y, 0])));

export const translateZs = (geometry, zs) =>
  Group(zs.map((z) => translate(geometry, [0, 0, z])));
