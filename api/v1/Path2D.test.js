import { Path2D } from './Path2D';
import { canonicalize } from '@jsxcad/algorithm-path';
import { fromZRotation } from '@jsxcad/math-mat4';
import { test } from 'ava';

test('Empty path has no points', t => {
  t.deepEqual(new Path2D().getPoints(), []);
});

test('Empty path is not closed by default', t => {
  t.is(new Path2D().isClosed(), false);
});

test('Empty path with one appended has one point', t => {
  t.deepEqual(new Path2D().appendPoint([0, 0]).getPoints(), [[0, 0]]);
});

test('Empty path with two appended has two point', t => {
  t.deepEqual(new Path2D().appendPoints([[0, 0], [1, 1]]).getPoints(), [[0, 0], [1, 1]]);
});

test('Path.arc() works', t => {
  t.deepEqual(canonicalize(
    Path2D.arc({ center: [5, 5],
                 radius: 10,
                 startangle: 90,
                 endangle: 180,
                 resolution: 36,
                 maketangent: true }).getPoints()),
              [[5, 15, 0],
               [4.91273, 14.99962, 0],
               [3.36674, 14.86572, 0],
               [1.86008, 14.49425, 0],
               [0.42902, 13.89416, 0],
               [-0.89196, 13.07990, 0],
               [-2.07107, 12.07107, 0],
               [-3.07990, 10.89196, 0],
               [-3.89416, 9.57098, 0],
               [-4.49425, 8.13992, 0],
               [-4.86572, 6.63326, 0],
               [-4.99962, 5.08727, 0],
               [-5, 5, 0]]);
});

test('Path concatenation works', t => {
  t.deepEqual(new Path2D([[1, 2]]).concat(new Path2D([[3, 4]])).getPoints(),
              [[1, 2], [3, 4]]);
});

test('Closed path is closed', t => {
  t.true(new Path2D().close().isClosed());
});

test('Straight path is straight', t => {
  t.is(new Path2D([[0, 0], [0, 1], [0, 2]]).close().getTurn(), 'straight');
});

test('Right turn path has counter-clockwise turn', t => {
  t.is(new Path2D([[0, 0], [0, 1], [-1, 1]]).close().getTurn(), 'clockwise');
});

test('Left turn path has clockwise turn', t => {
  t.is(new Path2D([[0, 0], [0, 1], [+1, 1]]).close().getTurn(), 'counter-clockwise');
});

test('Transform works', t => {
  t.deepEqual(canonicalize(new Path2D([[0, 0], [0, 1]])
      .transform(fromZRotation(90 * 0.017453292519943295)).getPoints()),
              [[0, 0, 0], [-1, 0, 0]]);
});
