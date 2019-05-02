import { fromPolygons } from './fromPolygons';
import { makeSurfacesConvex } from './makeSurfacesConvex';
import { test } from 'ava';
import { toGeneric } from './toGeneric';
import { unitCubePolygons } from '@jsxcad/data-shape';

test('Retessellate a cube to a defragmented triangulation.', t => {
  const retessellated = makeSurfacesConvex({}, fromPolygons({}, unitCubePolygons));
  t.deepEqual(toGeneric(retessellated),
              [[[[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]]], [[[0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5]]], [[[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]]], [[[-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]]], [[[0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5]]], [[[0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5]]]]);
});
