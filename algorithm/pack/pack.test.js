import { boot } from '@jsxcad/sys';
import { canonicalize } from '@jsxcad/geometry';

import pack from './pack.js';
import test from 'ava';

test.beforeEach(async (t) => {
  await boot();
});

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
  t.deepEqual(JSON.parse(JSON.stringify(packed.map(canonicalize))), [
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
  ]);
  t.deepEqual(JSON.parse(JSON.stringify(unpacked.map(canonicalize))), [
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
  t.deepEqual(JSON.parse(JSON.stringify(packed.map(canonicalize))), [
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
  ]);
  t.deepEqual(JSON.parse(JSON.stringify(unpacked.map(canonicalize))), [
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
  t.deepEqual(JSON.parse(JSON.stringify(packed.map(canonicalize))), [
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
  t.deepEqual(JSON.parse(JSON.stringify(packed.map(canonicalize))), [
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
  ]);
  t.deepEqual(unpacked.map(canonicalize), []);
});
