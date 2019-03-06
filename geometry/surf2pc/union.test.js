import { degToRad } from '@jsxcad/math-utils';
import { equals } from './equals';
import { fromPolygons } from './fromPolygons';
import { fromZRotation } from '@jsxcad/math-mat4';
import { test } from 'ava';
import { transform } from './transform';
import { union } from './union';

const rectangle = fromPolygons({}, [[[0, 1], [0, 0], [2, 0], [2, 1]]]);

test('union: Union of no geometries produces an empty geometry', t => {
  t.true(equals(union(), fromPolygons({}, [])));
});

test('union: Union of one geometry produces that geometry', t => {
  t.true(equals(union(rectangle), rectangle));
});

test('union: Union of rectangle with itself produces itself', t => {
  t.true(equals(union(rectangle, rectangle), rectangle));
});

test('union: Union of rectangle with itself rotated 90 degrees produces L', t => {
  t.true(equals(union(rectangle,
                      transform(fromZRotation(degToRad(90)), rectangle)),
                fromPolygons({}, [[[-1, 0], [2, 0], [2, 1], [0, 1], [0, 2],
                                   [-1, 2]]])));
});
