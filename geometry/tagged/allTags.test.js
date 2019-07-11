import { allTags } from './allTags';
import test from 'ava';

test('Extract tags', t => {
  const tags = allTags({ tags: ['a'],
                         assembly: [{ solid: [], tags: ['b'] },
                                    { disjointAssembly: [{ z0Surface: [], tags: ['c', 'd'] },
                                                         { paths: [], tags: ['a', 'c'] }] }] });
  t.deepEqual([...tags].sort(), ['a', 'b', 'c', 'd']);
});
