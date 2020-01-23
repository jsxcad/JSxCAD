import { canonicalize } from '@jsxcad/geometry-tagged';

import pack from './pack';
import test from 'ava';

test('Partial fit', t => {
  const [packed, unpacked] = pack({ size: [110, 110], itemMargin: 1, pageMargin: 0 },
                                  { paths: [[[50, 50, 0], [100, 100, 0]]], tags: ['one'] },
                                  { paths: [[[50, 50, 0], [100, 150, 0]]], tags: ['two'] },
                                  { paths: [[[50, 50, 0], [150, 100, 0]]], tags: ['three'] });
  t.deepEqual(packed.map(canonicalize),
              [{ 'paths': [[[-54, 154, 0], [-4, 204, 0]]], 'tags': ['one'] }, { 'paths': [[[-54, 102, 0], [46, 152, 0]]], 'tags': ['three'] }]);
  t.deepEqual(unpacked.map(canonicalize),
              [{ 'paths': [[[50, 50, 0], [100, 150, 0]]], 'tags': ['two'] }]);
});

test('Partial rotated fit', t => {
  const [packed, unpacked] = pack({ size: [60, 110], itemMargin: 1, pageMargin: 0 },
                                  { paths: [[[50, 50, 0], [100, 100, 0]]], tags: ['one'] },
                                  { paths: [[[50, 50, 0], [100, 150, 0]]], tags: ['two'] },
                                  { paths: [[[50, 50, 0], [150, 100, 0]]], tags: ['three'] });
  t.deepEqual(packed.map(canonicalize),
              [{ 'paths': [[[-29, 154, 0], [21, 204, 0]]], 'tags': ['one'] }]);
  t.deepEqual(unpacked.map(canonicalize),
              [{ 'paths': [[[50, 50, 0], [100, 150, 0]]], 'tags': ['two'] }, { 'paths': [[[50, 50, 0], [150, 100, 0]]], 'tags': ['three'] }]);
});

test('Complete fit', t => {
  const [packed, unpacked] = pack({ size: [200, 200], itemMargin: 1, pageMargin: 0 },
                                  { paths: [[[50, 50, 0], [100, 100, 0]]], tags: ['one'] },
                                  { paths: [[[50, 50, 0], [100, 150, 0]]], tags: ['two'] },
                                  { paths: [[[50, 50, 0], [150, 100, 0]]], tags: ['three'] });
  t.deepEqual(packed.map(canonicalize),
              [{ 'paths': [[[-99, 199, 0], [-49, 249, 0]]], 'tags': ['one'] }, { 'paths': [[[-99, 147, 0], [-49, 247, 0]]], 'tags': ['two'] }, { 'paths': [[[-47, 199, 0], [53, 249, 0]]], 'tags': ['three'] }]);
  t.deepEqual(unpacked.map(canonicalize),
              []);
});

test('Growing fit', t => {
  const [packed, unpacked] = pack({},
                                  { paths: [[[50, 50, 0], [100, 100, 0]]], tags: ['one'] },
                                  { paths: [[[50, 50, 0], [100, 150, 0]]], tags: ['two'] },
                                  { paths: [[[50, 50, 0], [150, 100, 0]]], tags: ['three'] });
  t.deepEqual(packed.map(canonicalize),
              [{ 'paths': [[[1, 99, 0], [51, 149, 0]]], 'tags': ['one'] }, { 'paths': [[[1, 47, 0], [51, 147, 0]]], 'tags': ['two'] }, { 'paths': [[[53, 99, 0], [153, 149, 0]]], 'tags': ['three'] }]);
  t.deepEqual(unpacked.map(canonicalize),
              []);
});
