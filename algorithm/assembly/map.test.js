import { map } from './map';
import { test } from 'ava';

test('Add tags', t => {
  const mapped = map({ assembly: [{ tags: ['a'] }, { tags: ['b'] }, { assembly: [{ tags: 'c' }] }] },
                     ({ tags }) => ({ tags: [].concat(tags, ['x']) }));
  t.deepEqual(mapped,
              {
                assembly: [{ tags: ['a', 'x'] },
                           { tags: ['b', 'x'] },
                           {
                             assembly: [{ 'tags': ['c', 'x'] }],
                             tags: undefined
                           }],
                tags: undefined
              });
});
