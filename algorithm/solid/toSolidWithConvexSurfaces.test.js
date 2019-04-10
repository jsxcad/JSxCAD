import { toSolidWithConvexSurfaces } from './toSolidWithConvexSurfaces';
import { test } from 'ava';
import { unitCubePolygons } from '@jsxcad/data-shape';
import { toGeneric } from '@jsxcad/algorithm-polygons';

test('Retessellate a cube to a defragmented triangulation.', t => {
  const retessellated = toSolidWithConvexSurfaces({}, unitCubePolygons);
  t.deepEqual(toGeneric(retessellated),
              [[[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]], [[0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5]], [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]], [[-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]], [[0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5]], [[0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5]]]);
});
