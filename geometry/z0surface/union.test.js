import { canonicalize, transform } from '@jsxcad/geometry-polygons';

import { degToRad } from '@jsxcad/math-utils';
import { fromZRotation } from '@jsxcad/math-mat4';
import test from 'ava';
import { union } from './union';

const rectangle = [[[0, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]]];

test('union: Union of no geometries produces an empty geometry', t => {
  t.deepEqual(union(), []);
});

test('union: Union of one geometry produces that geometry', t => {
  t.deepEqual(union(rectangle), rectangle);
});

test('union: Union of rectangle with itself produces itself', t => {
  const result = union(rectangle, rectangle);
  t.deepEqual(canonicalize(result), [[[0, 1, 0], [0, 0, 0], [2, 0, 0], [2, 1, 0]]]);
});

test('union: Union of rectangle with itself rotated 90 degrees produces L', t => {
  const result = union(rectangle, transform(fromZRotation(degToRad(90)), rectangle));
  t.deepEqual(canonicalize(result),
              [[[0, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]], [[0, 0, 0], [0, 2, 0], [-1, 2, 0], [-1, 0, 0]]]);
});

test('Bad case', t => {
  const a = [[[ -24.500000000000046, 10.883801392734448, -1.4210854715202004e-14 ],
              [ -22.5, 10.4917328314162, 0 ],
              [ -22.499999999999996, 10.883801392734448, -1.4210854715202004e-14 ]]];
  const b = [[[ -22.5, 10.4917328314162, 0 ],
              [ -24.500000000000046, 10.883801392734448, -1.4210854715202004e-14 ],
              [ -24.50000000000005, 10.491732831416194, 1.4210854715202004e-14 ]]];
  const result = union(a, b);
console.log(`QQ/result: ${JSON.stringify(canonicalize(result))}`);
  t.deepEqual(canonicalize(result), []);
})
