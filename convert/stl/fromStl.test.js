import { canonicalize } from '@jsxcad/geometry-eager';
import { fromStl } from './fromStl';
import { readFileSync } from 'fs';
import { test } from 'ava';

test('Read example', async t => {
  const stl = readFileSync('fromStl.test.box.stl');
  const geometry = await fromStl({}, stl);
  t.deepEqual(canonicalize(geometry),
              { solid: [[[[-5, -5, -5], [-5, -5, 5], [-5, 5, 5]], [[-5, -5, -5], [-5, 5, 5], [-5, 5, -5]]], [[[5, -5, -5], [5, 5, -5], [5, 5, 5]], [[5, -5, -5], [5, 5, 5], [5, -5, 5]]], [[[-5, -5, -5], [5, -5, -5], [5, -5, 5]], [[-5, -5, -5], [5, -5, 5], [-5, -5, 5]]], [[[-5, 5, -5], [-5, 5, 5], [5, 5, 5]], [[-5, 5, -5], [5, 5, 5], [5, 5, -5]]], [[[-5, -5, -5], [-5, 5, -5], [5, 5, -5]], [[-5, -5, -5], [5, 5, -5], [5, -5, -5]]], [[[-5, -5, 5], [5, -5, 5], [5, 5, 5]], [[-5, -5, 5], [5, 5, 5], [-5, 5, 5]]]] });
});
