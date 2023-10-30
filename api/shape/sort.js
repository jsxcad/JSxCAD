import { Group, getLeafs, measureBoundingBox } from '@jsxcad/geometry';

import Shape from './Shape.js';

const X = 0;
const Y = 1;
const Z = 2;

export const sort = Shape.registerMethod3(
  'sort',
  ['inputGeometry', 'string'],
  (geometry, spec = 'z<y<x<') => {
    let leafs = [];
    for (const leaf of getLeafs(geometry)) {
      const [min, max] = measureBoundingBox(leaf);
      leafs.push({ min, max, leaf });
    }
    const ops = [];
    while (spec) {
      const found = spec.match(/([xyz])([<>])([0-9.])?(.*)/);
      if (found === null) {
        throw Error(`Bad sort spec ${spec}`);
      }
      const [, dimension, order, limit, rest] = found;
      // We apply the sorting ops in reverse.
      ops.unshift({ dimension, order, limit });
      spec = rest;
    }
    for (const { dimension, order, limit } of ops) {
      let axis;
      switch (dimension) {
        case 'x':
          axis = X;
          break;
        case 'y':
          axis = Y;
          break;
        case 'z':
          axis = Z;
          break;
      }
      if (limit !== undefined) {
        switch (order) {
          case '>':
            leafs = leafs.filter(({ min }) => min[axis] > limit);
            break;
          case '<':
            leafs = leafs.filter(({ max }) => max[axis] < limit);
            break;
        }
      }
      let compare;
      switch (order) {
        case '>':
          compare = (a, b) => b.min[axis] - a.min[axis];
          break;
        case '<':
          compare = (a, b) => a.max[axis] - b.max[axis];
          break;
      }
      leafs.sort(compare);
    }
    return Group(leafs.map(({ leaf }) => leaf));
  }
);

export default sort;
