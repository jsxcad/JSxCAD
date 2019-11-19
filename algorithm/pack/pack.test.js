import { canonicalize } from '@jsxcad/geometry-tagged';

import pack from './pack';
import test from 'ava';

test('Partial fit', t => {
  const [packed, unpacked] = pack({ size: [110, 110] },
                                  { paths: [[[50, 50, 0], [100, 100, 0]]], tags: ['one'] },
                                  { paths: [[[50, 50, 0], [100, 150, 0]]], tags: ['two'] },
                                  { paths: [[[50, 50, 0], [150, 100, 0]]], tags: ['three'] });
  t.deepEqual(packed.map(canonicalize),
              [{"paths":[[[-50,-50,0],[0,50,0]]],"tags":["two"]}]);
  t.deepEqual(unpacked.map(canonicalize),
              [{"paths":[[[50,50,0],[100,100,0]]],"tags":["one"]},
               {"paths":[[[50,50,0],[150,100,0]]],"tags":["three"]}]);
});

test('Partial rotated fit', t => {
  const [packed, unpacked] = pack({ size: [60, 110] },
                                  { paths: [[[50, 50, 0], [100, 100, 0]]], tags: ['one'] },
                                  { paths: [[[50, 50, 0], [100, 150, 0]]], tags: ['two'] },
                                  { paths: [[[50, 50, 0], [150, 100, 0]]], tags: ['three'] });
  t.deepEqual(packed.map(canonicalize),
              [{"paths":[[[-25,-50,0],[25,50,0]]],"tags":["two"]}]);
  t.deepEqual(unpacked.map(canonicalize),
              [{"paths":[[[50,50,0],[100,100,0]]],"tags":["one"]},
               {"paths":[[[50,50,0],[150,100,0]]],"tags":["three"]}]);
});

test('Complete fit', t => {
  const [packed, unpacked] = pack({ size: [200, 200] },
                                  { paths: [[[50, 50, 0], [100, 100, 0]]], tags: ['one'] },
                                  { paths: [[[50, 50, 0], [100, 150, 0]]], tags: ['two'] },
                                  { paths: [[[50, 50, 0], [150, 100, 0]]], tags: ['three'] });
  t.deepEqual(packed.map(canonicalize),
              [{"paths":[[[-95,-95,0],[-45,5,0]]],"tags":["two"]},
               {"paths":[[[-95,15,0],[5,65,0]]],"tags":["three"]},
               {"paths":[[[15,15,0],[65,65,0]]],"tags":["one"]}]);
  t.deepEqual(unpacked.map(canonicalize),
              []);
});
