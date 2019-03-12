import { buildConvexHull } from './buildConvexHull';
import { buildRegularPrism } from './buildRegularPrism';
import { canonicalize, toPoints } from '@jsxcad/algorithm-polygons';
import { test } from 'ava';
import { unitRegularTriangularPrism } from '@jsxcad/data-shape';

test('A simple triangular prism', t => {
  const polygons = canonicalize(buildRegularPrism({ edges: 3 }));
  t.deepEqual(buildConvexHull({}, toPoints({}, polygons)),
              buildConvexHull({}, toPoints({}, unitRegularTriangularPrism.unitRegularTriangularPrismPolygons)));
});
