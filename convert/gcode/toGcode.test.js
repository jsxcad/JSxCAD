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
    `\r
G21\r
G90\r
M3\r
F100\r
S50\r
G1 X1 Y2 Z3\r
G1 X4 Y5 Z6\r
G0 Z1\r
G1 Z6\r
M5\r
G0 Z1\r
`
  );
});
