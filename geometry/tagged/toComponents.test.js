import test from 'ava';
import { toComponents } from './toComponents';

test('Requires A', t => {
  const assembly = { assembly: [{ solid: [], tags: ['a'] },
                                { solid: [], tags: ['b'] },
                                { solid: [], tags: ['a', 'b'] }] };
  const components = toComponents({ }, assembly);
  t.deepEqual(components, [{ 'tags': ['a'], 'solid': [] },
                           { 'tags': ['b'], 'solid': [] },
                           { 'tags': ['a', 'b'], 'solid': [] }]);
});
