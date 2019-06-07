import { canonicalize } from './canonicalize';
import { map } from './map';
import test from 'ava';

test('Add tags', t => {
  const mapped = map({ assembly: [{ points: [], tags: ['a'] }, { points: [], tags: ['b'] }, { assembly: [{ points: [], tags: 'c' }], tags: ['d'] }], tags: ['e'] },
                     (geometry) => Object.assign({}, geometry, { tags: [].concat(geometry.tags, ['x']) }));
  t.deepEqual(canonicalize(mapped),
              {
                'assembly': [{
                  'assembly': [{ 'points': [], 'tags': ['c', 'x'] }],
                  'tags': ['d', 'x']
                },
                             {
                               'points': [],
                               'tags': ['b', 'x']
                             },
                             {
                               'points': [],
                               'tags': ['a', 'x']
                             }],
                'tags': ['e', 'x']
              });
});
