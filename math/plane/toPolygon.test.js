import test from 'ava';
import { toPolygon } from './toPolygon';

test('Polygon representing z0', (t) => {
  const polygon = toPolygon([0, 0, 1, 0], 10);
  t.deepEqual(polygon, [
    [-10, 0, 0],
    [0, -10, 0],
    [10, 0, 0],
    [0, 10, 0],
  ]);
});

test('Polygon representing -z0', (t) => {
  const polygon = toPolygon([0, 0, -1, 0], 10);
  t.deepEqual(polygon, [
    [-10, 0, -0],
    [0, 10, -0],
    [10, 0, 0],
    [0, -10, 0],
  ]);
});

test('Polygon representing z1', (t) => {
  const polygon = toPolygon([0, 0, 1, 1], 10);
  t.deepEqual(polygon, [
    [-10, 0, 1],
    [0, -10, 1],
    [10, 0, 1],
    [0, 10, 1],
  ]);
});

test('Polygon representing y0', (t) => {
  const polygon = toPolygon([0, 1, 0, 0], 10);
  t.deepEqual(polygon, [
    [-10, 0, 0],
    [0, 0, 10],
    [10, 0, 0],
    [0, 0, -10],
  ]);
});
