import {
  BRANCH,
  dividePolygons,
  inLeaf
} from './bsp';

import {
  makeSurfacesConvex,
  toPolygons as toPolygonsFromSolid,
  fromPolygons as toSolidFromPolygons
} from '@jsxcad/geometry-solid';

import {
  makeConvex,
} from '@jsxcad/geometry-surface';

const X = 0;
const Y = 1;
const Z = 2;

const walkX = (min, max, resolution) => {
  if (min[X] + resolution > max[X]) {
    return inLeaf;
  }
  const midX = (min[X] + max[X]) / 2;
  return {
    back: walkY(min, [midX, max[Y], max[Z]], resolution),
    front: walkY([midX, min[Y], min[Z]], max, resolution),
    kind: BRANCH,
    plane: [1, 0, 0, midX],
    same: []
  };
};

const walkY = (min, max, resolution) => {
  if (min[Y] + resolution > max[Y]) {
    return inLeaf;
  }
  const midY = (min[Y] + max[Y]) / 2;
  return {
    back: walkZ(min, [max[X], midY, max[Z]], resolution),
    front: walkZ([min[X], midY, min[Z]], max, resolution),
    kind: BRANCH,
    plane: [0, 1, 0, midY],
    same: []
  };
};

const walkZ = (min, max, resolution) => {
  if (min[Z] + resolution > max[Z]) {
    return inLeaf;
  }
  const midZ = (min[Z] + max[Z]) / 2;
  return {
    back: walkX(min, [max[X], max[Y], midZ], resolution),
    front: walkX([min[X], min[Y], midZ], max, resolution),
    kind: BRANCH,
    plane: [0, 0, 1, midZ],
    same: []
  };
};

export const deform = (solid, transform, min, max, resolution) => {
  const solidPolygons = toPolygonsFromSolid({}, solid);

  const bsp = walkX(min, max, resolution);

  // Classify the solid with it.
  const dividedPolygons = [];

  for (const polygon of dividePolygons(bsp, solidPolygons)) {
    if (polygon.length > 3) {
      for (const triangle of makeConvex([polygon])) {
        dividedPolygons.push(triangle);
      }
    } else if (polygon.length === 3) {
      dividedPolygons.push(polygon);
    }
  }

  // Now the solid should have vertexes at the given heights, and we can apply the transform.
  const transformedPolygons = dividedPolygons.map(path => path.map(transform));

  return toSolidFromPolygons({}, transformedPolygons);
};
