import { drop } from './drop';
import test from 'ava';

test('Deep drop', t => {
  const assembly = { assembly: [{ solid: [], tags: [ 'plate' ] },
                                { assembly: [{ solid: [] },
                                             { assembly: [{ solid: [], tags: ['void'] },
                                                          { solid: [], tags: ['void'] },
                                                          { solid: [], tags: ['void'] }] }] }] };
  const dropped = drop(['void'], assembly);
  t.deepEqual(dropped,
              { 'assembly': [{ 'solid': [], 'tags': ['plate'] },
                             { 'assembly': [{ 'solid': [], tags: undefined },
                                            { 'assembly': [{ 'solid': [], 'tags': ['@drop', 'void'] },
                                                           { 'solid': [], 'tags': ['@drop', 'void'] },
                                                           { 'solid': [], 'tags': ['@drop', 'void'] }] }] }] });
});
