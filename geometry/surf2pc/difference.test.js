import { degToRad } from '@jsxcad/math-utils';
import { difference } from './difference';
import { equals } from './equals';
import { fromPolygons } from './fromPolygons';
import { fromZRotation } from '@jsxcad/math-mat4';
import { test } from 'ava';
import { transform } from './transform';

const rectangle = fromPolygons({}, [[[0, 1], [0, 0], [2, 0], [2, 1]]]);

test('difference: Difference of no geometries produces an empty geometry', t => {
  t.true(equals(difference(), fromPolygons({}, [])));
});

test('difference: Difference of one geometry produces that geometry', t => {
  t.true(equals(difference(rectangle), rectangle));
});

test('difference: Difference of rectangle with itself produces an empty geometry', t => {
  t.true(equals(difference(rectangle, rectangle), fromPolygons({}, [])));
});

test('difference: Difference of rectangle with itself rotated 90 degrees produces L', t => {
  t.true(equals(difference(rectangle, transform(fromZRotation(degToRad(90)), rectangle)),
                fromPolygons({}, [[[0, 0], [2, 0], [2, 1], [0, 1]]])));
});
