import { makeSurfacesConvex } from './makeSurfacesConvex';
import { test } from 'ava';
import { unitCubePolygons } from '@jsxcad/data-shape';
import { toGeneric } from './toGeneric';
import { fromPolygons } from './fromPolygons';

test('Retessellate a cube to a defragmented triangulation.', t => {
  const retessellated = makeSurfacesConvex({}, fromPolygons({}, unitCubePolygons));
  t.deepEqual(toGeneric(retessellated),
              [[[[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]]], [[[0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5]]], [[[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]]], [[[-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]]], [[[0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5]]], [[[0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5]]]]);
});
