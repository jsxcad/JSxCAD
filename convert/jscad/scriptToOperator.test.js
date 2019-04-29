import { canonicalize } from '@jsxcad/algorithm-assembly';
import { scriptToOperator } from './scriptToOperator';
import { test } from 'ava';

test('Trivial', async (t) => {
  const { getAssembly } = await scriptToOperator({}, 'const main = () => cube();');
  t.deepEqual(canonicalize(getAssembly()),
              { assembly: [{ solid: [[[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
                                     [[[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]],
                                     [[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
                                     [[[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]],
                                     [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]],
                                     [[[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]]] }] });
});

test('Include', async (t) => {
  const { getAssembly } = await scriptToOperator({}, 'include("cuboid.jscad"); const main = () => cuboid();');
  t.deepEqual(canonicalize(getAssembly()),
              { assembly: [{ solid: [[[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
                                     [[[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]],
                                     [[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
                                     [[[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]],
                                     [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]],
                                     [[[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]]] }] });
});

test('Parameters', async (t) => {
  const { getAssembly, getParameterDefinitions } =
      await scriptToOperator({},
                             `
                              function getParameterDefinitions() {
                                return [{ name: 'size', type: 'float', initial: 10, caption: "Size" }];
                              }
                              const main = ({ size }) => cube(size);
                             `
      );
  t.deepEqual(canonicalize(getAssembly({ size: 2 })),
              { assembly: [{ solid: [[[[0, 0, 0], [0, 0, 2], [0, 2, 2], [0, 2, 0]]],
                                     [[[2, 0, 0], [2, 2, 0], [2, 2, 2], [2, 0, 2]]],
                                     [[[0, 0, 0], [2, 0, 0], [2, 0, 2], [0, 0, 2]]],
                                     [[[0, 2, 0], [0, 2, 2], [2, 2, 2], [2, 2, 0]]],
                                     [[[0, 0, 0], [0, 2, 0], [2, 2, 0], [2, 0, 0]]],
                                     [[[0, 0, 2], [2, 0, 2], [2, 2, 2], [0, 2, 2]]]] }] });
  t.deepEqual(getParameterDefinitions(),
              [{ name: 'size', type: 'float', initial: 10, caption: 'Size' }]);
});
