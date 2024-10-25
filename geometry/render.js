import { isNotTypeGhost, isNotTypeVoid } from './tagged/type.js';

import { linearize } from './tagged/linearize.js';
import { raycast } from '@jsxcad/algorithm-cgal';

const filter = (geometry) =>
  ['graph'].includes(geometry.type) &&
  isNotTypeGhost(geometry) &&
  isNotTypeVoid(geometry);

export const render = (
  geometry,
  { length = 10, width = length, height = 10, resolution = 1 }
) => {
  const inputs = linearize(geometry, filter);
  const points = [];
  const xStart = length / -2;
  const xStride = length * resolution;
  const xSteps = Math.ceil(length / resolution);
  const yStart = width / -2;
  const yStride = width * resolution;
  const ySteps = Math.ceil(width / resolution);
  const z = height;
  raycast(inputs, {
    xStart,
    xStride,
    xSteps,
    yStart,
    yStride,
    ySteps,
    z,
    points,
  });
  return { xSteps, ySteps, points };
};
