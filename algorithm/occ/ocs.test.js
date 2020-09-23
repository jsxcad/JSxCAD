import { getOcs } from './ocs.js';
import test from 'ava';

export const triangle = [
  [1, 0, 0],
  [-0.5, 0.86603, 0],
  [-0.5, -0.86603, 0], 
  [1, 0, 0],
];

test('Offset', async t => {
  const ocs = await getOcs();
console.log(ocs);
  const a = ocs.offset(JSON.stringify(triangle), 0.1);
  t.is(a, '[[-0.60000000000000075, 1.0392355403787492, 0], [1.1999992039168654, 8.3266726846886741e-17, 0], [-0.59999999999999998, -1.0392355403787485, 0]]');

  const b = ocs.offset(JSON.stringify(triangle), 0.5);
  t.is(b, '[[-1.0000000000000009, 1.7320577018937442, 0], [1.999996019584328, 1.1102230246251565e-16, 0], [-1, -1.7320577018937438, 0]]');

  const c = ocs.offset(JSON.stringify(triangle), -0.5);
  t.is(c, '[[3.9804156717337946e-06, 0, 0], [-3.3306690738754696e-16, 2.2981062562932308e-06, 0], [-2.0135455463892414e-17, -2.2981062560711862e-06, 0]]');

  const d = ocs.offset(JSON.stringify(triangle), -10);
  t.is(d, '');
});
