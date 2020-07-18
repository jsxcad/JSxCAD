import { BRANCH, dividePolygons, inLeaf } from './bsp.js';

import {
  alignVertices,
  fromPolygons as fromPolygonsToSolid,
  toPolygons as toPolygonsFromSolid,
} from '@jsxcad/geometry-solid';

import { createNormalize3 } from '@jsxcad/algorithm-quantize';

const X = 0;
const Y = 1;
const Z = 2;

const walkX = (min, max, resolution) => {
  const midX = Math.floor((min[X] + max[X]) / 2);
  if (midX === min[X]) {
    return walkY(min, max, resolution);
  }
  return {
    back: walkX(min, [midX, max[Y], max[Z]], resolution),
    front: walkX([midX, min[Y], min[Z]], max, resolution),
    kind: BRANCH,
    plane: [1, 0, 0, midX * resolution],
    same: [],
  };
};

const walkY = (min, max, resolution) => {
  const midY = Math.floor((min[Y] + max[Y]) / 2);
  if (midY === min[Y]) {
    return walkZ(min, max, resolution);
  }
  return {
    back: walkY(min, [max[X], midY, max[Z]], resolution),
    front: walkY([min[X], midY, min[Z]], max, resolution),
    kind: BRANCH,
    plane: [0, 1, 0, midY * resolution],
    same: [],
  };
};

const walkZ = (min, max, resolution) => {
  const midZ = Math.floor((min[Z] + max[Z]) / 2);
  if (midZ === min[Z]) {
    return inLeaf;
  }
  return {
    back: walkZ(min, [max[X], max[Y], midZ], resolution),
    front: walkZ([min[X], min[Y], midZ], max, resolution),
    kind: BRANCH,
    plane: [0, 0, 1, midZ * resolution],
    same: [],
  };
};

export const deform = (solid, transform, min, max, resolution) => {
  const normalize = createNormalize3();

  const solidPolygons = toPolygonsFromSolid(alignVertices(solid));

  const floor = ([x, y, z]) => [
    Math.floor(x / resolution),
    Math.floor(y / resolution),
    Math.floor(z / resolution),
  ];
  const ceil = ([x, y, z]) => [
    Math.ceil(x / resolution),
    Math.ceil(y / resolution),
    Math.ceil(z / resolution),
  ];

  const bsp = walkX(floor(min), ceil(max), resolution);

  // Classify the solid with it.
  const dividedPolygons = [];

  for (const polygon of dividePolygons(bsp, solidPolygons, normalize)) {
    if (polygon.length > 3) {
      for (let nth = 2; nth < polygon.length; nth++) {
        dividedPolygons.push([polygon[0], polygon[nth - 1], polygon[nth]]);
      }
    } else if (polygon.length === 3) {
      dividedPolygons.push(polygon);
    }
  }

  const realignedPolygons = alignVertices([dividedPolygons])[0];

  const vertices = new Map();

  // We only need this for non-deterministic transforms.
  // Let's require transforms be deterministic functions.
  for (const path of realignedPolygons) {
    for (const point of path) {
      const tag = JSON.stringify(point);
      if (!vertices.has(tag)) {
        vertices.set(tag, transform(point));
      }
    }
  }

  // Now the solid should have vertexes at the given heights, and we can apply the transform.
  const transformedPolygons = realignedPolygons.map((path) =>
    path.map((point) => vertices.get(JSON.stringify(point)))
  );

  return fromPolygonsToSolid(transformedPolygons);
};
