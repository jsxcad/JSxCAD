import { scriptToOperator } from './scriptToOperator';
import { toGeneric } from '@jsxcad/algorithm-solid';
import { test } from 'ava';

test('Trivial', async (t) => {
  const { solids } = (await scriptToOperator({}, 'const main = () => cube();'))();
  t.deepEqual(toGeneric(solids[0]),
              [[[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
               [[[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]],
               [[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
               [[[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]],
               [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]],
               [[[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]]]);
});

test('Include', async (t) => {
  const { solids } = (await scriptToOperator({}, 'include("cuboid.jscad"); const main = () => cuboid();'))();
  t.deepEqual(toGeneric(solids[0]),
              [[[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
               [[[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]],
               [[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
               [[[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]],
               [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]],
               [[[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]]]);
});

test('Parameters', async (t) => {
  const cube =
      await scriptToOperator({},
                             `
                              function getParameterDefinitions() {
                                return [{ name: 'size', type: 'float', initial: 10, caption: "Size" }];
                              }
                              const main = ({ size }) => cube(size);
                             `
      );
  const { solids } = cube({ size: 2 });
  t.deepEqual(toGeneric(solids[0]),
              [[[[0, 0, 0], [0, 0, 2], [0, 2, 2], [0, 2, 0]]],
               [[[2, 0, 0], [2, 2, 0], [2, 2, 2], [2, 0, 2]]],
               [[[0, 0, 0], [2, 0, 0], [2, 0, 2], [0, 0, 2]]],
               [[[0, 2, 0], [0, 2, 2], [2, 2, 2], [2, 2, 0]]],
               [[[0, 0, 0], [0, 2, 0], [2, 2, 0], [2, 0, 0]]],
               [[[0, 0, 2], [2, 0, 2], [2, 2, 2], [0, 2, 2]]]]);
  t.deepEqual(cube.getParameterDefinitions(),
              [{ name: 'size', type: 'float', initial: 10, caption: 'Size' }]);
});
