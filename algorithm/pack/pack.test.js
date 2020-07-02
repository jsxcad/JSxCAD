import { canonicalize } from '@jsxcad/geometry-tagged';

import pack from './pack.js';
import test from 'ava';

test('Partial fit', (t) => {
  const [packed, unpacked] = pack(
    { size: [110, 110], itemMargin: 1, pageMargin: 0 },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [100, 100, 0],
        ],
      ],
      tags: ['one'],
    },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [100, 150, 0],
        ],
      ],
      tags: ['two'],
    },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [150, 100, 0],
        ],
      ],
      tags: ['three'],
    }
  );
  t.deepEqual(packed.map(canonicalize), [
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'paths',
          paths: [
            [
              [-54, -54, 0],
              [-4, 46, 0],
            ],
          ],
          tags: ['two'],
        },
      ],
    },
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'paths',
          paths: [
            [
              [-2, -54, 0],
              [48, -4, 0],
            ],
          ],
          tags: ['one'],
        },
      ],
    },
  ]);
  t.deepEqual(unpacked.map(canonicalize), [
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [150, 100, 0],
        ],
      ],
      tags: ['three'],
    },
  ]);
});

test('Partial rotated fit', (t) => {
  const [packed, unpacked] = pack(
    { size: [60, 110], itemMargin: 1, pageMargin: 0 },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [100, 100, 0],
        ],
      ],
      tags: ['one'],
    },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [100, 150, 0],
        ],
      ],
      tags: ['two'],
    },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [150, 100, 0],
        ],
      ],
      tags: ['three'],
    }
  );
  t.deepEqual(packed.map(canonicalize), [
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'paths',
          paths: [
            [
              [-29, -54, 0],
              [21, 46, 0],
            ],
          ],
          tags: ['two'],
        },
      ],
    },
  ]);
  t.deepEqual(unpacked.map(canonicalize), [
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [150, 100, 0],
        ],
      ],
      tags: ['three'],
    },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [100, 100, 0],
        ],
      ],
      tags: ['one'],
    },
  ]);
});

test('Complete fit', (t) => {
  const [packed, unpacked] = pack(
    { size: [200, 200], itemMargin: 1, pageMargin: 0 },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [100, 100, 0],
        ],
      ],
      tags: ['one'],
    },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [100, 150, 0],
        ],
      ],
      tags: ['two'],
    },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [150, 100, 0],
        ],
      ],
      tags: ['three'],
    }
  );
  t.deepEqual(packed.map(canonicalize), [
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'paths',
          paths: [
            [
              [-99, -99, 0],
              [-49, 1, 0],
            ],
          ],
          tags: ['two'],
        },
      ],
    },
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'paths',
          paths: [
            [
              [-47, -99, 0],
              [53, -49, 0],
            ],
          ],
          tags: ['three'],
        },
      ],
    },
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'paths',
          paths: [
            [
              [-99, 3, 0],
              [-49, 53, 0],
            ],
          ],
          tags: ['one'],
        },
      ],
    },
  ]);
  t.deepEqual(unpacked.map(canonicalize), []);
});

test('Growing fit', (t) => {
  const [packed, unpacked] = pack(
    {},
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [100, 100, 0],
        ],
      ],
      tags: ['one'],
    },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [100, 150, 0],
        ],
      ],
      tags: ['two'],
    },
    {
      type: 'paths',
      paths: [
        [
          [50, 50, 0],
          [150, 100, 0],
        ],
      ],
      tags: ['three'],
    }
  );
  t.deepEqual(packed.map(canonicalize), [
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'paths',
          paths: [
            [
              [6, 6, 0],
              [56, 106, 0],
            ],
          ],
          tags: ['two'],
        },
      ],
    },
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'paths',
          paths: [
            [
              [58, 6, 0],
              [158, 56, 0],
            ],
          ],
          tags: ['three'],
        },
      ],
    },
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'paths',
          paths: [
            [
              [6, 108, 0],
              [56, 158, 0],
            ],
          ],
          tags: ['one'],
        },
      ],
    },
  ]);
  t.deepEqual(unpacked.map(canonicalize), []);
});

// return Layers(...numbers(n => Square(10, 40).outline(), { to: 1 }))
//   .Page({ size: [30, 120]});

test('Bad fit', (t) => {
  const [packed, unpacked] = pack(
    { size: [30, 120] },
    {
      type: 'surface',
      surface: [
        [
          [5.000000000000001, 20, 0],
          [-5, 20.000000000000004, 0],
          [-5.000000000000001, -19.999999999999996, 0],
          [4.999999999999999, -20.000000000000004, 0],
        ],
      ],
    },
    {
      type: 'surface',
      surface: [
        [
          [5.000000000000001, 20, 0],
          [-5, 20.000000000000004, 0],
          [-5.000000000000001, -19.999999999999996, 0],
          [4.999999999999999, -20.000000000000004, 0],
        ],
      ],
    }
  );
  t.deepEqual(packed.map(canonicalize), [
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'surface',
          surface: [
            [
              [1, -14, 0],
              [-9, -14, 0],
              [-9, -54, 0],
              [1, -54, 0],
            ],
          ],
        },
      ],
    },
    {
      type: 'disjointAssembly',
      content: [
        {
          type: 'surface',
          surface: [
            [
              [1, 28, 0],
              [-9, 28, 0],
              [-9, -12, 0],
              [1, -12, 0],
            ],
          ],
        },
      ],
    },
  ]);
  t.deepEqual(unpacked.map(canonicalize), []);
});
