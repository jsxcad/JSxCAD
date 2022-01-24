import test from 'ava';
import { toGcode } from './toGcode.js';

test('Simple', async (t) => {
  const code = await toGcode({
    type: 'toolpath',
    toolpath: [
      { op: 'jump', to: [1, 2, 3], speed: 100, power: 50 },
      { op: 'cut', to: [4, 5, 6], speed: 50, power: 100 },
    ],
  });
  t.is(
    new TextDecoder('utf8').decode(code),
    `
G21
M3
F100
S50
G0 X1 Y2 Z3
F50
S100
G1 X4 Y5 Z6
M5
`
  );
});
