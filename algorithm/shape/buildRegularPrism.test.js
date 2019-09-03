import { buildRegularPrism } from './buildRegularPrism';
import { canonicalize } from '@jsxcad/geometry-solid';
import test from 'ava';
import { toKeptGeometry } from '@jsxcad/geometry-tagged';

test('A simple triangular prism', t => {
  const geometry = toKeptGeometry(buildRegularPrism(3));
  t.deepEqual(canonicalize(geometry.solid),
              [[[[-0.5, -0.86603, -0.5], [-0.5, -0.86603, 0.5], [-0.5, 0.86603, 0.5], [-0.5, 0.86603, -0.5]]], [[[-0.5, 0.86603, -0.5], [-0.5, 0.86603, 0.5], [1, 0, 0.5], [1, 0, -0.5]]], [[[1, 0, -0.5], [1, 0, 0.5], [-0.5, -0.86603, 0.5], [-0.5, -0.86603, -0.5]]], [[[1, 0, 0.5], [-0.5, 0.86603, 0.5], [-0.5, -0.86603, 0.5]]], [[[-0.5, -0.86603, -0.5], [-0.5, 0.86603, -0.5], [1, 0, -0.5]]]]);
});
