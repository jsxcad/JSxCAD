import { fromPolygons } from './fromPolygons.js';
import { measureBoundingBox } from './measureBoundingBox.js';
import test from 'ava';
import { unitCubePolygons } from '@jsxcad/data-shape';

test('Bounds of unit cube', (t) => {
  const boundingBox = measureBoundingBox(fromPolygons(unitCubePolygons));
  t.deepEqual(boundingBox, [
    [-0.5, -0.5, -0.5],
    [0.5, 0.5, 0.5],
  ]);
});
