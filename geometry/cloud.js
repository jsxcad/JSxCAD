import { ceilPoint, floorPoint } from './voxels.js';

import { Group } from './Group.js';
import { Points } from './Point.js';
import { isNotTypeGhost } from './tagged/type.js';
import { linearize } from './tagged/linearize.js';
import { measureBoundingBox } from './measureBoundingBox.js';
import { withAabbTreeQuery } from '@jsxcad/algorithm-cgal';

const X = 0;
const Y = 1;
const Z = 2;

export const samplePointCloud = (geometries, resolution = 1) => {
  const offset = resolution / 2;
  const inputs = [];
  for (const geometry of geometries) {
    linearize(
      geometry,
      (geometry) =>
        ['graph', 'polygonsWithHoles'].includes(geometry.type) &&
        isNotTypeGhost(geometry),
      inputs
    );
  }
  const [boxMin, boxMax] = measureBoundingBox(Group(inputs));
  const min = floorPoint(boxMin, resolution);
  const max = ceilPoint(boxMax, resolution);
  const points = [];
  withAabbTreeQuery(inputs, (query) => {
    const isInteriorPoint = (x, y, z) =>
      query.isIntersectingPointApproximate(x, y, z);
    for (let x = min[X] - offset; x <= max[X] + offset; x += resolution) {
      for (let y = min[Y] - offset; y <= max[Y] + offset; y += resolution) {
        for (let z = min[Z] - offset; z <= max[Z] + offset; z += resolution) {
          if (isInteriorPoint(x, y, z)) {
            points.push([x, y, z]);
          }
        }
      }
    }
  });
  return Points(points);
};
