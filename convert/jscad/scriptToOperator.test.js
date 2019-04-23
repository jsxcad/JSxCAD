import { scriptToOperator } from './scriptToOperator';
import { toGeneric } from '@jsxcad/algorithm-solid';
import { test } from 'ava';

test('Trivial', async (t) => {
  const { getAssembly } = await scriptToOperator({}, 'const main = () => cube();');
  t.deepEqual(toGeneric(getAssembly()[0].solid),
              [[[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
               [[[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]],
               [[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
               [[[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]],
               [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]],
               [[[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]]]);
});

test('Include', async (t) => {
  const { getAssembly } = await scriptToOperator({}, 'include("cuboid.jscad"); const main = () => cuboid();');
  t.deepEqual(toGeneric(getAssembly()[0].solid),
              [[[[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
               [[[1, 0, 0], [1, 1, 0], [1, 1, 1], [1, 0, 1]]],
               [[[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
               [[[0, 1, 0], [0, 1, 1], [1, 1, 1], [1, 1, 0]]],
               [[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]],
               [[[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]]]);
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
  const solid = getAssembly({ size: 2 })[0].solid;
  t.deepEqual(toGeneric(solid),
              [[[[0, 0, 0], [0, 0, 2], [0, 2, 2], [0, 2, 0]]],
               [[[2, 0, 0], [2, 2, 0], [2, 2, 2], [2, 0, 2]]],
               [[[0, 0, 0], [2, 0, 0], [2, 0, 2], [0, 0, 2]]],
               [[[0, 2, 0], [0, 2, 2], [2, 2, 2], [2, 2, 0]]],
               [[[0, 0, 0], [0, 2, 0], [2, 2, 0], [2, 0, 0]]],
               [[[0, 0, 2], [2, 0, 2], [2, 2, 2], [0, 2, 2]]]]);
  t.deepEqual(getParameterDefinitions(),
              [{ name: 'size', type: 'float', initial: 10, caption: 'Size' }]);
});
