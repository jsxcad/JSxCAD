import { flip } from './flip';
import { fromPolygons } from './fromPolygons';
import { test } from 'ava';
import { toPolygons } from './toPolygons';

const rectanglePolygons = [[[0, 1], [0, 0], [2, 0], [2, 1]]];
const rectangle = fromPolygons({}, rectanglePolygons);

test('flip: Unflipped surfaces are wound forward', t => {
  t.deepEqual(toPolygons({}, rectangle),
              [[[0, 1, 0], [0, 0, 0], [2, 0, 0], [2, 1, 0]]]);
});

test('flip: Flipped surfaces are wound backward', t => {
  t.deepEqual(toPolygons({}, flip(rectangle)),
              [[[2, 1, 0], [2, 0, 0], [0, 0, 0], [0, 1, 0]]]);
});
