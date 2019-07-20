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
              [[[0, 1, 0], [0, 2, 0], [-1, 2, 0], [-1, 0, 0], [2, 0, 0], [2, 1, 0]]]);
});

test("polybooljs breakage." => {
  const result = polybooljs.union({"regions":[[[-5,-5,0],[-4,-5,0],[-4,5,0],[-5,5,0]]]},
                                  {"regions":[[[-4,-5,0],[5,-5,0],[5,5,0],[-4,5,0]],
                                              [[5,-5,0],[6,-5,0],[6,5,0],[5,5,0]],
                                              [[-4,-5,0],[5,-5,0],[5,5,0],[-4,5,0]]]});
  t.deepEqual(result, {"regions":[[[-4,5,0],[-4,-5,0],[-5,-5,0],[-5,5,0]],[[6,5,0],[6,-5,0],[5,-5,0],[5,5,0]]]});
});
