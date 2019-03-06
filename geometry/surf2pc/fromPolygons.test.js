import { fromPolygons } from './fromPolygons';
import { test } from 'ava';
import { toPolygons } from './toPolygons';

const polygon = [[0, 1, 0], [0, 0, 0], [2, 0, 0], [2, 1, 0]];
const polygons = [polygon];
const polygonsFlipped = polygons.slice().reverse();

test('fromPolygons: Roundtrip ', t => {
  t.deepEqual(toPolygons({}, fromPolygons({}, polygons)),
              polygons);
});

test('fromPolygons: Roundtrip when flipped', t => {
  t.deepEqual(toPolygons({}, fromPolygons({ flipped: true }, polygons)),
              polygonsFlipped);
});
