import { eachPoint } from './eachPoint';
import { fromPolygons } from './fromPolygons';
import { test } from 'ava';

const polygon = [[0, 1, 0], [0, 0, 0], [2, 0, 0], [2, 1, 0]];

test('eachPoint: Emits the contained points', t => {
  const collected = [];
  eachPoint({},
            point => collected.push(point),
            fromPolygons({}, [polygon]));
  t.deepEqual(collected, polygon);
});
