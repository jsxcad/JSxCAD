import { makeSurfacesSimple } from './makeSurfacesSimple';
import { test } from 'ava';
import { unitCubePolygons } from '@jsxcad/data-shape';
import { toGeneric } from './toGeneric';
import { fromPolygons } from './fromPolygons';

test('Retessellate a cube to a defragmented triangulation.', t => {
  const simplified = makeSurfacesSimple({}, fromPolygons({}, unitCubePolygons));
  t.deepEqual(toGeneric(simplified),
              [[[[0.5, -0.5, -0.5], [-0.5, -0.5, -0.5], [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5]]], [[[0.5, -0.5, -0.5], [0.5, -0.5, 0.5], [-0.5, -0.5, 0.5], [-0.5, -0.5, -0.5]]], [[[-0.5, -0.5, -0.5], [-0.5, -0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, 0.5, -0.5]]], [[[-0.5, 0.5, -0.5], [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [0.5, 0.5, -0.5]]], [[[0.5, 0.5, -0.5], [0.5, 0.5, 0.5], [0.5, -0.5, 0.5], [0.5, -0.5, -0.5]]], [[[0.5, 0.5, 0.5], [-0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5]]]]);
});
