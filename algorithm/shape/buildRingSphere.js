import { scale, translate } from '@jsxcad/geometry-path';

import { buildConvexHull } from '@jsxcad/geometry-points';
import { buildRegularPolygon } from './buildRegularPolygon';
import { toPoints } from '@jsxcad/geometry-paths';

export const buildRingSphere = ({ resolution = 20 }) => {
  const paths = [];
  // Trace out latitudinal rings.
  for (let slice = 0; slice <= resolution; slice++) {
    let angle = Math.PI * 2.0 * slice / resolution;
    let height = Math.sin(angle);
    let radius = Math.cos(angle);
    paths.push(translate([0, 0, height], scale([radius, radius, radius], buildRegularPolygon({ edges: resolution }))));
  }
  // Hull the rings to form a sphere.
  return buildConvexHull({}, toPoints({}, paths));
};
