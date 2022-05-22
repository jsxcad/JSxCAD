import { getLeafs, measureBoundingBox } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

const X = 0;
const Y = 1;
const Z = 2;

export const sort =
  (spec = 'z<y<x<', origin = [0, 0, 0]) =>
  (shape) => {
    let leafs = getLeafs(shape.toGeometry()).map((leaf) => {
      const [min, max] = measureBoundingBox(leaf);
      const shape = Shape.fromGeometry(leaf);
      return { min, max, shape };
    });
    const ops = [];
    while (spec) {
      const found = spec.match(/([xyz])([<>])([0-9.])?(.*)/);
      if (found === null) {
        throw Error(`Bad sort spec ${spec}`);
      }
      const [, dimension, order, limit, rest] = found;
      console.log(`dimension: ${dimension}`);
      console.log(`order: ${order}`);
      console.log(`limit: ${limit}`);
      console.log(`rest: ${rest}`);
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
      switch (order) {
        case '>':
          leafs = leafs.sort((a, b) => b.min[axis] - a.min[axis]);
          break;
        case '<':
          leafs = leafs.sort((a, b) => a.max[axis] - b.max[axis]);
          break;
      }
    }
    return Group(...leafs.map(({ shape }) => shape));
  };

Shape.registerMethod('sort', sort);

export default sort;
