import { fromPolygons } from './fromPolygons';
import { measureBoundingBox } from './measureBoundingBox';
import { unitCubePolygons } from '@jsxcad/data-shape';
import { test } from 'ava';

test('Bounds of unit cube', t => {
  const boundingBox = measureBoundingBox(fromPolygons({}, unitCubePolygons));
  t.deepEqual(boundingBox, [[-0.5, -0.5, -0.5], [0.5, 0.5, 0.5]]);
});
