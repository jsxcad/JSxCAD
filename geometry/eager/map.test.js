import { canonicalize } from './canonicalize';
import { map } from './map';
import test from 'ava';

test('Add tags', t => {
  const mapped = map({ assembly: [{ tags: ['a'] }, { tags: ['b'] }, { assembly: [{ tags: 'c' }], tags: ['d'] }], tags: ['e'] },
                     (geometry) => Object.assign({}, geometry, { tags: [].concat(geometry.tags, ['x']) }));
  t.deepEqual(canonicalize(mapped),
              {
                assembly: [{ tags: ['a', 'x'] },
                           { tags: ['b', 'x'] },
                           { assembly: [{ 'tags': ['c', 'x'] }], tags: ['d', 'x'] }],
                tags: ['e', 'x']
              });
});
