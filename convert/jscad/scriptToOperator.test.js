import { canonicalize } from '@jsxcad/geometry-tagged';
import { scriptToOperator } from './scriptToOperator';
import test from 'ava';

test('Trivial', async (t) => {
  const { getGeometry } = await scriptToOperator({}, new TextEncoder('utf8').encode('const main = () => cube();'));
  t.deepEqual(canonicalize(getGeometry()),
              { 'assembly': [{ 'solid': [[[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]], [[[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]], [[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]], [[[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]], [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]], [[[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]]] }] });
});

test('Include', async (t) => {
  const { getGeometry } = await scriptToOperator({}, new TextEncoder('utf8').encode('include("cuboid.jscad"); const main = () => cuboid();'));
  t.deepEqual(canonicalize(getGeometry()),
              { 'assembly': [{ 'solid': [[[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]], [[[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]], [[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]], [[[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]], [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]], [[[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]]] }] });
});

test('Parameters', async (t) => {
  const { getGeometry, getParameterDefinitions } =
      await scriptToOperator({},
                             new TextEncoder('utf8').encode(
                               `
                              function getParameterDefinitions() {
                                return [{ name: 'size', type: 'float', initial: 10, caption: "Size" }];
                              }
                              const main = ({ size }) => cube(2);
                             `)
      );
  t.deepEqual(canonicalize(getGeometry({ size: 2 })),
              { 'assembly': [{ 'solid': [[[[0, 0, 0], [0, 0, 2], [0, 2, 2], [0, 2, 0]]], [[[2, 0, 0], [2, 2, 0], [2, 2, 2], [2, 0, 2]]], [[[0, 0, 0], [2, 0, 0], [2, 0, 2], [0, 0, 2]]], [[[0, 2, 0], [0, 2, 2], [2, 2, 2], [2, 2, 0]]], [[[0, 0, 0], [0, 2, 0], [2, 2, 0], [2, 0, 0]]], [[[0, 0, 2], [2, 0, 2], [2, 2, 2], [0, 2, 2]]]] }] });
  t.deepEqual(getParameterDefinitions(),
              [{ name: 'size', type: 'float', initial: 10, caption: 'Size' }]);
});
