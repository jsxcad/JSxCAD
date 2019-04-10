import { retessellate } from './retessellate';
import { test } from 'ava';
import { unitCubePolygons } from '@jsxcad/data-shape';
import { toGeneric } from '@jsxcad/algorithm-polygons';

test('Retessellate a cube to a defragmented triangulation.', t => {
  const retessellated = retessellate({}, unitCubePolygons);
  console.log(`QQ/retessellated: ${JSON.stringify(retessellated)}`);
  t.deepEqual(toGeneric(retessellated),
              [[[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]], [[0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5]], [[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]], [[-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]], [[0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5]], [[0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5]]]);
});
