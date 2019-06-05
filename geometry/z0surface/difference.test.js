import { canonicalize, transform } from '@jsxcad/geometry-polygons';

import { degToRad } from '@jsxcad/math-utils';
import { difference } from './difference';
import { fromZRotation } from '@jsxcad/math-mat4';
import polygonClipping from 'polygon-clipping';
import test from 'ava';

// FIX: Check multipolygon construction against example/v1/squares*.js

const squares = [[[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0.5, 0], [-0.5, 0.5, 0]],
                 [[1.5, -0.5, 0], [2, -0.5, 0], [2, 0.5, 0], [1.5, 0.5, 0]]];

const rectangle = [[[0, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]]];

test('difference: Difference of one geometry produces that geometry', t => {
  t.deepEqual(difference(rectangle), rectangle);
});

test('difference: Difference of rectangle with itself produces an empty geometry', t => {
  t.deepEqual(difference(rectangle, rectangle), []);
});

test('difference: Difference of rectangle with itself rotated 90 degrees produces rectangle', t => {
  t.deepEqual(difference(rectangle, transform(fromZRotation(degToRad(90)), rectangle)),
              rectangle);
});

test('difference: Difference of rectangle with itself rotated -45 degrees produces shape', t => {
  t.deepEqual(canonicalize(difference(rectangle, transform(fromZRotation(degToRad(-45)), rectangle))),
              [[[0, 0, 0], [0.70711, 0.70711, 0], [1.41421, 0, 0], [2, 0, 0], [2, 1, 0], [0, 1, 0]]]);
});

test('difference: Difference of two non-overlapping squares and a rectangle', t => {
  t.deepEqual(canonicalize(difference(squares, rectangle)),
              [[[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0, 0], [0, 0, 0], [0, 0.5, 0], [-0.5, 0.5, 0]]]);
});

test('difference: Handle empty geometries', t => {
  t.deepEqual(canonicalize(difference([], rectangle)), []);
  t.deepEqual(canonicalize(difference(rectangle, [])), rectangle);
  t.deepEqual(canonicalize(difference([], [])), []);
});

/*
test('Bad case', t => {
  const subjectGeom = [[[[-25, 3.061616997868383e-15], [-24.903926402016154, -0.9754516100806382], [-24.619397662556434, -1.9134171618254459], [-24.157348061512728, -2.777851165098008], [-23.535533905932738, -3.5355339059327346], [-22.77785116509801, -4.157348061512724], [-21.91341716182545, -4.619397662556431], [-20.97545161008064, -4.9039264020161495], [-20, -4.999999999999997], [-19.02454838991936, -4.9039264020161495], [-3.0865423622202206, -0.7956129244599208], [-3.1385128972903376, -0.6242890304516108], [-3.2, 3.9188697572715305e-16], [-3.1385128972903376, 0.6242890304516115], [-3.0865423622202206, 0.7956129244599224], [-19.02454838991936, 4.903926402016155], [-20, 5.000000000000003], [-20.97545161008064, 4.903926402016155], [-21.91341716182545, 4.619397662556436], [-22.77785116509801, 4.15734806151273], [-23.535533905932738, 3.5355339059327413], [-24.157348061512728, 2.777851165098014], [-24.619397662556434, 1.9134171618254552], [-24.903926402016154, 0.9754516100806466]]]];

  const clippingGeoms = [[[[[-20, 2.4492935982947065e-15], [-19.923141121612925, -0.7803612880645105], [-19.695518130045148, -1.530733729460357], [-19.325878449210183, -2.2222809320784065], [-18.82842712474619, -2.8284271247461876], [-18.22228093207841, -3.325878449210179], [-17.530733729460362, -3.695518130045145], [-16.780361288064512, -3.92314112161292], [-16, -3.9999999999999982], [-15.219638711935488, -3.92314112161292], [-3.08654236222022, -0.7956129244599214], [-3.1385128972903376, -0.6242890304516108], [-3.2, 3.9188697572715305e-16], [-3.1385128972903376, 0.6242890304516115], [-3.0865423622202193, 0.7956129244599219], [-15.219638711935488, 3.923141121612923], [-16, 4.000000000000002], [-16.780361288064512, 3.923141121612924], [-17.530733729460362, 3.6955181300451487], [-18.22228093207841, 3.325878449210184], [-18.82842712474619, 2.8284271247461934], [-19.325878449210183, 2.222280932078411], [-19.695518130045148, 1.5307337294603642], [-19.923141121612925, 0.7803612880645174]]]]];

  const result = polygonClipping.difference(subjectGeom, ...clippingGeoms);
  t.deepEqual(result, []);
});
*/
