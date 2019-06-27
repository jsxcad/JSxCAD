import { canonicalize } from '@jsxcad/geometry-tagged';
import { scriptToOperator } from './scriptToOperator';
import test from 'ava';

test('Trivial', async (t) => {
  const { getGeometry } = await scriptToOperator({}, 'const main = () => cube();');
  t.deepEqual(canonicalize(getGeometry()),
              { disjointAssembly: [{ solid: [[[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
                                             [[[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]],
                                             [[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
                                             [[[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]],
                                             [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]],
                                             [[[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]]] }] });
});

test('Include', async (t) => {
  const { getGeometry } = await scriptToOperator({}, 'include("cuboid.jscad"); const main = () => cuboid();');
  t.deepEqual(canonicalize(getGeometry()),
              { disjointAssembly: [{ solid: [[[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
                                             [[[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]],
                                             [[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
                                             [[[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]],
                                             [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]],
                                             [[[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]]] }] });
});

test('Parameters', async (t) => {
  const { getGeometry, getParameterDefinitions } =
      await scriptToOperator({},
                             `
                              function getParameterDefinitions() {
                                return [{ name: 'size', type: 'float', initial: 10, caption: "Size" }];
                              }
                              const main = ({ size }) => cube(size);
                             `
      );
  t.deepEqual(canonicalize(getGeometry({ size: 2 })),
              { disjointAssembly: [{ solid: [[[[0, 0, 0], [0, 0, 2], [0, 2, 2], [0, 2, 0]]],
                                             [[[2, 0, 0], [2, 2, 0], [2, 2, 2], [2, 0, 2]]],
                                             [[[0, 0, 0], [2, 0, 0], [2, 0, 2], [0, 0, 2]]],
                                             [[[0, 2, 0], [0, 2, 2], [2, 2, 2], [2, 2, 0]]],
                                             [[[0, 0, 0], [0, 2, 0], [2, 2, 0], [2, 0, 0]]],
                                             [[[0, 0, 2], [2, 0, 2], [2, 2, 2], [0, 2, 2]]]] }] });
  t.deepEqual(getParameterDefinitions(),
              [{ name: 'size', type: 'float', initial: 10, caption: 'Size' }]);
});
