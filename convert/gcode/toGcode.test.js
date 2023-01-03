import test from 'ava';
import { toGcode } from './toGcode.js';

test('Simple', async (t) => {
  const code = await toGcode(
    {
      type: 'segments',
      tags: ['type:toolpath', 'toolpath:speed=50', 'toolpath:feedrate=100'],
      segments: [
        [[], [1, 2, 3]],
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
      ],
    },
    { speed: 3, feedrate: 4 }
  );
  t.is(
    new TextDecoder('utf8').decode(code),
    `
G21
G90
M3
S3
F4
S50
F100
G1 X1 Y2 Z3
G1 X4 Y5 Z6
G0 Z1
G1 Z6
M5
G0 Z1
G0 X0 Y0
`
  );
});
