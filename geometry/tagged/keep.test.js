import { keep } from './keep';
import test from 'ava';

test('Deep keep', t => {
  const assembly = { assembly: [{ solid: [],
                                  tags: [ 'plate' ] },
                                { assembly: [{ solid: [] },
                                             { assembly: [{ solid: [], tags: ['void'] },
                                                          { solid: [], tags: ['void'] },
                                                          { solid: [], tags: ['void'] }],
                                               tags: ['void'] }] }] };
  const kept = keep(['void'], assembly);
  t.deepEqual(kept,
              { 'assembly': [{ 'solid': [], 'tags': ['compose/non-positive', 'plate'] },
                             { 'assembly': [{ 'solid': [], 'tags': ['compose/non-positive'] },
                                            { 'assembly': [{ 'solid': [], 'tags': ['void'] },
                                                           { 'solid': [], 'tags': ['void'] },
                                                           { 'solid': [], 'tags': ['void'] }] }] }] });
});
