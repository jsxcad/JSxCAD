import { canonicalize } from './canonicalize';
import { fromPolygons } from './fromPolygons';
import { makeSurfacesConvex } from './makeSurfacesConvex';
import test from 'ava';
import { unitCubePolygons } from '@jsxcad/data-shape';

test('Retessellate a cube to a defragmented triangulation.', t => {
  const retessellated = makeSurfacesConvex(fromPolygons({}, unitCubePolygons));
  console.log(`QQ: ${JSON.stringify(canonicalize(retessellated))}`);
  t.deepEqual(canonicalize(retessellated),
              [[[[-0.5, 0.5, -0.5], [0.5, 0.5, -0.5], [0.5, -0.5, -0.5]], [[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5]]], [[[-0.5, -0.5, -0.5], [0.5, -0.5, -0.5], [0.5, -0.5, 0.5]], [[0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5]]], [[[-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]], [[-0.5, 0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5]]], [[[-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]], [[0.5, 0.5, -0.5], [-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5]]], [[[0.5, -0.5, -0.5], [0.5, 0.5, -0.5], [0.5, 0.5, 0.5]], [[0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5]]], [[[-0.5, -0.5, 0.5], [0.5, -0.5, 0.5], [0.5, 0.5, 0.5]], [[0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5]]]]);
});
