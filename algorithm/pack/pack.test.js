import { canonicalize } from '@jsxcad/geometry-tagged';

import pack from './pack';
import test from 'ava';

test('Partial fit', t => {
  const [packed, unpacked] = pack({ size: [110, 110] },
                                  { paths: [[[50, 50, 0], [100, 100, 0]]], tags: ['one'] },
                                  { paths: [[[50, 50, 0], [100, 150, 0]]], tags: ['two'] },
                                  { paths: [[[50, 50, 0], [150, 100, 0]]], tags: ['three'] });
  t.deepEqual(packed.map(canonicalize),
              [{ 'paths': [[[5, 5, 0], [55, 105, 0]]], 'tags': ['two'] }]);
  t.deepEqual(unpacked.map(canonicalize),
              [{ 'paths': [[[50, 50, 0], [100, 100, 0]]], 'tags': ['one'] },
               { 'paths': [[[50, 50, 0], [150, 100, 0]]], 'tags': ['three'] }]);
});

test('Partial rotated fit', t => {
  const [packed, unpacked] = pack({ size: [60, 110] },
                                  { paths: [[[50, 50, 0], [100, 100, 0]]], tags: ['one'] },
                                  { paths: [[[50, 50, 0], [100, 150, 0]]], tags: ['two'] },
                                  { paths: [[[50, 50, 0], [150, 100, 0]]], tags: ['three'] });
  t.deepEqual(packed.map(canonicalize),
              [{ 'paths': [[[5, 5, 0], [55, 105, 0]]], 'tags': ['two'] }]);
  t.deepEqual(unpacked.map(canonicalize),
              [{ 'paths': [[[50, 50, 0], [100, 100, 0]]], 'tags': ['one'] },
               { 'paths': [[[50, 50, 0], [150, 100, 0]]], 'tags': ['three'] }]);
});

test('Complete fit', t => {
  const [packed, unpacked] = pack({ size: [200, 200] },
                                  { paths: [[[50, 50, 0], [100, 100, 0]]], tags: ['one'] },
                                  { paths: [[[50, 50, 0], [100, 150, 0]]], tags: ['two'] },
                                  { paths: [[[50, 50, 0], [150, 100, 0]]], tags: ['three'] });
  t.deepEqual(packed.map(canonicalize),
              [{ 'paths': [[[5, 5, 0], [55, 105, 0]]], 'tags': ['two'] },
               { 'paths': [[[5, 115, 0], [105, 165, 0]]], 'tags': ['three'] },
               { 'paths': [[[115, 115, 0], [165, 165, 0]]], 'tags': ['one'] }]);
  t.deepEqual(unpacked.map(canonicalize),
              []);
});
