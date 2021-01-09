import { Hull, Orb } from '@jsxcad/api-v1-shapes';

import {
  fromSolid as fromSolidToBspTree,
  toConvexClouds as toConvexCloudsFromBspTree,
} from '@jsxcad/geometry-bsp';

import { getSolids, taggedLayers } from '@jsxcad/geometry-tagged';

import { Shape } from '@jsxcad/api-v1-shape';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';

export const grow = (shape, amount = 1, { resolution = 3 } = {}) => {
  const normalize = createNormalize3();
  resolution = Math.max(resolution, 3);
  const pieces = [];
  for (const { solid, tags = [] } of getSolids(shape.toDisjointGeometry())) {
    for (const cloud of toConvexCloudsFromBspTree(
      fromSolidToBspTree(solid, normalize),
      normalize
    )) {
      pieces.push(
        Hull(...cloud.map((point) => Orb(amount, resolution).move(...point)))
          .setTags(tags)
          .toGeometry()
      );
    }
  }
  return Shape.fromGeometry(taggedLayers({}, ...pieces));
};

const growMethod = function (...args) {
  return grow(this, ...args);
};
Shape.prototype.grow = growMethod;

export default grow;
