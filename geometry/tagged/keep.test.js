import { keep } from './keep';
import test from 'ava';

test('Deep keep', t => {
  const assembly = { assembly: [{ solid: [],
                                  tags: [ 'plate' ] },
                                { assembly: [{ solid: [] },
                                             { assembly: [{ solid: [] },
                                                          { solid: [] },
                                                          { solid: [] }],
                                               tags: ['void'] }] }] };
  const kept = keep(['void'], assembly);
  t.deepEqual(kept,
              { assembly: [{ solid: [], tags: ['@drop', 'plate'] },
                           { assembly: [{ solid: [], tags: ['@drop'] },
                                        { assembly: [{ solid: [] },
                                                     { solid: [] },
                                                     { solid: [] }],
                                          tags: ['void'] }] }] });
});
